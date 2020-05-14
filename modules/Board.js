class Board{

    constructor(id){
        this.id = id
        this.player_turn = null
        this.round_winner = null
        this.jump = false
        this.deck = null
        this.players = []
        this.pot = null
        this.ranking = null
        this.round = 0
        this.party = 0
    }

    get_id(){
        return this.id
    }

    get_deck(){
        return this.deck
    }

    get_players(){
        return this.players
    }

    get_pot(){
        return this.pot
    }

    get_pot_cards(){
        return this.pot.cards
    }

    get_party(){
        return this.party
    }

    get_round(){
        return this.round
    }

    get_nb_players(){
        return this.players.length
    }

    reset_pot(){
        this.pot = create_pot()
    }

    get_ranking(){
        return this.ranking
    }

    get_players_id(){
        let l = []
        this.players.forEach(p => {
            l.push(p.get_id())
        });
        return l
    }

    get_players_name(){
        let l = []
        this.players.forEach(p => {
            l.push(p.get_name())
        });
        return l
    }

    get_players_nb_cards(){
        let res = []
        this.players.forEach(p => {
            res.push({
                id_player: p.get_id(),
                nb_cards: p.get_number_cards().length
            })
        });
    }

    get_player_by_id(id){
        let res = null
        this.players.forEach(p => {
            if(p.get_id() == id){
                res = p
            }
        });
        return res
    }

    get_round_winner(){
        return this.round_winner
    }

    get_player_turn(){
        return this.player_turn
    }

    is_jump(){
        return this.jump
    }

    set_jump(b){
        this.jump = b
    }

    set_pot(p){
        this.pot = p
    }

    set_player_turn(player){
        this.player_turn = player
    }

    add_player(p){
        this.players.push(p)
    }

    incr_round(){
        this.round++
    }

    incr_party(){
        this.party++
    }

    remove_player(id){
        this.players.forEach(p => {
            if(p.get_id() == id){
                this.players.splice(this.players.indexOf(p), 1)
            }
        });
    }

    remove_cards_of_player(id_player, cards){
        let p = this.get_player_by_id(id_player)
        cards.forEach(c => {
            p.remove_card_to_hand(c)
        });
    }

    set_starting_hands(nb_cards_by_player){
        this.deck = create_deck()
        for (let i = 0; i < nb_cards_by_player; i++) {
            this.players.forEach(player => {
                player.add_card_to_hand((this.deck.draw_random_card()))
            });
        }

        this.players.forEach(player => {
            player.sort_hand()
        });

        if(this.ranking != null && this.ranking.get_nb_ranked() > 3){ // if already was a game
            this.set_player_turn(this.ranking.get_tdc()) // tdc begin
            // change pdt <> tdc
            for(let i = 0; i < 2; i++) this.get_player_by_id(this.ranking.get_pdt().get_id()).add_card_to_hand(this.get_player_by_id(this.ranking.get_tdc().get_id()).get_best_card())
            for(let i = 0; i < 2; i++) this.get_player_by_id(this.ranking.get_tdc().get_id()).add_card_to_hand(this.get_player_by_id(this.ranking.get_pdt().get_id()).get_worst_card())
            // change vpdt <> vtdc
            this.get_player_by_id(this.ranking.get_vpdt().get_id()).add_card_to_hand(this.get_player_by_id(this.ranking.get_vtdc().get_id()).get_best_card())
            this.get_player_by_id(this.ranking.get_vtdc().get_id()).add_card_to_hand(this.get_player_by_id(this.ranking.get_vpdt().get_id()).get_worst_card())

            this.players.forEach(player => {
                player.sort_hand()
            });
        }
    }

    is_round_winner(){
        if(this.pot.is_empty()){ // no winner
            return false
        } else {
            if(this.pot.is_two()){ // if play card 2
                this.round_winner = this.pot.get_player()
                return true
            } else {
                if(this.ranking.get_nb_ranked() == 1 && this.ranking.get_pdt() != null && this.pot.get_player().get_id() == this.ranking.get_pdt().get_id()){ // dont play after pdt
                    this.round_winner = this.pot.get_player()
                    return true
                } else {
                    if(this.pot.is_familly()){
                        this.round_winner = this.pot.get_player()
                        return true
                    } else {
                        let players_in_game = 0
                        let last_player = null
                        this.players.forEach(p => {
                            if(!p.is_fold() && !p.is_ranked()){
                                players_in_game++
                                last_player = p
                            }
                        });
                        if(players_in_game == 0){ // if all fold
                            this.round_winner = this.pot.get_player()
                            return true
                        } else {
                            if(players_in_game == 1 && last_player.get_id() == this.pot.get_player().get_id()){ //if one player stay and everyone fold
                                this.round_winner = this.pot.get_player()
                                return true
                            } else {
                                return false
                            }
                        }
                    }
                }
            }
        }
    }

    next_player_turn(){
        let i = this.players.indexOf(this.player_turn)
        let nb_tour = 0
        do {
            i = ((i + 1) % (this.players.length))
            nb_tour++
        } while ((this.players[i].is_fold() || this.players[i].is_ranked()) && nb_tour < this.players.length);
        if(nb_tour < this.players.length) this.player_turn = this.players[i]
        else this.player_turn = this.pot.get_player()
    }

    start_game(){
        if(this.get_ranking() == null){ // if first game random else tdc (set in set_start_hands)
            this.player_turn = this.players[(Math.floor(Math.random() * Math.floor(this.players.length)))]
        }
        this.round_winner = false
        this.jump = false
        this.reset_players_fold()
        this.reset_players_hand()
        this.reset_players_turn()
        this.reset_pot()
        this.set_starting_hands(Math.floor(8/(this.players.length)))
        this.reset_ranking()
    }

    set_score_player(){
        this.players.forEach(p => {
            switch(p.get_id()){
                case this.ranking.get_pdt().get_id():
                    p.add_to_score(2)
                    break;
                case this.ranking.get_vpdt().get_id():
                    p.add_to_score(1)
                    break;
                case this.ranking.get_vtdc().get_id():
                    p.add_to_score(-1)
                    break;
                case this.ranking.get_tdc().get_id():
                    p.add_to_score(-2)
                    break;
            }
        });
    }

    reset_players_fold(){
        this.players.forEach(p => {
            p.set_fold(false)
        });
    }

    reset_players_hand(){
        this.players.forEach(p => {
            p.set_hand([])
        });
    }

    reset_players_turn(){
        this.players.forEach(p => {
            p.set_my_turn(false)
        });
    }


    reset_ranking(){
        this.players.forEach(p => {
            p.set_ranked(false)
        });
        this.ranking = create_ranking(this.players.length)
    }

    update_player_statut(id_player){
        let p = this.get_player_by_id(id_player)
        let hand_size = p.update_hand_size()
        if(hand_size == 0){
            if(this.pot.is_two()){ // if finish with 2
                this.ranking.add_player_tdc(p)
            } else {
                this.ranking.add_player(p)
            }
            p.set_ranked(true)
        }
    }

}

function create_board(id){
    return new Board(id)
}

