"""Serialization helpers for converting domain objects to JSON-friendly dicts."""

import dataclasses
from typing import Any, Dict, Optional

from internal.core.domain.tokens import Token
from internal.core.domain.ast_nodes import ASTNode


def token_to_dict(token: Token) -> Dict[str, Any]:
    """Convert a Token to a JSON-serializable dictionary."""
    return {
        "value": token.value,
        "type": token.type.name,
        "line": token.line,
        "column": token.column,
    }


def ast_to_dict(node: Optional[Any]) -> Any:
    """Recursively convert an ASTNode (or Token) to a JSON-serializable dict.

    Fields with ``None`` values are omitted to keep responses compact.
    """
    if node is None:
        return None

    if isinstance(node, Token):
        return token_to_dict(node)

    if isinstance(node, list):
        return [ast_to_dict(item) for item in node]

    if dataclasses.is_dataclass(node) and not isinstance(node, type):
        result: Dict[str, Any] = {"node_type": type(node).__name__}
        for f in dataclasses.fields(node):
            value = getattr(node, f.name)
            if value is None:
                continue
            result[f.name] = ast_to_dict(value)
        return result

    # Primitive values pass through unchanged.
    return node
