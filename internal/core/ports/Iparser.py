""" This is the contract of the parser interface"""

from abc import ABC, abstractmethod
from internal.core.domain.ast_nodes import  Program

from typing import List

from internal.core.domain.tokens import Token


class Iparser(ABC):
    """ This is the contract of the parser interface """
    @abstractmethod
    def parse(self, source: List[Token])-> Program:
        pass