import pytest
from internal.core.domain.tokens import TokenType, Token
from internal.core.domain.errors import LexicalError
# Assure-toi que les imports correspondent à ta structure de dossiers
from internal.adapters.regex_lexer import CamfranglaisLexer


class TestLexer:
    def setup_method(self):
        self.lexer = CamfranglaisLexer()

    def test_basic_tokenization(self):
        """Happy Path: Phrase simple"""
        code = "Je wanda"
        tokens = self.lexer.tokenize(code)

        # On attend [TK_PRONOM_SUJET, TK_VERBE, EPSILON]
        assert len(tokens) == 3
        assert tokens[0].type == TokenType.TK_PRONOM_SUJET
        assert tokens[0].value == "Je"
        assert tokens[1].type == TokenType.TK_VERBE
        assert tokens[1].value == "wanda"
        assert tokens[2].type == TokenType.EPSILON

    def test_complex_structure(self):
        """Test des nombres, opérateurs et ponctuation"""
        code = "Massa, 1000 plus 200 ?"
        tokens = self.lexer.tokenize(code)

        expected_types = [
            TokenType.TK_INTERJECTION,  # Massa
            TokenType.TK_VIRGULE,  # ,
            TokenType.TK_NOMBRE,  # 1000
            TokenType.TK_OPERATEUR,  # plus
            TokenType.TK_NOMBRE,  # 200
            TokenType.TK_POINT_INTERRO,  # ?
            TokenType.EPSILON  # Fin
        ]

        received_types = [t.type for t in tokens]
        assert received_types == expected_types

    def test_line_column_tracking(self):
        """Vérifie que le lexer compte bien les lignes"""
        code = "Je\nwanda"
        tokens = self.lexer.tokenize(code)

        assert tokens[0].line == 1
        assert tokens[0].value == "Je"
        assert tokens[1].line == 2  # wanda est après le saut de ligne
        assert tokens[1].value == "wanda"

    def test_unknown_character_error(self):
        """Sad Path: Caractère non reconnu"""
        code = "Je wanda #"

        with pytest.raises(LexicalError) as excinfo:
            self.lexer.tokenize(code)

        # Vérification du message d'erreur
        assert "Caractère inconnu" in str(excinfo.value)
        assert excinfo.value.line == 1