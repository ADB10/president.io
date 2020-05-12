socket.on('new_player', function(player){
    let p = JSON_parse_player(player)
    my_board.add_player(p)
    display_new_player(p)
    display_nb_players()
    check_game_possible()
})

socket.on('player_disconnected', function(id){
    my_board.remove_player(id)
    display_remove_player(id)
    display_nb_players()
    check_game_possible()
})

// display and check game start
function check_game_possible(){
    css_link = '#settings .start_game'
    if (my_board.players.length > 3) {
        $(css_link + ' button').prop("disabled", false)
        $(css_link + ' button').removeClass("disabled")
        $(css_link + ' p > span').removeClass('bad_nb_players')
        $(css_link + ' p > span').addClass('good_nb_players')
    } else {
        $(css_link + ' button').prop("disabled", true)
        $(css_link + ' button').addClass("disabled")
        $(css_link + ' p > span').removeClass('good_nb_players')
        $(css_link + ' p > span').addClass('bad_nb_players')
    }
}