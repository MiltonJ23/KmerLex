"""Extended parser tests covering complex structures and error paths."""
import pytest
from internal.core.domain.tokens import TokenType, Token
from internal.core.domain.ast_nodes import (
    Program, Sentence, Imperative, Declarative, NominalGroup, VerbGroup,
)
from internal.core.domain.errors import SyntaxError
from internal.adapters.regex_lexer import CamfranglaisLexer
from internal.adapters.recursive_descent import CamfranglaisParser


@pytest.fixture
def lexer():
    return CamfranglaisLexer()


@pytest.fixture
def parser():
    return CamfranglaisParser()


def _parse(lexer, parser, code):
    return parser.parse(lexer.tokenize(code))


class TestImperative:
    def test_imperative_with_auxiliary(self, lexer, parser):
        prog = _parse(lexer, parser, "va tchop le fey")
        prop = prog.sentence[0].proposition
        assert isinstance(prop, Imperative)

    def test_imperative_verb_only(self, lexer, parser):
        prog = _parse(lexer, parser, "reste")
        prop = prog.sentence[0].proposition
        assert isinstance(prop, Imperative)
        assert isinstance(prop.verb, VerbGroup)

    def test_imperative_complement_is_nominal(self, lexer, parser):
        prog = _parse(lexer, parser, "tchop le fey")
        prop = prog.sentence[0].proposition
        assert isinstance(prop, Imperative)


class TestDeclarative:
    def test_declarative_pronom_verb(self, lexer, parser):
        prog = _parse(lexer, parser, "Je wanda")
        prop = prog.sentence[0].proposition
        assert isinstance(prop, Declarative)
        assert prop.sujet.pronom_sujet.value == "Je"

    def test_declarative_with_negation(self, lexer, parser):
        prog = _parse(lexer, parser, "Je ne tchop le fey")
        prop = prog.sentence[0].proposition
        assert isinstance(prop, Declarative)
        assert prop.groupe_verb.negation is not None

    def test_declarative_with_object_pronoun(self, lexer, parser):
        prog = _parse(lexer, parser, "Je me wanda")
        prop = prog.sentence[0].proposition
        assert isinstance(prop, Declarative)

    def test_declarative_cest(self, lexer, parser):
        prog = _parse(lexer, parser, "La route ci c'est le fey")
        prop = prog.sentence[0].proposition
        assert isinstance(prop, Declarative)
        assert prop.has_cest is not None

    def test_declarative_with_auxiliary(self, lexer, parser):
        prog = _parse(lexer, parser, "On a tchop")
        prop = prog.sentence[0].proposition
        assert isinstance(prop, Declarative)
        assert prop.groupe_verb.auxiliary is not None

    def test_declarative_with_complement(self, lexer, parser):
        prog = _parse(lexer, parser, "Je wait le fap")
        prop = prog.sentence[0].proposition
        assert isinstance(prop, Declarative)
        assert prop.complement is not None

    def test_declarative_with_interrogative(self, lexer, parser):
        prog = _parse(lexer, parser, "Il tchop comment")
        prop = prog.sentence[0].proposition
        assert isinstance(prop, Declarative)
        assert prop.expr_interrogative is not None


class TestNominalGroups:
    def test_det_nom(self, lexer, parser):
        prog = _parse(lexer, parser, "Le gars wanda")
        prop = prog.sentence[0].proposition
        assert prop.sujet.determinant is not None
        assert prop.sujet.nom.value == "gars"

    def test_recursive_nominal(self, lexer, parser):
        prog = _parse(lexer, parser, "Les gars du gouvernement wanda")
        prop = prog.sentence[0].proposition
        assert prop.sujet.modifier is not None
        assert isinstance(prop.sujet.modifier, NominalGroup)
        assert prop.sujet.modifier.nom.value == "gouvernement"

    def test_demonstratif(self, lexer, parser):
        prog = _parse(lexer, parser, "La route ci c'est le fey")
        prop = prog.sentence[0].proposition
        assert prop.sujet.demonstratif is not None
        assert prop.sujet.demonstratif.value == "ci"

    def test_nombre_subject(self, lexer, parser):
        prog = _parse(lexer, parser, "1000 plus 200 wanda")
        prop = prog.sentence[0].proposition
        assert prop.sujet.nombre is not None
        assert prop.sujet.arithmetic is not None


class TestInterjections:
    def test_start_interjection(self, lexer, parser):
        prog = _parse(lexer, parser, "Massa, je wanda")
        sent = prog.sentence[0]
        assert sent.start_interjection is not None
        assert sent.start_interjection.value == "Massa"

    def test_end_interjection(self, lexer, parser):
        prog = _parse(lexer, parser, "Je wanda hein")
        sent = prog.sentence[0]
        assert sent.end_interjection is not None

    def test_question_mark(self, lexer, parser):
        prog = _parse(lexer, parser, "Je wanda ?")
        sent = prog.sentence[0]
        assert sent.end_punctuation is not None
        assert sent.end_punctuation.type == TokenType.TK_POINT_INTERRO


class TestMultipleSentences:
    def test_two_sentences(self, lexer, parser):
        prog = _parse(lexer, parser, "Je wanda hein Il tchop le fey norh")
        assert isinstance(prog, Program)
        assert len(prog.sentence) == 2

    def test_program_type(self, lexer, parser):
        prog = _parse(lexer, parser, "Je wanda")
        assert isinstance(prog, Program)


class TestSyntaxErrors:
    def test_missing_verb(self, lexer, parser):
        with pytest.raises(SyntaxError):
            _parse(lexer, parser, "Je ")

    def test_unexpected_number(self, lexer, parser):
        with pytest.raises(SyntaxError):
            _parse(lexer, parser, "Je 1000")

    def test_error_has_found_token(self, lexer, parser):
        with pytest.raises(SyntaxError) as exc_info:
            _parse(lexer, parser, "Je 1000")
        assert exc_info.value.found_token is not None

    def test_error_has_line(self, lexer, parser):
        with pytest.raises(SyntaxError) as exc_info:
            _parse(lexer, parser, "Je ")
        assert exc_info.value.line > 0


class TestVerbGroup:
    def test_verb_group_simple(self, lexer, parser):
        prog = _parse(lexer, parser, "tchop le fey")
        prop = prog.sentence[0].proposition
        assert isinstance(prop, Imperative)
        assert prop.verb.verb.value == "tchop"

    def test_verb_group_with_aux(self, lexer, parser):
        prog = _parse(lexer, parser, "On a tchop")
        prop = prog.sentence[0].proposition
        assert prop.groupe_verb.auxiliary is not None

    def test_verb_group_with_negation(self, lexer, parser):
        prog = _parse(lexer, parser, "Je ne tchop le fey")
        prop = prog.sentence[0].proposition
        assert prop.groupe_verb.negation is not None
