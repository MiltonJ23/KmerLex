"""Extended lexer tests covering all token types, edge cases, and error paths."""
import pytest
from internal.core.domain.tokens import TokenType, Token
from internal.core.domain.errors import LexicalError
from internal.adapters.regex_lexer import CamfranglaisLexer


@pytest.fixture
def lexer():
    return CamfranglaisLexer()


# ── Token type tests ──────────────────────────────────────────────────

class TestInterjections:
    INTERJECTIONS = ["massa", "mboutman", "reme", "gar", "man", "repe",
                     "salopard", "chouagne", "hein", "norh", "easy", "wahh"]

    @pytest.mark.parametrize("word", INTERJECTIONS)
    def test_interjection(self, lexer, word):
        tokens = lexer.tokenize(word)
        assert tokens[0].type == TokenType.TK_INTERJECTION

    def test_interjection_case_insensitive(self, lexer):
        tokens = lexer.tokenize("MASSA")
        assert tokens[0].type == TokenType.TK_INTERJECTION


class TestVerbs:
    VERBS = ["tchop", "wanda", "sleep", "gi", "reste", "payer", "wait",
             "makam", "djoum", "play", "criche", "talk", "groups", "quitte", "science"]

    @pytest.mark.parametrize("word", VERBS)
    def test_verb(self, lexer, word):
        tokens = lexer.tokenize(word)
        assert tokens[0].type == TokenType.TK_VERBE


class TestAuxiliaries:
    AUXILIARIES = ["a", "va", "as", "faut", "ont"]

    @pytest.mark.parametrize("word", AUXILIARIES)
    def test_auxiliary(self, lexer, word):
        tokens = lexer.tokenize(word)
        assert tokens[0].type == TokenType.TK_AUXILIAIRE


class TestPronouns:
    SUBJECT_PRONOUNS = ["je", "tu", "il", "on", "ils", "elle"]
    OBJECT_PRONOUNS = ["me", "moi", "toi", "lui", "nous"]

    @pytest.mark.parametrize("word", SUBJECT_PRONOUNS)
    def test_subject_pronoun(self, lexer, word):
        tokens = lexer.tokenize(word)
        assert tokens[0].type == TokenType.TK_PRONOM_SUJET

    @pytest.mark.parametrize("word", OBJECT_PRONOUNS)
    def test_object_pronoun(self, lexer, word):
        tokens = lexer.tokenize(word)
        assert tokens[0].type == TokenType.TK_PRONOM_OBJET


class TestDeterminants:
    DETERMINANTS = ["le", "la", "les", "un", "une", "ta", "nos", "mon"]

    @pytest.mark.parametrize("word", DETERMINANTS)
    def test_determinant(self, lexer, word):
        tokens = lexer.tokenize(word)
        assert tokens[0].type == TokenType.TK_DETERMINANT


class TestPrepositions:
    PREPOSITIONS = ["pour", "sur", "avec", "de", "du", "depuis", "en"]

    @pytest.mark.parametrize("word", PREPOSITIONS)
    def test_preposition(self, lexer, word):
        tokens = lexer.tokenize(word)
        assert tokens[0].type == TokenType.TK_PREPOSITION


class TestNouns:
    NOUNS = ["dos", "fap", "mater", "kolo", "courant", "route", "fey",
             "taximan", "boue", "day", "notes", "feraille", "chien",
             "wiseman", "gouvernement", "place", "gars"]

    @pytest.mark.parametrize("word", NOUNS)
    def test_noun(self, lexer, word):
        tokens = lexer.tokenize(word)
        assert tokens[0].type == TokenType.TK_NOM


class TestMiscTokens:
    def test_demonstratif_ci(self, lexer):
        tokens = lexer.tokenize("ci")
        assert tokens[0].type == TokenType.TK_DEMONSTRATIF

    def test_negation_ne(self, lexer):
        tokens = lexer.tokenize("ne")
        assert tokens[0].type == TokenType.TK_NEGATION

    def test_negation_pas(self, lexer):
        tokens = lexer.tokenize("pas")
        assert tokens[0].type == TokenType.TK_NEGATION

    def test_cest(self, lexer):
        tokens = lexer.tokenize("c'est")
        assert tokens[0].type == TokenType.TK_CEST

    def test_operateur_plus(self, lexer):
        tokens = lexer.tokenize("plus")
        assert tokens[0].type == TokenType.TK_OPERATEUR

    def test_virgule(self, lexer):
        tokens = lexer.tokenize(",")
        assert tokens[0].type == TokenType.TK_VIRGULE

    def test_point_interro(self, lexer):
        tokens = lexer.tokenize("?")
        assert tokens[0].type == TokenType.TK_POINT_INTERRO

    def test_nombre(self, lexer):
        tokens = lexer.tokenize("1000")
        assert tokens[0].type == TokenType.TK_NOMBRE
        assert tokens[0].value == "1000"

    def test_interrogatif_comment(self, lexer):
        tokens = lexer.tokenize("comment")
        assert tokens[0].type == TokenType.TK_INTERROGATIF

    def test_interrogatif_combien(self, lexer):
        tokens = lexer.tokenize("combien")
        assert tokens[0].type == TokenType.TK_INTERROGATIF


# ── Edge cases ────────────────────────────────────────────────────────

class TestEdgeCases:
    def test_empty_string(self, lexer):
        tokens = lexer.tokenize("")
        assert len(tokens) == 1
        assert tokens[0].type == TokenType.EPSILON

    def test_whitespace_only(self, lexer):
        tokens = lexer.tokenize("   \t\n  ")
        assert len(tokens) == 1
        assert tokens[0].type == TokenType.EPSILON

    def test_multiline(self, lexer):
        tokens = lexer.tokenize("Je\nwanda")
        assert tokens[0].line == 1
        assert tokens[1].line == 2

    def test_epsilon_always_last(self, lexer):
        tokens = lexer.tokenize("Je wanda le fey")
        assert tokens[-1].type == TokenType.EPSILON

    def test_unknown_char_raises(self, lexer):
        with pytest.raises(LexicalError):
            lexer.tokenize("@")

    def test_unknown_char_after_valid(self, lexer):
        with pytest.raises(LexicalError):
            lexer.tokenize("Je #")

    def test_full_sentence(self, lexer):
        tokens = lexer.tokenize("Massa, le gars ci a tchop le fey")
        types = [t.type for t in tokens[:-1]]  # exclude EPSILON
        assert TokenType.TK_INTERJECTION in types
        assert TokenType.TK_VIRGULE in types
        assert TokenType.TK_DETERMINANT in types
        assert TokenType.TK_NOM in types
        assert TokenType.TK_AUXILIAIRE in types
        assert TokenType.TK_VERBE in types
