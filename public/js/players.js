function display_players_first_connection(){
    $('.code_party').text(my_player.get_id_board())
    my_board.get_players().forEach(p => {
        display_new_player(p)
    });
}

function display_new_player(p){
    $('#players .list_players').append(
        '<div class="player" id="player_' + p.get_id() + '">' +
            '<div class="container id">' +
                '<i class="material-icons">person</i>' +
                '<p class="pseudo">' +
                    p.get_name() +
                ' | <span style="color:red">0</span> pts</p>' +
            '</div>' +
            '<div class="container classic cards">' +
                '<i class="material-icons">view_column</i>' +
                '<p class="nb_cards"><span>0</span> cartes</p>' +
            '</div>' +
            '<div class="container classic state">' +
                '<i class="material-icons">brightness_3</i>' +
                '<p>couché</p>' +
            '</div>' +
        '</div>'
    )
}

function display_all_player_in_game(){
    my_board.players.forEach(p => {
        display_player_in_game(p.get_id())
    });
}

function display_player_in_game(id){
    $('#player_' + id + ' div.state > i').text('play_circle_outline')
    $('#player_' + id + ' div.state > p').text('en jeu')
}

function display_player_sleep(id){
    $('#player_' + id + ' div.state > i').text('brightness_3')
    $('#player_' + id + ' div.state > p').text('couché')
}

function display_remove_player(id){
    $('#players #player_' + id).remove()
}

function display_nb_players(){
    $('.nb_players').text(my_board.players.length + '')
}

function display_nb_cards_player(id, nb){
    $('#player_' + id + ' .cards .nb_cards > span').text(nb)
}

function set_score(){
    my_board.get_players().forEach(p => {
        $('#players #player_' + p.get_id() + ' .pseudo > span').text(p.get_score())
    });
}

let players_interface_open = true

$('#players .collapse').click(function(){
    if(players_interface_open){
        $('#players .collapse .close').css('display', 'none')
        $('#players .collapse .open').css('display', 'inherit')
        $('#main').css('grid-template-columns', '35px auto')
        $('#players').removeClass('open')
        $('#players').addClass('close')
    } else {
        $('#players .collapse .open').css('display', 'none')
        $('#players .collapse .close').css('display', 'inherit')
        $('#main').css('grid-template-columns', '350px auto')
        $('#players').removeClass('close')
        $('#players').addClass('open')
    }
    players_interface_open = !players_interface_open
})