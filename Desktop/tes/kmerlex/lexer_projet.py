import re
import json
from enum import Enum, auto

# ==============================================================================
# PARTIE 1 : DÉFINITION DES TYPES (ENUMS & CLASSE TOKEN)
# ==============================================================================

class TokenType(Enum):
    """
    Énumération des types de tokens possibles.
    """
    NUMBER = auto()         # Ex: 500, 2k
    WORD = auto()           # Mots standards
    SLANG = auto()          # Argots (wanda, ndem...)
    PIDGIN_KW = auto()      # Mots clés Pidgin (dey, don...)
    PUNCTUATION = auto()    # . , ? !
    UNKNOWN = auto()        # Caractères inconnus

class Token:
    """
    Représente un Token avec un type strict et une valeur.
    """
    def __init__(self, type_, value):
        self.type = type_
        self.value = value

    def __repr__(self):
        # Pour un affichage propre dans la console
        return f"Token({self.type.name}, '{self.value}')"

    def to_dict(self):
        # Nécessaire pour convertir l'objet en JSON
        return {"type": self.type.name, "value": self.value}

# ==============================================================================
# PARTIE 2 : DONNÉES ET CONFIGURATION
# ==============================================================================

sentences = [
    # --- CAMFRANGLAIS ---
    "Le taxi est full, on va sat à trois derrière ?",
    "Bendskin, laisse-moi au carrefour, je n'ai pas la monnaie de fapcent",
    "Les embouteillages de Yaoundé me wanda, c'est le chaos.",
    "Le chauffeur a dja le frein en catastrophe.",
    "Le prof de réseau a tchop les nerfs aujourd'hui.",
    "J'ai do le code toute la nuit, je suis cass.",
    "Gars, tu as look les notes affichées au campus ?",
    "La go là est trop calée en Java, c'est une génie.",
    "Il faut qu'on gère le business ci, ça gif les do.",
    "Je suis foiré, dépanne-moi 2 bâtons s'il te plaît.",
    "Le boutiquier a grap les prix, c'est la magie.",
    "Ma nga est fâchée parce que je ne l'ai pas call hier.",
    "On va aller tchop et yamo ce soir pour ton anniversaire.",
    "Le gars là veut nous wise, il se prend pour qui ?",
    "C'est comment ? Ça fait deux jours que l’on te falla, tu es cache où ?",
    "Eneo a encore cut la lumière, mes aliments vont pourrir.",
    "L'eau ne coule pas au robinet depuis le matin.",
    "Le net est lente grave, c’est high de télécharger.",
    "Les Lions ont win le match, tout le bled est en joie.",
    "J'ai perdu mon ticket de pari foot, j'ai le seum.",
    "Je wanda sur toi, tu aimes trop les marta.",
    "Laisse-moi ça, c'est le ndem.",
    "Le way ci est gâté, on ne peut plus rien faire.",
    "Il a fallu que je tchoko pour passer.",
    "Massa, ne me dérange pas avec tes histoires.",

    # --- PIDGIN ---
    "Man no rest, we must hustle for chop.",
    "This sun dey hot too much, I dey sweat like Christmas goat.",
    "Hunger dey wire me, I never chop since morning.",
    "I don tire for waka, my leg dey pain me.",
    "Driver, I go drop for Rond Point Express.",
    "Oga, shift small, make I sit down well.",
    "Bike man, how much you go take for go Mvog-Mbi ?",
    "Traffic jam hold us for road for two hours.",
    "Mami, this tomato cost plenty, reduce small na.",
    "I no get change, abeg find small money.",
    "Customer, come buy for my hand, I go give you dash.",
    "That lecturer dey strict, e no dey take bribe.",
    "I get exam tomorrow, I need for study serious.",
    "My computer don spoil, I no fit finish my project.",
    "You get credit for phone ? Borrow me make I call.",
    "Network no dey, I no fit browse internet.",
    "Send me that picture for WhatsApp sharp sharp.",
    "Who be that girl wey e dey waka with you ?",
    "My paddy, we go meet for bar later evening.",
    "Why you dey look me so ? I owe you money ?",
    "Police don catch am because e no get ID card.",
    "Make you careful for night, thieves plenty for here.",
    "Wetin dey happen ? Why people gather here ?",
    "No be so dem di do am, use your head.",
    "God dey, we go succeed one day."
]

yaounde_slang = [
    "massa", "ndem", "eneo", "coup", "mami", "bendskin", "tchop", 
    "wanda", "weeeh", "maaa", "broke", "quartier", "feu", "lap", 
    "dja", "tcha", "nack", "go", "batons", "nga", "yamo", "seum", 
    "tchoko", "paddy", "wahala", "dash", "chop", "fapcent", "sat",
    "do", "cass", "look", "calée", "gif", "foiré", "grap", "wise", 
    "falla", "cache", "cut", "high", "win", "bled", "marta", "way",
    "oga", "abeg", "na", "dey", "don", "fit", "wey", "sharp", "wire"
]

pidgin_keywords = ["no", "for", "make", "dem", "am", "go", "dey", "don", "di", "na"]

# On mappe maintenant les patterns directement aux Enums
token_patterns = [
    (TokenType.NUMBER,      r'\d+(k|K)?'),
    (TokenType.PUNCTUATION, r'[.,!?;:]'),
    (TokenType.WORD,        r"[A-Za-zÀ-ÿ0-9_]+(?:['’][A-Za-zÀ-ÿ0-9_]+)?"),
    (TokenType.UNKNOWN,     r'.')
]

# ==============================================================================
# PARTIE 3 : LE LEXER (LOGIQUE)
# ==============================================================================

def tokenize(text):
    tokens = []
    position = 0
    
    while position < len(text):
        # Gestion des espaces (WHITESPACE) : on les saute manuellement
        if text[position].isspace():
            position += 1
            continue

        match = None
        
        # On itère sur nos patterns
        for token_enum, pattern in token_patterns:
            regex = re.compile(pattern)
            match = regex.match(text, position)
            
            if match:
                value = match.group(0)
                final_type = token_enum
                
                # --- Logique de raffinement du type ---
                if final_type == TokenType.WORD:
                    clean_word = value.lower().replace("’", "").replace("'", "")
                    
                    if clean_word in yaounde_slang:
                        final_type = TokenType.SLANG
                    elif clean_word in pidgin_keywords:
                        final_type = TokenType.PIDGIN_KW
                
                # --- Création de l'Objet Token ---
                new_token = Token(final_type, value)
                tokens.append(new_token)
                
                position = match.end(0)
                break
        
        if not match:
            # Sécurité
            position += 1
            
    return tokens

# ==============================================================================
# PARTIE 4 : EXÉCUTION ET SORTIE JSON
# ==============================================================================

output_data = []
print("--- Analyse Lexicale en cours (Version Corrigée) ---")

for sentence in sentences:
    token_objects = tokenize(sentence)
    
    # Conversion objets Token -> Dictionnaires pour JSON
    tokens_as_dicts = [t.to_dict() for t in token_objects]
    
    output_data.append({
        "original_sentence": sentence,
        "token_count": len(token_objects),
        "tokens": tokens_as_dicts
    })

json_output = json.dumps(output_data, indent=4, ensure_ascii=False)

filename = 'tokens_yaounde_final.json'
with open(filename, 'w', encoding='utf-8') as f:
    f.write(json_output)

print(f"✅ Analyse terminée ! {len(sentences)} phrases traitées.")
print(f"📂 Fichier JSON généré : {filename}")

# Test de vérification
if output_data:
    print("\n--- Exemple (Phrase 1) ---")
    print(output_data[0]['original_sentence'])
    print(output_data[0]['tokens'][0:4]) # Affiche les 4 premiers tokens