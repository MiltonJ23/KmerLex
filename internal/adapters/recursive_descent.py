""" This module implements the recursive descent, the actual parsing mechanism implementation"""

from typing import List, Optional

from internal.core.domain.tokens import Token, TokenType
from internal.core.ports.Iparser import Iparser
from internal.core.domain.errors import SyntaxError
from internal.core.domain.ast_nodes import *



class CamfranglaisParser(Iparser):
    """ The class represent the parser for the camfranglais language """

    def __init__(self):
        self._tokens: List[Token]= []
        self._current_index: int = 0 # the terminal currently being pointed

    @property
    def current(self) -> Token :
        """ return the current pointed terminal """
        if self._current_index >= len(self._tokens):
            return self._tokens[-1]
        else :
            return self._tokens[self._current_index]

    def consume(self, expected_type:TokenType) -> Token:
        """ the method consume the token, the current pointed token and verify that it matches the allowed type given the predecessor token, if not it raises a syntax error"""
        if self.current.type == expected_type:
            """everything is okay, we save the current token to be returned and increment the current index by 1"""
            token: Token = self.current
            self._current_index += 1
            return token
        else :
            raise SyntaxError(message="", line=self.current.line, column=self.current.column,
                              expected_token=[expected_type], found_token=self.current,
                              sourceLine=self.current.line, )

    def match(self, *types: TokenType) -> bool:
        """ Check if the current token is one of the allowed tokens types"""
        return self.current.type in types

    def _parse_verb_group(self)-> VerbGroup:
        """ The method parse the verb group and return it given its rules.
        <GroupeVerbal> ::= <TK_NEGATION> <GroupeVerbal> | <TK_PRONOM_OBJET> <GroupeVerbal> | <TK_AUXILIAIRE> <TK_VERBE> | <TK_VERBE>
        """
        negation = None
        pronom_objet = None
        auxiliaire = None
        verbe = None

        if self.match(TokenType.TK_NEGATION):
            negation = self.consume(TokenType.TK_NEGATION)
        if self.match(TokenType.TK_PRONOM_OBJET):
            pronom_objet = self.consume(TokenType.TK_PRONOM_OBJET)
        if self.match(TokenType.TK_AUXILIAIRE):
            auxiliaire = self.consume(TokenType.TK_AUXILIAIRE)
        if self.match(TokenType.TK_VERBE):
            verbe = self.consume(TokenType.TK_VERBE)

        return VerbGroup(negation, pronom_objet, auxiliaire, verbe)

    def _parse_nominal_group(self)-> NominalGroup:
        """ The method parse the nominal group and return it given its rules """
        determinant = None
        pronom = None
        nom = None
        demonstratif = None
        nombre = None
        arithmetic = None
        modifier = None # in the case of a recursivity, let's say "du gouvernement "
        preposition = None
        if self.match(TokenType.TK_DETERMINANT):
            determinant = self.consume(TokenType.TK_DETERMINANT)
            nom = self.consume(TokenType.TK_NOM)
        elif self.match(TokenType.TK_NOM):
            nom = self.consume(TokenType.TK_NOM)
        elif self.match(TokenType.TK_PRONOM_SUJET):
            pronom = self.consume(TokenType.TK_PRONOM_SUJET)
        elif self.match(TokenType.TK_NOMBRE):
            nombre = self.consume(TokenType.TK_NOMBRE)
            if self.match(TokenType.TK_OPERATEUR):
                operateur = self.consume(TokenType.TK_OPERATEUR)
                following_operand = self.consume(TokenType.TK_NOMBRE)
                arithmetic =  ArithmeticExpr(operateur, following_operand)
        else:
            raise SyntaxError(message="", line=self.current.line, column=self.current.column,found_token=self.current,expected_token=[TokenType.TK_PRONOM_SUJET, TokenType.TK_NOMBRE, TokenType.TK_NOM,TokenType.TK_DETERMINANT])

        if self.match(TokenType.TK_PREPOSITION):
            preposition = self.consume(TokenType.TK_PREPOSITION)
            # since "du gouvernement" can lead to another nominal group , we are going to do a recursive call here
            modifier = self._parse_nominal_group()
        return NominalGroup(determinant, nom, pronom, arithmetic, modifier, preposition)



    def _parse_imperative(self)-> Imperative:
        """ Parse the Imperative tokens from the given rule
        <Imperatif> ::= <TK_VERBE> <Complement> | <TK_AUXILIAIRE> <TK_VERBE> <Complement>
        """
        verb_group = self._parse_verb_group()
        complement = self._parse_complement()

    def _parse_declarative(self)-> Optional[Declarative]:
        """ parse the Declarative tokens from the given rule.
        <Declarative> ::= <Sujet> <SuiteDeclarative>
            <SuiteDeclarative> ::= <TK_CEST> <Complement>| <GroupeVerbal> <Complement> <OptionInterrogative>
            """

        sujet= self._parse_nominal_group()
        has_cest: Token
        verb_group = None

        if self.match(TokenType.TK_CEST):
            has_cest=  self.consume(TokenType.TK_CEST)

        else:
            verb_group = self._parse_verb_group()

        complement = self._parse_complement()

        interrogative = None
        if self.match(TokenType.TK_INTERROGATIF):
            interrogative = self.consume(TokenType.TK_INTERROGATIF)
        return Declarative(sujet,has_cest,verb_group,complement,interrogative)

    def _parse_proposition(self) -> Optional[Proposition,Imperative,Declarative]:
        """ Parse the proposition from the current token and return it as a Proposition. Check and choose between <Imperative> and <Declarative>"""
        if self.match(TokenType.TK_VERBE, TokenType.TK_AUXILIAIRE): # we obtain this by following the First Principle
            return self._parse_imperative()
        elif self.match(TokenType.TK_NOM,TokenType.TK_NOMBRE, TokenType.TK_DETERMINANT,TokenType.TK_PRONOM_SUJET):
            return self._parse_declarative()
        else:
            raise SyntaxError(
                message="",line=self.current.line, column=self.current.column,sourceLine=self.current.line,found_token=self.current,expected_token=[TokenType.TK_NOM,TokenType.TK_NOMBRE, TokenType.TK_DETERMINANT,TokenType.TK_PRONOM_SUJET,TokenType.TK_VERBE, TokenType.TK_AUXILIAIRE]
            )


    def _parse_sentence(self) -> Sentence:
        """ this one is for parsing the rule for building sentences
        <Phrase> ::= <TK_INTERJECTION> <SuitePhraseAvecInterjection> | <Proposition> <FinDePhrase>
        """
        start_interjection = None
        # let's check the case when the first word is an interjection ~ slang kinda
        if self.match(TokenType.TK_INTERJECTION):
            start_interjection = self.consume(TokenType.TK_INTERJECTION)
            # according to the rule, at least in the SuitePhraseAvecInterjection, i am  checking the virgule too
            if self.match(TokenType.TK_VIRGULE):
                self.consume(TokenType.TK_VIRGULE)

        proposition = self._parse_proposition()
        end_interjection = None
        end_point_interro = None

        if self.match(TokenType.TK_INTERJECTION):
            end_interjection = self.consume(TokenType.TK_INTERJECTION)
        elif self.match(TokenType.TK_POINT_INTERRO):
            end_point_interro = self.consume(TokenType.TK_POINT_INTERRO)

        return Sentence(proposition,start_interjection,end_interjection,end_point_interro)


    def _parse_complement(self)-> Optional[NominalGroup]:
        """ the method parse the complement of the current token given its rules """
        if self.match(TokenType.EPSILON,TokenType.TK_INTERROGATIF,TokenType.TK_POINT_INTERRO,TokenType.TK_INTERJECTION):
            return None # it means we are at the end of the sentence
        elif self.match(TokenType.TK_PRONOM_SUJET,TokenType.TK_NOM,TokenType.TK_NOMBRE,TokenType.TK_PREPOSITION,TokenType.TK_DETERMINANT):
            return self._parse_nominal_group()
        return None

    def _parse_program(self) -> Program:
        """ this one is for parsing the rule for building the whole thing : a program"""
        sentences = []
        while not self.match(TokenType.EPSILON):
            sentences.append(self._parse_sentence())
        return Program(sentences)