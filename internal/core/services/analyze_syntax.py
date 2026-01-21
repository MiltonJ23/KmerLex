""" So here, we have the syntax analyzer that will be injected with our contracts for both lexing and parsing  """
from abc import ABC

from internal.core.domain.ast_nodes import Program
from internal.core.ports.Ilexer import Ilexer
from internal.core.ports.Iparser import Iparser
from concurrent.futures.thread import ThreadPoolExecutor


class SyntaxAnalyzer:

    def __init__(self, lexer: Ilexer, parser: Iparser):
        self._lexer = lexer
        self._parser = parser
        self._executor = ThreadPoolExecutor(max_workers=2)


    def analyze(self, source: str)-> Program:
        """ the method is the one that is going to perform the analysis of the source string. It will separate the two tasks on respective threads for concurrency."""
        tokens = self._lexer.tokenize(source)
        ast = self._parser.parser(tokens)
        return ast

    def analyze_async(self, source:str)-> Program:
        """ The idea here, is to avoid blocking the principal thread when this will be called by the Flask API. It returns  a future object that will hold the result later"""
        return self._executor.submit(self.analyze, source)

