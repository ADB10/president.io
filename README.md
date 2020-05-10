# president.io

## To do list

### 27/04/2020

- [ ] (28/04/2020) bug avec card_selected
- ❌ faire commencer la dame de coeur lors de la premiere partie
- (28/04/2020) ajout regle : 4 carte pareille ferme le jeu


26/04/2020:

    ✔️ (27/04/2020) mettre tous les players dans la barre du haut ou alors les triés
    ✔️ (27/04/2020) pdt remporte la partie -> next player doit etre celui a cote de lui
    ✔️ (27/04/2020) regler les bugs d'affichage dans le tchat
    ✔️ (27/04/2020) player1 joue player2 apres lui se fait sauter tout le monde fold meme player1 mais c'est a player2 alors que p1 remporte
    ❌ ajouter un timer
    ❌ ajout d'un hote pour gerer les messages (seulement lui demande au serveur puis server broadcast)

25/04/2020:

    ✔️ (28/04/2020) grab and scroll pour les cartes
    ❌ gestion connexion nouveau joueur
    ❌ problèmes de sécurité (edit cote client) / verifier toutes les donnees cote serveur
    ✔️ (28/04/2020) ajout class pot
    ❌ ajout class hand
    ✔️ (27/04/2020) ajout regle : finir par un deux interdit
    ✔️ (27/04/2020) ajout regle : possibilite de jouer lors du swip
    ❌ passer automatiquement quand pas possible de jouer
    ✔️ (26/04/2020) probleme lorsque une personne est sautee puis que tout le monde fold et que le joueur qui a saute fait fold : il rejoue direct; le joueur qui s'est fait sauté ne peut pas jouer
    ✔️ (25/04/2020) probleme rang TDC - VTDC
    ✔️ (25/04/2020) probleme ranking
    ✔️ (27/04/2020) ajout affichage lors du saut
    ✔️ (27/04/2020) ajout de sons
    ✔️ (27/04/2020) faire commencer le tdc

/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

    PATCH NOTE

/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

10/05/2020

    - ajout systeme de room

28/04/2020

    - ajout des couleurs differentes pour chaque joueurs
    - jeu terminé, toutes les regles sont implementees

27/04/2020:

    - toutes les regles sont implementees sauf famille
    - voir to do list
    - ajout dark mode (nul)
    - ajout class ranking

26/04/2020:

    - optimisation client avec ajout de class player / board / cards pour faciliter la gestion
    - ajout interface connexion
    - ajout du lobby

25/04/2020:

    - plateau de jeu
    - regles normales (excepter: pas de revolution, possibilité de finir par un 2, impossible de jouer sur un swip)

/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

    TESTS POUR BUG RECURENTS

/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

    1 - all fold : joueur sur le pot de jouer
    2 - p sauter dernier a jouer : check quand il joue / check quand il fold
    3 - check 1 et 2 avec winner dans le round 

/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

    FONCTIONNEMENT

/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */


