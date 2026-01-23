""" This is the contract of the Lexer interface"""

from abc import ABC, abstractmethod
from typing import List
from internal.core.domain.tokens import Token





class Ilexer(ABC):
    """ This is the contract of the Lexer interface"""
    @abstractmethod
    def tokenize(self, source:str) -> List[Token]:
        """ This method will tokenize the source string and return a list of tokens"""
        pass