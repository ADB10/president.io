class Card {

    constructor(id, name, number, suit, color, weight) {
        this.id = id;
        this.name = name;
        this.number = number;
        this.suit = suit;
        this.color = color;
        this.weight = weight;
    }

    get_id(){
        return this.id
    }

    get_name(){
        return this.name
    }

    get_number(){
        return this.number
    }

    get_suit(){
        return this.suit
    }

    get_color(){
        return this.color
    }

    get_weight(){
        return this.weight
    }

    equals(c){
        return c.id == this.id && c.name == this.name && c.number == this.number && c.suit == this.suit && c.color == this.color  && c.weight == this.weight
    }

    is_equal_weight(c){
        return c.weight == this.weight
    }

    is_better_or_equal(c){
        return this.weight <= c.get_weight()
    }

}

function create_card(id, name, number, suit, color, weight){
    return new Card(id, name, number, suit, color, weight)
}