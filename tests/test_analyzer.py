import pytest
from internal.core.services.analyze_syntax import SyntaxAnalyzer
from internal.adapters.regex_lexer import CamfranglaisLexer
from internal.adapters.recursive_descent import CamfranglaisParser
from internal.core.domain.ast_nodes import Program


class TestSyntaxAnalyzer:
    def setup_method(self):
        # Vraie injection de dépendance (Integration Test)
        self.lexer = CamfranglaisLexer()
        self.parser = CamfranglaisParser()
        self.analyzer = SyntaxAnalyzer(self.lexer, self.parser)

    def test_synchronous_analysis(self):
        code = "On a tchop"
        ast = self.analyzer.analyze(code)
        assert isinstance(ast, Program)
        assert len(ast.sentences) == 1

    def test_asynchronous_analysis(self):
        code = "Je wait le fap"
        future = self.analyzer.analyze_async(code)

        # On attend le résultat
        ast = future.result(timeout=2)

        assert isinstance(ast, Program)
        assert len(ast.sentences) == 1
        assert ast.sentences[0].proposition.subject.pronom.value == "Je"