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

    def parse(self, source: List[Token]) -> Program:
        """Implémentation du contrat Iparser"""
        self._tokens = source
        self._current_index = 0
        # On lance la machine interne
        return self._parse_program()

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

    def _parse_verb_group(self) -> VerbGroup:
        # ... (gestion negation / pronom / aux) ...
        negation = None
        pronom_objet = None
        auxiliary = None

        if self.match(TokenType.TK_NEGATION):
            negation = self.consume(TokenType.TK_NEGATION)

        if self.match(TokenType.TK_PRONOM_OBJET):
            pronom_objet = self.consume(TokenType.TK_PRONOM_OBJET)

        if self.match(TokenType.TK_AUXILIAIRE):
            auxiliary = self.consume(TokenType.TK_AUXILIAIRE)

        # === LE CORRECTIF EST ICI ===
        # On force la capture du verbe
        verb = self.consume(TokenType.TK_VERBE)

        return VerbGroup(
            verb=verb,  # <-- On passe la variable ici
            auxiliary=auxiliary,
            negation=negation,
            pronom_objet=pronom_objet
        )

    def _parse_nominal_group(self) -> NominalGroup:
        """
        Gère <GroupeNominal>.
        Corrige la gestion des démonstratifs et l'ordre des arguments.
        """
        determinant = None
        nom = None
        pronom_sujet = None
        nombre = None
        arithmetic = None
        demonstratif = None
        preposition = None
        modifier = None

        # 1. Base du Groupe Nominal
        if self.match(TokenType.TK_DETERMINANT):
            determinant = self.consume(TokenType.TK_DETERMINANT)
            nom = self.consume(TokenType.TK_NOM)
        elif self.match(TokenType.TK_NOM):
            nom = self.consume(TokenType.TK_NOM)
        elif self.match(TokenType.TK_PRONOM_SUJET):
            pronom_sujet = self.consume(TokenType.TK_PRONOM_SUJET)
        elif self.match(TokenType.TK_NOMBRE):
            nombre = self.consume(TokenType.TK_NOMBRE)
            # Gestion arithmétique (ex: "1000 plus 200")
            if self.match(TokenType.TK_OPERATEUR):
                op = self.consume(TokenType.TK_OPERATEUR)
                right_operand = self.consume(TokenType.TK_NOMBRE)
                # Attention : ArithmeticExpr doit aussi être importé ou géré
                arithmetic = ArithmeticExpr(operator=op, operand=right_operand)
        else:
             raise SyntaxError(
                 message="Attendu: Nom, Pronom, Déterminant ou Nombre",
                 line=self.current.line, column=self.current.column,
                 sourceLine=str(self.current.line), found_token=self.current,
                 expected_token=[TokenType.TK_NOM, TokenType.TK_PRONOM_SUJET]
             )

        # 2. Gestion du Démonstratif (C'était manquant !)
        # Ex: "La route CI"
        if self.match(TokenType.TK_DEMONSTRATIF):
            demonstratif = self.consume(TokenType.TK_DEMONSTRATIF)

        # 3. Gestion de la Récursion (Préposition + Suite)
        # Ex: "... DU gouvernement"
        if self.match(TokenType.TK_PREPOSITION):
            preposition = self.consume(TokenType.TK_PREPOSITION)
            modifier = self._parse_nominal_group() # Récursion

        # 4. RETOUR AVEC ARGUMENTS NOMMÉS (CRUCIAL)
        return NominalGroup(
            determinant=determinant,
            nom=nom,
            pronom_sujet=pronom_sujet,
            nombre=nombre,
            arithmetic=arithmetic,     # Maintenant il va dans la bonne case
            demonstratif=demonstratif, # Maintenant il est rempli
            preposition=preposition,
            modifier=modifier          # Maintenant il reçoit le groupe récursif
        )



    def _parse_imperative(self)-> Imperative:
        """ Parse the Imperative tokens from the given rule
        <Imperatif> ::= <TK_VERBE> <Complement> | <TK_AUXILIAIRE> <TK_VERBE> <Complement>
        """
        verb_group = self._parse_verb_group()
        complement = self._parse_complement()

        return Imperative(verb_group, complement)

    def _parse_declarative(self) -> Optional[Declarative]:
        # 1. Le Sujet
        sujet = self._parse_nominal_group()

        # 2. Initialisation des variables (C'était l'erreur UnboundLocalError)
        has_cest = None
        verb_group = None

        # 3. Choix : "C'est" ou Verbe
        if self.match(TokenType.TK_CEST):
            has_cest = self.consume(TokenType.TK_CEST)
        else:
            # Si ce n'est pas "c'est", ça DOIT être un groupe verbal
            # Assurez-vous que _parse_verb_group lève une erreur s'il ne trouve rien
            verb_group = self._parse_verb_group()

        # 4. Le reste
        complement = self._parse_complement()

        expr_interrogative = None
        if self.match(TokenType.TK_INTERROGATIF):
            expr_interrogative = self.consume(TokenType.TK_INTERROGATIF)

        return Declarative(
            sujet=sujet,
            has_cest=has_cest,
            groupe_verb=verb_group,
            complement=complement,
            expr_interrogative=expr_interrogative
        )

    def _parse_proposition(self) -> Optional[Proposition]:
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

        return Sentence(
            start_interjection=start_interjection,
            proposition=proposition,
            end_interjection=end_interjection,
            end_punctuation=end_point_interro
        )

    def _parse_complement(self) -> Optional[NominalGroup]:
        """ Gère le complément, qu'il commence par une préposition ou non """

        # Cas 1 : Fin de phrase (Epsilon)
        if self.match(TokenType.EPSILON, TokenType.TK_INTERROGATIF, TokenType.TK_POINT_INTERRO,
                      TokenType.TK_INTERJECTION):
            return None

        # Cas 2 : Préposition ("avec ta feraille")
        if self.match(TokenType.TK_PREPOSITION):
            # ON CONSOMME LA PRÉPOSITION ICI !
            self.consume(TokenType.TK_PREPOSITION)
            # Ensuite on parse le GN qui suit ("ta feraille")
            return self._parse_nominal_group()

        # Cas 3 : GN Direct ("le fey")
        elif self.match(TokenType.TK_PRONOM_SUJET, TokenType.TK_NOM, TokenType.TK_NOMBRE, TokenType.TK_DETERMINANT):
            return self._parse_nominal_group()

        return None

    def _parse_program(self) -> Program:
        """ this one is for parsing the rule for building the whole thing : a program"""
        sentences = []
        while not self.match(TokenType.EPSILON):
            sentences.append(self._parse_sentence())
        return Program(sentences)