# Let's build the Context-Free Grammar for Camfranglais & Pidgin 


## Token Classification
After obtaining the corpus, here we are going to work with `mock_corpus.txt` that is found in `data/raw` folder. 

We are first going with the token classification, we are going to regroup terminal symbols into the same language fragment. 

This is our corpus : 
```text
il a tchop les dos
j'ai pris fap pour venir
Le prix c'est 1000
je wanda sur la mater
il lui a gi les dos
il me reste moins de kolo pour payer le courant
la route ci c'est le fey seulement
on va wait le taximan ci encore combien de temps? massa
reme laisse moi le francais, j'ai kolo sur ca
gar tu as makam la boue la , qui va djoum la bas, je vais seulement etre absent au day
man les gars la play avec nos notes hein
repe, faut science, dovv messamedongo 2 places, depuis santa lucia, fap comment norh ? jusqu'a tu criche
mboutman, quitte avec ta feraille la en route, un chien comme ca meme, salopard, chouagne
les gars du gouvernement ont les groupes, on n'a pas de courant, ils talk seulement, wahh les wiseman
je wanda sur toi hein, skalom pour accacia, 200 comment ? asser hein repe, easy

```

Let's classify our token according to their language fragment :

`TK_INTERJECTION`,"mboutman, massa, reme, gar, man, repe, salopard, chouagne, hein, norh, easy, wahh"

`TK_VERBE`,"tchop, wanda, sleep, gi, reste, payer, wait, makam, djoum, play, criche, talk, groups, quitte, science"

`TK_AUXILIAIRE`,"a, va, as, faut, ont"

`TK_NOM`,"dos, fap, mater, kolo, courant, route, fey, taximan, boue, day, notes, feraille, chien, wiseman, gouvernement, place, santa lucia"

`TK_PRONOM_SUJET`,"il, je, tu, on, ils, elle"

`TK_PRONOM_OBJET`,"me, moi, toi, lui, nous, les (devant verbe)"

`TK_DETERMINANT`,"le, la, les, un, une, ta, nos, mon"

`TK_PREPOSITION`,"pour, sur, avec, de, du, depuis, en"

`TK_DEMONSTRATIF`,"ci, la (dans ""la route ci"")"

`TK_NEGATION`,"ne, pas, n', moins de"

`TK_NOMBRE`,"1000, 200, 2, 500"

`TK_OPERATEUR`,plus

`TK_CEST`,c'est

`TK_INTERROGATIF`,"comment, combien"


`TK_VIRGULE`,","

`TK_POINT_INTERRO`,?

`EPSILON`,(Le vide mathématique)