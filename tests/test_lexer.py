import pytest
from internal.adapters.regex_lexer import CamfranglaisLexer
from internal.core.domain.tokens import TokenType, Token
from internal.core.domain.errors import LexicalError


class TestLexer:
    def setup_method(self):
        self.lexer = CamfranglaisLexer()

    def test_basic_tokenization(self):
        code = "Je wanda"
        tokens = self.lexer.tokenize(code)

        assert len(tokens) == 3  # Je, wanda, EPSILON
        assert tokens[0].type == TokenType.TK_PRONOM_SUJET
        assert tokens[0].value == "Je"
        assert tokens[1].type == TokenType.TK_VERBE
        assert tokens[1].value == "wanda"
        assert tokens[2].type == TokenType.EPSILON

    def test_complex_sentence_with_numbers_and_punctuation(self):
        code = "Massa, 1000 plus 200 ?"
        tokens = self.lexer.tokenize(code)

        expected_types = [
            TokenType.TK_INTERJECTION,  # Massa
            TokenType.TK_VIRGULE,  # ,
            TokenType.TK_NOMBRE,  # 1000
            TokenType.TK_OPERATEUR,  # plus
            TokenType.TK_NOMBRE,  # 200
            TokenType.TK_POINT_INTERRO,  # ?
            TokenType.EPSILON
        ]

        # On extrait juste les types des tokens reçus
        received_types = [t.type for t in tokens]
        assert received_types == expected_types

    def test_line_counting(self):
        code = "Je\nwanda"
        tokens = self.lexer.tokenize(code)

        assert tokens[0].line == 1
        assert tokens[1].line == 2  # wanda est sur la ligne 2

    def test_lexer_error_unknown_char(self):
        code = "Je wanda #"  # # n'existe pas dans nos règles

        with pytest.raises(LexicalError) as excinfo:
            self.lexer.tokenize(code)

        assert excinfo.value.line == 1
        assert "Caractère inconnu" in excinfo.value.message