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
    $('#settings').css('opacity', '0')
    setTimeout(function(){
        $('#settings').css('display', 'none')
        $('#game').css('display', 'flex')
        $('#game').css('opacity', '1')
    }, 500)
    $('#board_cards > .cards > *').remove()
    $('#hand > *').remove()
    socket.emit('ask_for_hand')
})

socket.on('your_hand', function(player){
    my_player = JSON_parse_player(player)
    display_hand()
    $('.nb_cards').text(my_player.get_hand_size() + '')
    socket.emit('get_turn')
})

socket.on('turn', function(data){
    my_board.set_pot(data.pot)
    my_board.set_player_turn(data.player_turn)
    my_board.set_jump(data.is_jump)
    if(my_board.get_player_turn().get_id() == my_player.get_id()){ // if my turn
        my_player.toggle_my_turn()
        audio_turn.play()
    }
    display_turn()
})

socket.on('card_played', function(data){
    $('#player_' + data.id + ' .score .nb_cards').text(data.score + '')
    my_board.set_pot(data.pot)
    display_card_board()
    socket.emit('get_turn')
})

socket.on('player_fold', function(name){
    add_message_info('<p><b>' + name + "</b> vient de passer son tour.<p>")
    socket.emit('get_turn')
})

socket.on('player_jump', function(name){
    add_message_info("<p><b>" + name + "</b> s'est fait swip par " + my_board.get_pot_player().get_name() + ".<p>")
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
        add_message_info('<p><b>' + data.winner_pseudo + '</b> remporte le tour et devient président.</p>')
    } else {
        if(c.get_weight() == 1){
            add_message_info('<p></b>' + data.winner_pseudo + '</b> remporte le tour en placant un 2.</p>')
        } else {
            add_message_info('<p><b>' + data.winner_pseudo + '</b> remporte le tour.</p>')
        }
    }
    socket.emit('get_turn')
})

socket.on('end_game', function(ranking){
    ranking = JSON_parse_ranking(ranking)
    my_board.incr_party()
    $('#info .places > *').remove()
    display_places('<p>La partie ' + my_board.get_party() + ' vient de se terminer en ' + my_board.get_round() + ' tours</p>')
    display_places('<p><span style="color:white; background-color: #FFD700">LE PRESIDENT</span> <b>' + ranking.get_pdt().get_name() + '</b></p>')
    display_places('<p><span style="color:white; background-color: #888888">LE VICE PRESIDENT</span> <b>' + ranking.get_vpdt().get_name() + '</b></p>')
    ranking.get_neutrals().forEach(p => {
        display_places('<p><span style="color:white; background-color: blue">LE NEUTRE</span> <b>' + p.get_name() + '</b></p>')
    })
    display_places('<p><span style="color:white; background-color: #D2691E">LE VICE TROU DU CUL</span> <b>' + ranking.get_vtdc().get_name() + '</b></p>')
    display_places('<p><span style="color:white; background-color: #A52A2A">LE TROU DU CUL</span> <b>' + ranking.get_tdc().get_name() + '</b></p>')
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
    $('.player > .name').css('width', '80%')
    $('#player_' + my_board.get_player_turn().get_id() + ' .name').css('width', '70%')
    add_message_info('<p>C\'est au tour de <b>' + my_board.get_player_turn().get_name() + '<b></p>')
}

function display_card_board(){
    $('#board_cards .cards > *').remove()
    if(my_board.get_pot_cards().length > 0){
        my_board.get_pot_cards().forEach(card => {
            $('#board_cards .cards').append('<div class="one_card" style="color:' + card.get_color() + '"> ' + card.get_name() + card.get_suit() + ' </div>')
            $("#board_cards .one_card" + card.get_id()).css("line-height", (window.innerHeight*0.2) + "px")
            add_message_info('<span class="card_msg" style="color:' + card.get_color() + '">' + card.get_name() + ' ' + card.get_suit() + ' </span>') 
        });
    }
}

function add_message_info(msg){
    $('#board_cards .bot #msg').append(msg)
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
            my_player.toggle_my_turn()
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
        my_player.toggle_my_turn()
        socket.emit("fold")
    } else {
        console.log('Error (fold): not your turn')
    }
}

function update_scrollbar(){
    objDiv = document.getElementById("msg")
    objDiv.scrollTop = objDiv.scrollHeight;
}