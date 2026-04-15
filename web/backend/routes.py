"""API route definitions for the KmerLex backend."""

from flask import Blueprint, jsonify, request

from internal.adapters.regex_lexer import CamfranglaisLexer
from internal.adapters.recursive_descent import CamfranglaisParser
from internal.core.services.analyze_syntax import SyntaxAnalyzer
from internal.core.domain.errors import KmerLexError

from web.backend.serializers import token_to_dict, ast_to_dict

api = Blueprint("api", __name__)


def _build_analyzer():
    """Create a fresh analyzer stack for each request.

    The parser keeps mutable cursor state, so sharing a single instance
    across concurrent requests would be unsafe.
    """
    lexer = CamfranglaisLexer()
    parser = CamfranglaisParser()
    return lexer, SyntaxAnalyzer(lexer, parser)


def _success(data):
    return jsonify({"success": True, "data": data})


def _error_response(message, error_type, line=None, column=None, status=400):
    err = {"message": message, "type": error_type}
    if line is not None:
        err["line"] = line
    if column is not None:
        err["column"] = column
    return jsonify({"error": err}), status


def _handle_kmerlex_error(exc):
    return _error_response(
        message=str(exc.message),
        error_type=type(exc).__name__,
        line=exc.line,
        column=exc.column,
    )


@api.route("/api/health", methods=["GET"])
def health():
    """Return service health status."""
    return _success({"status": "healthy", "service": "kmerlex-api"})


@api.route("/api/tokenize", methods=["POST"])
def tokenize():
    """Tokenize source code and return the token list."""
    body = request.get_json(silent=True)
    if not body or "source" not in body:
        return _error_response(
            "Request body must include a 'source' field.",
            "ValidationError",
        )

    source = body["source"]
    if not isinstance(source, str):
        return _error_response("'source' must be a string.", "ValidationError")

    try:
        lexer, _ = _build_analyzer()
        tokens = lexer.tokenize(source)
        return _success({"tokens": [token_to_dict(t) for t in tokens]})
    except KmerLexError as exc:
        return _handle_kmerlex_error(exc)


@api.route("/api/analyze", methods=["POST"])
def analyze():
    """Analyze source code in the requested mode (lexical or syntactic)."""
    body = request.get_json(silent=True)
    if not body or "source" not in body:
        return _error_response(
            "Request body must include a 'source' field.",
            "ValidationError",
        )

    source = body["source"]
    mode = body.get("mode", "syntactic")

    if not isinstance(source, str):
        return _error_response("'source' must be a string.", "ValidationError")

    if mode not in ("lexical", "syntactic"):
        return _error_response(
            "mode must be 'lexical' or 'syntactic'.",
            "ValidationError",
        )

    try:
        lexer, analyzer = _build_analyzer()

        if mode == "lexical":
            tokens = lexer.tokenize(source)
            return _success({"tokens": [token_to_dict(t) for t in tokens]})

        program = analyzer.analyze(source)
        return _success({"ast": ast_to_dict(program)})

    except KmerLexError as exc:
        return _handle_kmerlex_error(exc)
