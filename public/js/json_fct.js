function JSON_parse_cards(cards){
    let res = []
    cards.forEach(card => {
        res.push(JSON_parse_card(card))
    });
    return res
}

function JSON_parse_card(card){
    return create_card(card.id, card.name, card.number, card.suit, card.color, card.weight)
}

function JSON_parse_player(player){
    let p = create_player(player.id, player.name, JSON_parse_cards(player.hand))
    p.my_turn = player.my_turn
    p.fold = player.fold
    p.ranked = player.ranked
    p.connected = player.connected
    p.id_board = player.id_board
    return p
}

function JSON_parse_ranking(ranking){
    let r = create_ranking(0)
    r.set_pdt(JSON_parse_player(ranking.pdt))
    r.set_vpdt(JSON_parse_player(ranking.vpdt))
    r.set_vtdc(JSON_parse_player(ranking.vtdc))
    r.set_tdc(JSON_parse_player(ranking.tdc))
    ranking.neutrals.forEach(p => {
        r.add_neutral(JSON_parse_player(p))
    });
    return r
}

function escapeHtml(text) {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function randomHex(){
    return ('#' + (function co(lor){   
        return (lor +=
        [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)])
        && (lor.length == 6) ?  lor : co(lor); 
    })('')
    )
}