function display_players_first_connection(){
    $('.code_party').text(my_player.get_id_board())
    my_board.get_players().forEach(p => {
        display_new_player(p)
    });
}

function display_new_player(p){
    $('#players').append(
        '<div class="player" id="player_' + p.get_id() + '">' +
            '<i class="material-icons">person</i>' +
            '<p class="pseudo">' +
                p.get_name() +
            '</p>' +
        '</div>'
    )
}

function display_remove_player(id){
    $('#players #player_' + id).remove()
}

let players_interface_open = true

$('#players .collapse').click(function(){
    if(players_interface_open){
        $('#players .collapse .close').css('display', 'none')
        $('#players .collapse .open').css('display', 'inherit')
        $('#players').css('min-width', '30px')
        $('#players').css('max-width', '30px')
        $('#board').css('width', (screen_width_size - 15) + 'px')
        $('#players').removeClass('open')
        $('#players').addClass('close')
    } else {
        $('#players .collapse .open').css('display', 'none')
        $('#players .collapse .close').css('display', 'inherit')
        $('#players').css('min-width', '350px')
        $('#players').css('max-width', '350px')
        $('#board').css('width', (screen_width_size - 335) + 'px')
        $('#players').removeClass('close')
        $('#players').addClass('open')
    }
    players_interface_open = !players_interface_open
})