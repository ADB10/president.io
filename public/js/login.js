/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
// DELARATION VARIABLES
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

my_board = new BoardClient()
my_player = new Player(null, null, [])
first_connection = true

socket = io.connect('http://localhost:8080/');

/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
// LOGIN
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */


$(document).ready(function(){
    $('#login .left-side').css('width', '60%')
    $('#login .left-side .container').slideDown(2000)
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

$('#login .right-side .form #connection').click(function(){
    pseudo = escapeHtml(document.getElementById('pseudo').value)
    if(pseudo.length > 2 && pseudo.length < 21 && first_connection){
        first_connection = false
        $('#lobby').css('bottom', '0px')
        $('#login').fadeOut()
        socket.emit('connection_try', pseudo)
    } else {
        $('#login .right-side .form .warning').fadeIn();
    }
})

socket.on('connected_ok', function(data){
    my_player = JSON_parse_player(data.my_player)
    for (let i = 0; i < data.tab_id_players.length; i++) {
        if(my_player.get_id() != data.tab_id_players[i]){
            my_board.add_player(new Player(data.tab_id_players[i], data.tab_name_players[i], []))
        }
    }
    socket.emit('connected')
    display_players_lobby()
})

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
