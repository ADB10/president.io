class Pot{
    constructor(){
        this.player = null
        this.cards = []
        this.historic = []
        this.empty = true
        this.round = 0
    }

    get_pot(){
        return {
            player: this.player,
            cards: this.cards
        }
    }

    get_player(){
        return this.player
    }

    get_cards(){
        return this.cards
    }

    get_weight_cards(){
        if(!this.empty) return this.cards[0].get_weight()
        console.log("Error (get_weight_cards) : no weight")
        return null
    }

    is_empty(){
        return this.empty
    }

    is_two(){
        return (!this.empty && this.cards[0].get_weight() == 1)
    }

    is_jump(){
        return (!this.empty && this.historic.length > 0 && this.historic[this.historic.length-1].cards[0].is_equal_weight(this.cards[0]))
    }

    add_new_pot(p, c){
        if(this.empty){
            this.empty = false
            this.round++
        } else {
            this.historic.push({player: this.player, cards: this.cards, round: this.round})
        }
        this.player = p
        this.cards = c
    }

    // 4 same cards in pot
    is_familly(){
        if(this.empty){
            return false
        } else {
            switch (this.cards.length) {
                case 4:
                    return true
                case 3: 
                    return false // impossible to commplete familly when 3 cards
                case 2:
                    return (this.historic.length > 0 && this.historic[this.historic.length-1].round == this.round && this.cards[0].is_equal_weight(this.historic[this.historic.length-1].cards[0]))
                case 1:
                    if(this.historic.length > 2){
                        let res = true
                        for (let i = 0; i < 3; i++) {
                            if(this.historic[this.historic.length-1-i].round != this.round || !this.cards[0].is_equal_weight(this.historic[this.historic.length-1-i].cards[0])) res = false
                        }
                        return res
                    } else {
                        return false
                    }
            }
        }
    }

    reset_pot(){
        this.player = null
        this.cards = []
        this.empty = true
    }

}

function create_pot(){
    return new Pot()
}