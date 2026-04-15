"""Tests for the serialization helpers."""
import pytest
from internal.core.domain.tokens import Token, TokenType
from internal.core.domain.ast_nodes import (
    Program, Sentence, Declarative, Imperative, NominalGroup, VerbGroup,
    ArithmeticExpr,
)
from web.backend.serializers import token_to_dict, ast_to_dict


class TestTokenToDict:
    def test_basic(self):
        t = Token("Je", TokenType.TK_PRONOM_SUJET, 1, 1)
        d = token_to_dict(t)
        assert d == {"value": "Je", "type": "TK_PRONOM_SUJET", "line": 1, "column": 1}

    def test_epsilon(self):
        t = Token("", TokenType.EPSILON, 1, 5)
        d = token_to_dict(t)
        assert d["type"] == "EPSILON"


class TestAstToDict:
    def test_none(self):
        assert ast_to_dict(None) is None

    def test_token(self):
        t = Token("wanda", TokenType.TK_VERBE, 1, 4)
        d = ast_to_dict(t)
        assert d["type"] == "TK_VERBE"

    def test_list(self):
        result = ast_to_dict([])
        assert result == []

    def test_nominal_group(self):
        ng = NominalGroup(
            determinant=Token("le", TokenType.TK_DETERMINANT, 1, 1),
            nom=Token("fey", TokenType.TK_NOM, 1, 4),
        )
        d = ast_to_dict(ng)
        assert d["node_type"] == "NominalGroup"
        assert d["determinant"]["value"] == "le"

    def test_verb_group(self):
        vg = VerbGroup(verb=Token("wanda", TokenType.TK_VERBE, 1, 1))
        d = ast_to_dict(vg)
        assert d["node_type"] == "VerbGroup"
        assert "negation" not in d  # None fields omitted

    def test_full_program(self):
        prog = Program(sentence=[
            Sentence(
                proposition=Declarative(
                    sujet=NominalGroup(
                        pronom_sujet=Token("Je", TokenType.TK_PRONOM_SUJET, 1, 1),
                    ),
                    groupe_verb=VerbGroup(
                        verb=Token("wanda", TokenType.TK_VERBE, 1, 4),
                    ),
                ),
            ),
        ])
        d = ast_to_dict(prog)
        assert d["node_type"] == "Program"
        assert len(d["sentence"]) == 1
        sent = d["sentence"][0]
        assert sent["node_type"] == "Sentence"

    def test_primitive_passthrough(self):
        assert ast_to_dict("hello") == "hello"
        assert ast_to_dict(42) == 42

    def test_nested_nominal(self):
        ng = NominalGroup(
            determinant=Token("Les", TokenType.TK_DETERMINANT, 1, 1),
            nom=Token("gars", TokenType.TK_NOM, 1, 5),
            preposition=Token("du", TokenType.TK_PREPOSITION, 1, 10),
            modifier=NominalGroup(
                nom=Token("gouvernement", TokenType.TK_NOM, 1, 13),
            ),
        )
        d = ast_to_dict(ng)
        assert d["modifier"]["node_type"] == "NominalGroup"
        assert d["modifier"]["nom"]["value"] == "gouvernement"
