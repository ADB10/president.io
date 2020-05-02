function check_play_possible(cards_to_play, cards_pot){
    let res_final = false
    if(check_number_card(cards_to_play, cards_pot)){
        if(check_same_cards(cards_to_play)){
            if (check_good_weight(cards_to_play, cards_pot)) {
                res_final = true
            } else {
                console.log("Error (check_play_possible) : cards not superior or equal")
            }
        } else {
            console.log("Error (check_play_possible) : not the same cards")
        }
    } else {
        console.log("Error (check_play_possible) : number of cards")
    }
    return res_final
}

function check_jump_play_possible(cards_to_play, cards_pot){
    let res_final2 = false
    if(check_number_card(cards_to_play, cards_pot)){
        if(check_same_cards(cards_to_play)){
            if (cards_to_play[0].is_equal_weight(cards_pot[0])) {
                res_final2 = true
            } else {
                console.log("Error (check_jump_play_possible) : cards not superior or equal")
            }
        } else {
            console.log("Error (check_jump_play_possible) : not the same cards")
        }
    } else {
        console.log("Error (check_jump_play_possible) : number of cards")
    }
    return res_final2
}

function check_number_card(cards_to_play, cards_pot){
    // first to play or same number of cards
    return (cards_pot.length == 0 && (cards_to_play.length > 0 && cards_to_play.length < 5)) || (cards_pot.length > 0 && (cards_to_play.length == cards_pot.length))
}

function check_same_cards(cards){
    let res = true
    for (let i = 1; i < cards.length; i++) {
        if(!cards[0].is_equal_weight(cards[i])){
            res = false
        }
    }
    return res
}

function check_good_weight(cards_sup, cards_inf){
    if(cards_inf.length == 0){
        return true
    } else {
        return cards_sup[0].is_better_or_equal(cards_inf[0])
    }
}
