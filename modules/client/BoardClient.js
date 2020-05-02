class BoardClient{
    constructor(){
        this.players = []
        this.pot = {
            player: null,
            cards: []
        }
        this.player_turn = null
        this.jump = false
        this.dark_mode = false
        this.round = 0
        this.party = 0
    }

    add_player(p){
        this.players.push(p)
    }

    is_jump(){
        return this.jump
    }

    set_jump(b){
        this.jump = b
    }

    set_dark_mode(b){
        this.dark_mode = b
    }

    set_player_turn(p){
        this.player_turn = JSON_parse_player(p)
    }

    incr_party(){
        this.party++
    }

    incr_round(){
        this.round++
    }

    get_party(){
        return this.party
    }

    get_round(){
        return this.round
    }

    set_pot(p){
        if(p.player == null){
            this.pot.player = null
            this.pot.cards = []
        } else {
            this.pot.player = JSON_parse_player(p.player)
            this.pot.cards = JSON_parse_cards(p.cards)
        }
    }

    get_players(){
        return this.players
    }

    get_player_turn(){
        return this.player_turn
    }

    get_nb_players(){
        return (this.players.length)
    }

    get_pot_player(){
        return this.pot.player
    }

    get_pot_size(){
        return this.pot.cards.length
    }

    get_dark_mode(){
        return this.dark_mode
    }

    get_pot_cards(){
        return this.pot.cards
    }

    remove_player(id){
        this.players.forEach(p => {
            if(p.id == id){
                this.players.splice(this.players.indexOf(p))
            }
        });
    }
}