""" Let's Create custom errors for our KmerLex Compiler"""
from dataclasses import dataclass
from typing import Optional, List

from internal.core.domain.tokens import Token, TokenType


@dataclass
class KmerLexError(Exception): # this is the base error object, that others errors class will extend
    """This is the base class for all compiler errors"""
    message: str
    line: int
    column: int
    sourceLine: Optional[str] = None

    def __str__(self)-> str:
        """ returns the plain error message"""
        return f"{self.message} at {self.line} {self.column}"
    def pretty_print(self)-> str:
        """Returns the error message in the way it is often showed in the terminal, with the proper error location , pointing to the line and column"""
        baseErrorMessage = f"{self.message} occured at {self.line} {self.column}"

        if self.sourceLine is not None:
            cleanLine = self.sourceLine.rstrip() # we ensure to remove the /n
            errorPointer = " " * (self.column -1) + "^"
            # now we return everything clean
            return f"\n{cleanLine}\n{errorPointer}\n{baseErrorMessage} "
        return baseErrorMessage



class LexicalError(KmerLexError):
    """ This error is raised when the lexer doesn't recognize a token"""
    faultyCharacter: str

    def __post_init__(self)->None:
        if not self.message and self.faultyCharacter:
            self.message = f" Unrecognized character '{self.faultyCharacter}'"

class SyntaxError(KmerLexError):
    """ This error is raised when the parser doesn't recognize a production rule"""
    found_token: Optional[Token] = None
    expected_token: Optional[List[TokenType]] = None

    def __post_init__(self)->None:
        if not self.message and self.found_token:
            found_token_value = self.found_token.value
            found_token_type = self.found_token.type.name

            new_mssg = f" Unexpected tokens {found_token_value} of type :  {found_token_type}"

            if self.expected_token is not None:
                expected_tokens_name = [token.name for token in self.expected_token] # we format the expected token name list
                new_mssg += f"  was rather expecting ".join(expected_tokens_name)

            self.message = new_mssg
