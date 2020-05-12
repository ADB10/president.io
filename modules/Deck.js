const classic_suits = [
        {name: 'clover', sign: '♣', color: 'black'},
        {name: 'tile', sign: '♦', color: 'red'},
        {name: 'heart', sign: '♥', color: 'red'},
        {name: 'pike', sign: '♠', color: 'black'},
    ]

const classic_cards_name = [
        {number: 1, name : "A"},
        {number: 2, name : "2"}, 
        {number: 3, name : "3"}, 
        {number: 4, name : "4"}, 
        {number: 5, name : "5"}, 
        {number: 6, name : "6"}, 
        {number: 7, name : "7"}, 
        {number: 8, name : "8"}, 
        {number: 9, name : "9"}, 
        {number: 10, name : "10"}, 
        {number: 11, name : "V"}, 
        {number: 12, name : "D"}, 
        {number: 13, name : "R"}
    ]

const weight_president = [2,1,13,12,11,10,9,8,7,6,5,4,3,2,1,13,12,11,10,9,8,7,6,5,4,3,2,1,13,12,11,10,9,8,7,6,5,4,3,2,1,13,12,11,10,9,8,7,6,5,4,3]

class Deck {

    constructor() {
        this.cards = this.create_classic_desk(weight_president)
        this.size = this.cards.length
    }
    
    get_deck(){
        return this.cards
    }

    get_size(){
        return this.size
    }

    create_classic_desk(weight){
        let id = 0
        let deck = []
        classic_suits.forEach(suit => {
            classic_cards_name.forEach(card => {
                deck.push(create_card(id, card.name, card.number, suit.sign, suit.color, weight[id]))
                id++
            });
        });
        return deck
    }

    draw_random_card(){
        let i = Math.floor(Math.random() * Math.floor(this.cards.length))
        let c = this.cards[i]
        this.remove_card(this.cards.indexOf(this.cards[i]))
        return c
    }

    remove_card(indice){
        this.cards.splice(indice, 1)
    }
}

function create_deck(){
    return new Deck()
}