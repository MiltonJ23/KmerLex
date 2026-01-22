import pytest
from internal.core.domain.tokens import TokenType, Token
from internal.core.domain.ast_nodes import Program, Sentence, Imperative, Declarative, NominalGroup, VerbGroup
from internal.core.domain.errors import SyntaxError
from internal.adapters.regex_lexer import CamfranglaisLexer
from internal.adapters.recursive_descent import CamfranglaisParser


class TestParser:
    def setup_method(self):
        self.lexer = CamfranglaisLexer()
        self.parser = CamfranglaisParser()

    def _parse(self, code):
        """Helper pour lancer le parsing rapidement"""
        tokens = self.lexer.tokenize(code)
        # Appel de .parser() conformément à votre interface IParser
        return self.parser.parse(tokens)

    def test_parse_imperative_sentence(self):
        """
        Happy Path: Phrase Impérative simple
        Ex: 'Quitte avec ta feraille'
        """
        code = "Quitte avec ta feraille"
        program = self._parse(code)

        assert isinstance(program, Program)
        # Vérifiez ici si c'est .sentence ou .sentences dans votre AST
        first_sentence = program.sentence[0]

        assert isinstance(first_sentence.proposition, Imperative)

        # Vérification robuste du verbe (gère Token direct ou VerbGroup)
        verb_node = first_sentence.proposition.verb

        if isinstance(verb_node, VerbGroup):
            assert verb_node.verb.value == "Quitte"
        elif isinstance(verb_node, Token):
            assert verb_node.value == "Quitte"
        else:
            pytest.fail(f"Le champ 'verb' est de type inattendu : {type(verb_node)}")

    def test_parse_declarative_cest(self):
        """
        Happy Path: Structure 'C'est'
        Ex: 'La route ci c'est le fey'
        """
        code = "La route ci c'est le fey"
        program = self._parse(code)

        prop = program.sentence[0].proposition
        assert isinstance(prop, Declarative)

        # Vérification du Sujet (Groupe Nominal)
        assert prop.sujet.nom.value == "route"
        assert prop.sujet.demonstratif.value == "ci"

        # Vérification du pivot 'c'est'
        assert prop.has_cest is not None
        assert prop.has_cest.type == TokenType.TK_CEST

    def test_recursive_nominal_group(self):
        """
        Structural Test: Récursion dans le Groupe Nominal
        Ex: 'Les gars du gouvernement'
        """
        code = "Les gars du gouvernement wanda"
        program = self._parse(code)

        prop = program.sentence[0].proposition
        sujet = prop.sujet  # NominalGroup

        # Niveau 1 : Les gars
        assert sujet.nom.value == "gars"

        # Transition : du
        assert sujet.preposition.value == "du"

        # Niveau 2 (Récursion) : gouvernement
        # Le champ 'modifier' doit contenir le GN imbriqué
        assert isinstance(sujet.modifier, NominalGroup)
        assert sujet.modifier.nom.value == "gouvernement"

    def test_syntax_error_incomplete(self):
        """Sad Path: Phrase qui s'arrête brutalement"""
        code = "Je "  # Manque le verbe

        with pytest.raises(SyntaxError) as excinfo:
            self._parse(code)

        # On vérifie que l'erreur pointe bien la fin de ligne ou l'élément manquant
        assert excinfo.value.line > 0

    def test_syntax_error_unexpected_token(self):
        """Sad Path: Token invalide à cet endroit"""
        # "Je 1000" -> 1000 n'est ni une préposition, ni un verbe.
        code = "Je 1000"
        with pytest.raises(SyntaxError) as excinfo:
            self._parse(code)
        assert "1000" in str(excinfo.value.found_token.value)