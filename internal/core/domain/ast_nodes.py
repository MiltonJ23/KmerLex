"""the module that contains the language fragment for the Camfranglais and the Pidgin languages """

from dataclasses import dataclass
from typing import Optional
from .tokens import Token


@dataclass
class ASTNode:
    """The base class for an Abstract Syntax Tree Node"""
    pass


@dataclass
class ArithmeticExpr(ASTNode):
    """For the <OptionArithmetique> non-terminal in code"""
    operand: Token
    operator: Token

@dataclass
class InterrogativeExpr(ASTNode):
    """ For the <OptionInterrogative> non-terminal in code"""
    interrogation_mark: Optional[Token] = None
    Epsilon: Optional[Token] = None

@dataclass
class DeclarativeExpr(ASTNode):
    """ for the <OptionDeclarative> non-terminal in code"""
    declarative: Optional[Token] = None
    epsilon: Optional[Token] = None

@dataclass
class NominalGroup(ASTNode):
    """represent the <GroupeNominal> non-terminal  in code. It fuses <BaseNominale> and <SuiteNominal> to get a single logic language fragment to be handled easily"""
    determinant: Optional[Token] = None
    nom: Optional[Token]= None
    nombre: Optional[Token]= None
    pronom_sujet: Optional[Token]= None
    demonstratif: Optional[Token]= None # this one represent the <OptionDemonstratif> non-terminal
    arithmetic : Optional[Token]= None # this one for the <OptionalArithmetic>
    preposition: Optional[Token]= None # this is for TK_Preposition of the <BaseNominale> non-terminal
    modifier: Optional['NominalGroup']= None # in the case there was another GN to be expected


@dataclass
class VerbGroup(ASTNode):
    """ this one represent the <GroupeVerbal> non-terminal in code"""
    verb: Token
    auxiliary: Optional[Token]= None
    pronom_objet: Optional[Token] = None
    negation: Optional[Token] = None

@dataclass
class Proposition(ASTNode):
    """ this one represent the <Proposition> non-terminal in code"""
    pass

@dataclass
class Complement(ASTNode):
    """ this one represent the <Complement> non-terminal in code"""
    preposition: Optional[Token] = None
    groupe_nominal: Optional[Token] = None
    epsilon: Optional[Token]= None



@dataclass
class Imperative(ASTNode):
    """ represent the <Imperatif> non-terminal in code. It is the one for _phrase imperative_ """
    verb: Optional[Token] = None
    auxiliary: Optional[Token] = None
    complement: Optional[Token] = None


@dataclass
class Sujet(ASTNode):
    """ this one represent the <Sujet> non-terminal in code"""
    groupe_nominal: Optional[Token] = None

@dataclass
class Declarative(ASTNode):
    """ represent the <Declarative> non-terminal in code. It is the one for _phrase declarative_ """
    sujet: Optional[Token] = None
    has_cest: Optional[Token] = None
    groupe_verb: Optional[Token] = None
    complement: Optional[Token] = None
    expr_interrogative: Optional[Token] = None


@dataclass
class Sentence(ASTNode):
    """ This one is for <Sentence> non-terminal in code. Represent a sentence litteraly"""
    start_interjection: Optional[Token] = None # "Massa", "Mboutman"
    proposition: Optional[Proposition] = None
    end_interjection: Optional[Token] = None   # "hein", "norh"
    end_punctuation: Optional[Token] = None


@dataclass
class Program(ASTNode):
    """ This one is for the program, the big one. The starter point"""
    sentence: List[Sentence] = field(default_factory=list)