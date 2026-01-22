import pytest
from internal.adapters.regex_lexer import CamfranglaisLexer
from internal.adapters.recursive_descent import CamfranglaisParser
from internal.core.domain.ast_nodes import Imperative, Declarative, Sentence
from internal.core.domain.errors import SyntaxError


class TestParser:
    def setup_method(self):
        self.lexer = CamfranglaisLexer()
        self.parser = CamfranglaisParser()

    def _parse(self, code):
        tokens = self.lexer.tokenize(code)
        return self.parser.parse(tokens)

    def test_imperative_sentence(self):
        code = "Quitte avec ta feraille"
        program = self._parse(code)

        stmt = program.sentences[0]
        assert isinstance(stmt, Sentence)
        assert isinstance(stmt.proposition, Imperative)
        # Vérifions le verbe
        assert stmt.proposition.verb_group.verb.value == "Quitte"

    def test_declarative_cest(self):
        code = "La route ci c'est le fey"
        program = self._parse(code)

        prop = program.sentences[0].proposition
        assert isinstance(prop, Declarative)
        assert prop.subject.nom.value == "route"
        assert prop.subject.demonstratif.value == "ci"
        assert prop.is_cest is True  # Vérifie le flag "c'est"

    def test_declarative_verb_negation(self):
        code = "Il ne wanda pas"
        program = self._parse(code)

        prop = program.sentences[0].proposition
        assert isinstance(prop, Declarative)
        assert prop.verb_group.negation.value == "ne"  # ou "pas" selon votre logique de capture
        assert prop.verb_group.verb.value == "wanda"

    def test_parser_error_missing_verb(self):
        code = "Je le"  # Phrase incomplète

        with pytest.raises(SyntaxError) as excinfo:
            self._parse(code)

        # On vérifie que l'erreur mentionne ce qu'on attendait
        assert "Attendu" in str(excinfo.value)

    def test_full_interjection_sentence(self):
        code = "Massa, tu wanda hein"
        program = self._parse(code)

        stmt = program.sentences[0]
        assert stmt.start_interjection.value == "Massa"
        assert stmt.end_interjection.value == "hein"