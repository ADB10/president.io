socket.on('new_player', function(p){
    p = JSON_parse_player(p)
    display_new_player(p)
    my_board.add_player(p)
    display_nb_players(my_board.get_nb_players())
})

socket.on('player_disconnected', function(id){
    display_remove_player(id)
    my_board.remove_player(id)
    display_nb_players(my_board.get_nb_players())
})

// display and check game start
function display_nb_players(nb) {
    css_link = '#settings .start_game .nb_players'
    $(css_link).text(nb + '')
    css_link = '#settings .start_game'
    if (nb > 3) {
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