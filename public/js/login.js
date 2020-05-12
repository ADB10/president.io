let my_board = new Board(null)
let my_player = new Player(null, null, [])
let screen_width_size = $(document).width();
let screen_height_size = $(document).height();

socket = io.connect('http://localhost:8080/');
//socket = io.connect('http://35.239.160.66/');

$(document).ready(function(){
    $('#login').css('opacity', '1')
    $('#login .left-side').css('width', '60%')
    $('#login .left-side .container').slideDown(1000)
    $('#login .right-side .container').slideDown(1000)
    $('#historic').css('height', (screen_height_size-300) + 'px')
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
document.getElementById('pseudo').value = randomHex()

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
    animation_transition('login', 'main', 'grid')
    my_board = JSON_parse_board(data.board)
    my_player = my_board.get_player_by_id(data.player.id) // view on player in board
    display_nb_players()
    check_game_possible()
    display_players_first_connection()
})
