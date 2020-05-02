class Player {

    constructor(id, name, hand){
        this.id = id
        this.name = name
        this.hand = hand
        this.hand_size = this.hand.length
        this.my_turn = false
        this.fold = false
        this.ranked = false
        this.connected = false
    }

    set_hand(hand){
        this.hand = hand
    }

    set_connected(b){
        this.connected = b
    }
    
    set_ranked(b){
        this.ranked = b
    }

    get_id(){
        return this.id
    }

    get_hand(){
        return this.hand
    }

    get_name(){
        return this.name
    }

    get_hand_size(){
        return this.hand.length
    }

    get_card_by_id(id){
        let res = null
        this.hand.forEach(c => {
            if(c.get_id() == id){
                res = c
            }
        });
        return res
    }

    is_connected(){
        return this.connected
    }

    is_ranked(){
        return this.ranked
    }
    
    is_my_turn(){
        return this.my_turn
    }

    set_my_turn(b){
        this.my_turn = false
    }

    toggle_my_turn(){
        this.my_turn = !this.my_turn
    }

    is_fold(){
        return this.fold
    }

    toggle_fold(){
        this.fold = !this.fold
    }

    set_fold(b){
        this.fold = b
    }

    add_card_to_hand(card){
        this.hand.push(card)
    }

    remove_card_to_hand(card){
        this.hand.forEach(c => {
            if(c.equals(card)){
                this.hand.splice(this.hand.indexOf(c), 1)
            }
        });
    }

    update_hand_size(){
        this.hand_size = this.hand.length
        return this.hand_size
    }

    sort_hand(){
        this.hand.sort(function(c1, c2){
            return (c2.get_weight() - c1.get_weight())
        })
    }

    get_best_card(){
        return this.hand.pop()
    }

    get_worst_card(){
        return this.hand.shift()
    }

}

function create_player(id, name, hand){
    return new Player(id, name, hand)
}