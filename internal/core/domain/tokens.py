""" The class that contains al tokens """
from enum import Enum,auto
from dataclasses import dataclass




class TokenType(Enum):
    """The class that defines the token types """
    name: str
    TK_INTERJECTION = auto()
    TK_VERBE = auto()
    TK_AUXILIAIRE = auto()
    TK_NOM = auto()
    TK_PRONOM_SUJET = auto()
    TK_PRONOM_OBJET = auto()
    TK_DETERMINANT = auto()
    TK_PREPOSITION = auto()
    TK_DEMONSTRATIF= auto()
    TK_NEGATION = auto()
    TK_NOMBRE= auto()
    TK_OPERATEUR= auto()
    TK_CEST= auto()
    TK_INTERROGATIF = auto()
    TK_VIRGULE = auto()
    TK_POINT_INTERRO= auto()
    EPSILON= auto()
    EOF = auto()

@dataclass(frozen=True) # meaning a token object once  created cannot be modified, a tuple but for class
class Token:
    """The class that defines the tokens """
    value: str
    type: TokenType
    line: int
    column: int

    def __repr__(self) -> str:
        return f"Token({self.value}, {self.type.value})"


