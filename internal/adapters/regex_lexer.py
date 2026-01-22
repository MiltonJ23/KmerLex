""" This module execute the tokenization, it is the logic that will recognize the tokens and tokenieze a source string"""

import re
from typing import List, Tuple, Optional

from internal.core.ports.Ilexer import Ilexer
from internal.core.domain.tokens import Token, TokenType
from internal.core.domain.errors import LexicalError


class CamfranglaisLexer(Ilexer):
    def __init__(self):
        # L'ORDRE EST CRUCIAL : Du plus spécifique au plus général.
        self.rules: List[Tuple[str, Optional[TokenType]]] = [
            (r'[ \t\r\n]+', None),
            (r',', TokenType.TK_VIRGULE),
            (r'\?', TokenType.TK_POINT_INTERRO),
            (r'plus', TokenType.TK_OPERATEUR),

            # 3. Mots-clés grammaticaux (Regex exacte avec \b pour "word boundary")
            (r'\b(c\'est)\b', TokenType.TK_CEST),
            (r'\b(ne|pas|n\'|moins de)\b', TokenType.TK_NEGATION),

            # Verbes et Auxiliaires
            (r'\b(a|va|as|faut|ont)\b', TokenType.TK_AUXILIAIRE),
            (r'\b(tchop|wanda|sleep|gi|reste|payer|wait|makam|djoum|play|criche|talk|groups|quitte|science)\b',
             TokenType.TK_VERBE),

            # Pronoms & Déterminants

            (r'\b(je|tu|il|on|ils|elle)\b', TokenType.TK_PRONOM_SUJET),
            (r'\b(le|la|les|un|une|ta|nos|mon)\b', TokenType.TK_DETERMINANT),
            (r'\b(me|moi|toi|lui|nous|les)\b', TokenType.TK_PRONOM_OBJET),

            (r'\b(ci|la)\b', TokenType.TK_DEMONSTRATIF),  # "ci" dans "la route ci"

            # Prépositions
            (r'\b(pour|sur|avec|de|du|depuis|en)\b', TokenType.TK_PREPOSITION),

            # Interrogatifs
            (r'\b(comment|combien)\b', TokenType.TK_INTERROGATIF),

            # 4. Interjections (Vocabulaire Camfranglais spécifique)
            (r'\b(massa|mboutman|reme|gar|man|repe|salopard|chouagne|hein|norh|easy|wahh)\b',
             TokenType.TK_INTERJECTION),

            # 5. Noms (Génériques ou liste fermée selon votre choix)
            (r'\b(dos|fap|mater|kolo|courant|route|fey|taximan|boue|day|notes|feraille|chien|wiseman|gouvernement|place|santa lucia|gars)\b',
             TokenType.TK_NOM),

            # 6. Nombres
            (r'\d+', TokenType.TK_NOMBRE),
        ]

    def tokenize(self, source_code: str) -> List[Token]:
        tokens = []
        position = 0
        line = 1
        column = 1

        # On boucle jusqu'à la fin du texte
        while position < len(source_code):
            match = None

            for pattern, token_type in self.rules:
                regex = re.compile(pattern, re.IGNORECASE)
                match = regex.match(source_code, position)

                if match:
                    value = match.group(0)

                    # Si on a trouvé un match, on traite
                    if token_type:  # Si ce n'est pas un espace (None)
                        token = Token(
                            type=token_type,
                            value=value,
                            line=line,
                            column=column
                        )
                        tokens.append(token)

                    # Mise à jour des compteurs
                    lines_in_match = value.count('\n')
                    if lines_in_match > 0:
                        line += lines_in_match
                        column = len(value) - value.rfind('\n')
                    else:
                        column += len(value)

                    position = match.end()
                    break  # On sort de la boucle for, on retourne au while

            if not match:
                # Aucun pattern ne correspond -> Erreur
                raise LexicalError(
                    message=f"Caractère inconnu : '{source_code[position]}'",
                    line=line,
                    column=column
                )


        tokens.append(Token("",TokenType.EPSILON, line, column))
        return tokens