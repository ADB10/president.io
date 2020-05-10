socket.on('new_player', function(p){
    p = JSON_parse_player(p)
    display_player_lobby(p.get_id(), p.get_name())
    my_board.add_player(p)
    display_nb_players(my_board.get_nb_players())
})

socket.on('player_disconnected', function(id){
    my_board.remove_player(id)
    display_nb_players(my_board.get_nb_players())
    remove_player_lobby(id)
})

function remove_player_lobby(id){
    $('#lobby .container .players .list_player #lobby_' + id).remove()
}

function display_players_lobby(){
    my_board.get_players().forEach(p => {
        display_player_lobby(p.get_id(), p.get_name())
    });
    display_nb_players(my_board.get_nb_players())
}

// display and check game start
function display_nb_players(nb) {
    css_link = '#lobby .container .settings .start_game .nb_players'
    $(css_link).text(nb + '')
    css_link = '#lobby .container .settings .start_game'
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

function display_player_lobby(id, name){
    txt = '<li id="lobby_' + id +'" >' + name + '</li>'
    $('#lobby .container .list_player').append(txt)
}

function dark_mode(){
    if(my_board.get_dark_mode()){
        my_board.set_dark_mode(false)
        $('#lobby .settings').css('background-color', 'rgb(255,255,255)')
        $('#lobby .container .settings .set_color .container').css('background-color', 'rgb(255,255,255)')
        $('#lobby .container .settings .set_color .colors .container input ~ .checkmark').css('border-color','rgb(10,10,10)')
        $('h2').css('color', 'rgb(0,0,0)')
        $('h3').css('color', 'rgb(20,20,20)')
        $('p').css('color', 'rgb(55,55,55)')
    }
    else {
        my_board.set_dark_mode(true)
        $('#lobby .settings').css('background-color', 'rgb(10,10,10)')
        // $('#board').css('background-color', 'rgb(10,10,10)')
        // $('#info').css('background-color', 'rgb(10,10,10)')
        // $('#hand').css('background-color', 'rgb(10,10,10)')
        $('#lobby .container .settings .set_color .container').css('background-color', 'rgb(10,10,10)')
        $('#lobby .container .settings .set_color .colors .container input ~ .checkmark').css('border-color','rgb(245,245,245)')
        $('h2').css('color', 'rgb(255,255,255)')
        $('h3').css('color', 'rgb(235,235,235)')
        $('p').css('color', 'rgb(200,200,200)')
    }
}