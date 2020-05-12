// simple double triplet quad
id_card_selected = []

function start_game(){
    if(my_board.get_nb_players() > 3){
        socket.emit('start_game')
    } else {
        console.log("Not enough players")
    }
}

socket.on('ask_for_hand', function(){
    animation_transition('settings','game', 'grid')
    display_all_player_in_game()
    id_card_selected = []
    $('#board_cards > .cards > *').remove()
    $('#hand > *').remove()
    socket.emit('ask_for_hand')
})

socket.on('your_hand', function(player){
    my_player = JSON_parse_player(player)
    display_hand()
    $('#players .nb_cards').text(my_player.get_hand().length)
    socket.emit('get_turn')
})

socket.on('turn', function(data){
    my_board.set_pot(JSON_parse_pot(data.pot))
    my_board.set_player_turn(my_board.get_player_by_id(data.player_turn_id))
    my_board.set_jump(data.is_jump)
    if(my_board.get_player_turn().get_id() == my_player.get_id()){ // if my turn
        my_player.set_my_turn(true)
        audio_turn.play()
    }
    display_turn()
})

socket.on('card_played', function(data){
    my_board.set_pot(JSON_parse_pot(data.pot))
    display_nb_cards_player(data.id, data.score)
    display_card_board()
    socket.emit('get_turn')
})

socket.on('player_fold', function(data){
    display_player_sleep(data.id)
    add_message_historic('<span class="action"> se couche</span>')
    socket.emit('get_turn')
})

socket.on('player_jump', function(name){
    add_message_historic('<span class="action"> s\'est fait sweep</span>')
    socket.emit('get_turn')
})

socket.on('round_winner', function(data){
    $('#board_cards .cards > *').remove()
    socket.emit('update_player')
    my_player.set_fold(false)
    my_board.set_jump(false)
    my_board.incr_round()
    let c = JSON_parse_card(data.cards[0])
    if(data.is_pdt){
        audio_wow.play()
        add_message_historic('<span class="player">' + data.winner_pseudo + '</span><span class="action"> devient président')
    } else {
        add_message_historic('<span class="player">' + data.winner_pseudo + '</span><span class="action"> remporte le tour')
    }
    socket.emit('get_turn')
})

socket.on('end_game', function(ranking){
    ranking = JSON_parse_ranking(ranking)
    my_board.incr_party()
    $('#settings .ranking .content > *').remove()
    $('#settings .ranking .content').append('<p>La partie ' + my_board.get_party() + ' vient de se terminer en ' + my_board.get_round() + ' tours</p>')
    $('#settings .ranking .content').append('<p><span style="color:white; background-color: #FFD700">LE PRESIDENT</span> <b>' + ranking.get_pdt().get_name() + '</b></p>')
    $('#settings .ranking .content').append('<p><span style="color:white; background-color: #888888">LE VICE PRESIDENT</span> <b>' + ranking.get_vpdt().get_name() + '</b></p>')
    ranking.get_neutrals().forEach(p => {
        $('#settings .ranking .content').append('<p><span style="color:white; background-color: blue">LE NEUTRE</span> <b>' + p.get_name() + '</b></p>')
    })
    $('#settings .ranking .content').append('<p><span style="color:white; background-color: #D2691E">LE VICE TROU DU CUL</span> <b>' + ranking.get_vtdc().get_name() + '</b></p>')
    $('#settings .ranking .content').append('<p><span style="color:white; background-color: #A52A2A">LE TROU DU CUL</span> <b>' + ranking.get_tdc().get_name() + '</b></p>')
    my_board.round = 0
    animation_transition('game', 'settings', 'inherit')
})

function display_places(msg){
    $('#info .places').append(msg)
}

socket.on('update_player', function(p){
    my_player = JSON_parse_player(p)
})

function display_hand(){
    time = 0
    my_player.get_hand().forEach(card => {
        setTimeout(function(){
            $('#hand').append('<div class="one_card" onclick="select_card(' + card.get_id() + ')" style="display: none; color:' + card.get_color() + '" id="' + card.get_id() + '"> ' + card.get_name() + card.get_suit() + ' </div>')
            $("#hand #" + card.get_id()).css("line-height", (window.innerHeight*0.2) + "px")
            $('#hand .one_card').slideDown()
        }, time * 300)
        time += 1
    });
    $('#options').fadeIn()
}

function display_turn(){
    add_message_historic('<span class="player">' + my_board.get_player_turn().get_name() + '</span>')
}

function display_card_board(){
    $('#board_cards .cards > *').remove()
    if(my_board.get_pot_cards().length > 0){
        let cards_text = ''
        my_board.get_pot_cards().forEach(card => {
            $('#board_cards .cards').append('<div class="one_card" style="color:' + card.get_color() + '"> ' + card.get_name() + card.get_suit() + ' </div>')
            $("#board_cards .one_card" + card.get_id()).css("line-height", (window.innerHeight*0.2) + "px")
            cards_text += '<span class="card_msg" style="color:' + card.get_color() + '">' + card.get_name() + ' ' + card.get_suit() + ' </span>'
        });
        add_message_historic('<div class="action" style="display:flex">' + cards_text + '</div>')
    }
}

function add_message_historic(msg){
    $('#historic .content').append(msg)
    update_scrollbar()
}

function select_card(id_card){
    if(id_card_selected.includes(id_card)){
        id_card_selected.splice(id_card_selected.indexOf(id_card), 1)
        $('#' + id_card).css('background-color', 'rgb(255,255,255)')
        $('#' + id_card).css('margin-top', '80px')
    } else {
        id_card_selected.push(id_card)
        $('#' + id_card).css('background-color', 'rgb(215,215,215)')
        $('#' + id_card).css('margin-top', '10px')
    }
}

function play_card(){
    if(my_player.is_my_turn()){
        let card_selected = []
        id_card_selected.forEach(id => {
            card_selected.push(my_player.get_card_by_id(id))
        });
        if (((!my_board.is_jump() && check_play_possible(card_selected, my_board.get_pot_cards())) || (my_board.is_jump() && check_jump_play_possible(card_selected, my_board.get_pot_cards())))) {
            socket.emit("play_cards", card_selected)
            socket.emit("update_player")
            my_player.set_my_turn(false)
            remove_cards()
        }
    } else {
        console.log("Error (play_card) : not your turn")
    }
}

function remove_cards(){
    for (let i = 0; i < id_card_selected.length; i++) {
        $('#hand #' + id_card_selected[i]).remove();
    }
    id_card_selected = []
}

function fold(){
    if (my_player.is_my_turn()) {
        my_player.set_fold(true)
        my_player.set_my_turn(false)
        socket.emit("fold")
    } else {
        console.log('Error (fold): not your turn')
    }
}

function update_scrollbar(){
    objDiv = document.getElementById("content_historic")
    objDiv.scrollTop = objDiv.scrollHeight;
}