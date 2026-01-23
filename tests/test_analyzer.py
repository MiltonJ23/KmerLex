import pytest
from internal.core.services.analyze_syntax import SyntaxAnalyzer
from internal.adapters.regex_lexer import CamfranglaisLexer
from internal.adapters.recursive_descent import CamfranglaisParser
from internal.core.domain.ast_nodes import Program


class TestSyntaxAnalyzer:
    def setup_method(self):
        # Injection de dépendance réelle
        lexer = CamfranglaisLexer()
        parser = CamfranglaisParser()
        self.analyzer = SyntaxAnalyzer(lexer, parser)

    def test_sync_analysis(self):
        """Test de la méthode synchrone classique"""
        code = "On a tchop"
        ast = self.analyzer.analyze(code)

        assert isinstance(ast, Program)
        assert len(ast.sentence) == 1

    def test_async_analysis(self):
        """Test de la méthode asynchrone (ThreadPool)"""
        code = "Je wait le fap"
        future = self.analyzer.analyze_async(code)

        # On attend le résultat du Future
        ast = future.result(timeout=2)  # Timeout pour éviter que le test hang si ça plante

        assert isinstance(ast, Program)
        # On vérifie un détail pour être sûr que le parsing a bien eu lieu
        sujet = ast.sentence[0].proposition.sujet
        assert sujet.pronom_sujet.value == "Je"