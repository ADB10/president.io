# president.io

Pour jouer :

## FONCTIONNEMENT

* [CLIENT] Un joueur lance la partie (start_game)
* [SERVER] Le serveur demande à tous les joueurs de demander leurs mains (ask_for_hand)
* [CLIENT] Les joueurs demandent leurs mains (ask_for_hand)
* [SERVER] Le serveur envoie la main de chaque joueur en privé (your_hand)
* [CLIENT] Les joueurs demandent à qui le tour (get_turn)
    * | [SERVER] Le serveur envoie à tout le monde à qui le tour (Joueur X) (turn)
    * | [CLIENT] Le joueur X choisi et envoie ses cartes au serveur (play_cards)
        * | [SERVER] Le serveur envoie a tout le monde les cartes (card_played)
        * | [SERVER] Le serveur previent que le joueur X a fini (player_ranked)
        * | [SERVER] Le serveur previent que le round est fini (end_round)
        * | [SERVER] Le serveur previent que la partie est finie (end_game)
    * | [CLIENT] Le joueur X passe son tour / est sweep (fold)
        * | [SERVER] Le serveur envoie a tout le monde que le joueur X a passé son tour (player_fold)
        * | [SERVER] Le serveur envoie a tout le monde que le joueur X s'est fait sweep (player_jump)

## TO DO LIST

**13/05/2020**

- [ ] bug si tout le monde passe son tour
- [ ] ajout IA

**11/05/2020**

- [x] (12/05/2020) reset les tours à chaque partie
- [x] (12/05/2020) bug la personne est jump apres un 2 (à determiner)
- [x] (14/05/2020) bug finir par un deux (à determiner)
- [x] (14/05/2020) afficher la derniere carte quand la partie se termine

**10/05/2020**

- [x] (14/05/2020) gestion connection pendant partie
- [x] (14/05/2020) gestion deconnection pendant partie (4 joueurs min sinon bug)

**27/04/2020**

- [x] (28/04/2020) bug avec card_selected
- [ ] faire commencer la dame de coeur lors de la premiere partie
- [x] (28/04/2020) ajout regle : 4 carte pareille ferme le jeu

**26/04/2020**

- [x] (27/04/2020) mettre tous les players dans la barre du haut ou alors les triés
- [x] (27/04/2020) pdt remporte la partie -> next player doit etre celui a cote de lui
- [x] (27/04/2020) regler les bugs d'affichage dans le tchat
- [x] (27/04/2020) player1 joue player2 apres lui se fait sauter tout le monde fold meme player1 mais c'est a player2 alors que p1 remporte
- [x] ajouter un timer

**25/04/2020**

- [x] (28/04/2020) grab and scroll pour les cartes
- [x] (14/05/2020) problèmes de sécurité (edit cote client) / verifier toutes les donnees cote serveur
- [x] (28/04/2020) ajout class pot
- [ ] ajout class hand
- [x] (27/04/2020) ajout regle : finir par un deux interdit
- [x] (27/04/2020) ajout regle : possibilite de jouer lors du swip
- [ ] passer automatiquement quand pas possible de jouer
- [x] (26/04/2020) probleme lorsque une personne est sautee puis que tout le monde fold et que le joueur qui a saute fait fold : il rejoue direct; le joueur qui s'est fait sauté ne peut pas jouer
- [x] (25/04/2020) probleme rang TDC - VTDC
- [x] (25/04/2020) probleme ranking
- [x] (27/04/2020) ajout affichage lors du saut
- [x] (27/04/2020) ajout de sons
- [x] (27/04/2020) faire commencer le tdc

## PATCH NOTE

**12/05/2020**

* remove BoardClient, same Board client/server sans info carte
* ajout système de points
* reglages bug affichage lobby

**11/05/2020**

* refonte design, div player toujours la meme settings devient board au lancement de la partie

**10/05/2020**

* la partie se relance automatiquement au bout de 3 secondes
* ajout systeme de room

**28/04/2020**

* ajout des couleurs differentes pour chaque joueurs
* jeu terminé, toutes les regles sont implementees

**27/04/2020**

* toutes les regles sont implementees sauf famille
* voir to do list
* ajout dark mode (nul)
* ajout class ranking

**26/04/2020**

* optimisation client avec ajout de class player / board / cards pour faciliter la gestion
* ajout interface connexion
* ajout du lobby

**25/04/2020**

* plateau de jeu
* regles normales (excepter: pas de revolution, possibilité de finir par un 2, impossible de jouer sur un swip)
