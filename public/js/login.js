/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
// DELARATION VARIABLES
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

my_board = new BoardClient()
my_player = new Player(null, null, [])
first_connection = true

socket = io.connect('http://localhost:8080/');
//socket = io.connect('http://35.239.160.66/');

/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
// LOGIN
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */


$(document).ready(function(){
    $('#login .left-side').css('width', '60%')
    $('#login .left-side .container').slideDown(1000)
    $('#login .right-side .container').slideDown(1000)
})

audio_wow = document.getElementById('wow')
audio_turn = document.getElementById('turn')
audio_triple = document.getElementById('triple')
audio_jump = document.getElementById('jump')

// prov to pass login
/*
first_connection = false
$('#lobby').css('bottom', '0px')
$('#login').fadeOut()
socket.emit('connection_try', (randomHex() + ''))
*/

$('#login .right-side .form #create_board').click(function(){
    pseudo = escapeHtml(document.getElementById('pseudo').value)
    if(pseudo.length > 2 && pseudo.length < 21){
        socket.emit('create_board', pseudo)
    } else {
        $('#login .right-side .form .warning').fadeIn();
    }
})

$('#login .right-side .form #join_board').click(function(){
    pseudo = escapeHtml(document.getElementById('pseudo').value)
    id_board = escapeHtml(document.getElementById('id_board').value)
    if(pseudo.length > 2 && pseudo.length < 21 && id_board.length == 4){
        socket.emit('join_board', {
            pseudo: pseudo,
            id_board: parseInt(id_board, 10)
        })
    } else {
        $('#login .right-side .form .warning').fadeIn();
    }
})

socket.on('connection_failed', function(){
    $('#login .right-side .form .warning').text("Mauvais code.");
    $('#login .right-side .form .warning').fadeIn();
})

socket.on('connected_ok', function(data){
    $('#lobby').css('bottom', '0px')
    $('#login').fadeOut()
    my_player = JSON_parse_player(data.my_player)
    my_board.add_player(my_player)
    data.other_players.forEach(p => {
        p = JSON_parse_player(p)
        if(my_player.get_id() != p.get_id()) my_board.add_player(p)
    });
    $('#lobby .container .settings .code_party').text(my_player.get_id_board())
    display_players_lobby()
})
