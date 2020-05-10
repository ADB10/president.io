/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
// DELARATION VARIABLES
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

http = require('http');
express = require('express');
app = express();

app.get('/', function(req, res) { res.render('index.ejs') })
.use(express.static(__dirname + '/modules/client'))
.use(express.static(__dirname + '/modules/all'))
.use(express.static(__dirname + '/public'));

var fs = require('fs');
eval(fs.readFileSync('./modules/server/Server.js')+'');
eval(fs.readFileSync('./modules/server/Deck.js')+'');
eval(fs.readFileSync('./modules/all/Ranking.js')+'');
eval(fs.readFileSync('./modules/server/Pot.js')+'');
eval(fs.readFileSync('./modules/server/Board.js')+'');
eval(fs.readFileSync('./modules/all/Card.js')+'');
eval(fs.readFileSync('./modules/all/Player.js')+'');
eval(fs.readFileSync('./public/js/json_fct.js')+'');

server_http = http.createServer(app)
io = require('socket.io').listen(server_http)

server = create_server()

/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
// CONNEXION AVEC LE CLIENT SOCKET.IO
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

io.sockets.on('connection', function(socket) {

    socket.player = null // view on player
    socket.board = null // view on board

    function setup_socket_connection(){
        socket.join(socket.board.get_id())
        socket.emit('connected_ok', {
            my_player: socket.player,
            other_players: socket.board.get_players()
        })
        socket.to(socket.board.get_id()).emit('new_player', socket.player)
    }

    socket.on('create_board', function(pseudo){
        socket.board = server.create_new_board() // view on board
        socket.player = server.player_connected(pseudo, socket.board) // view on player
        setup_socket_connection()
    })

    socket.on('join_board', function(data){
        if(data.id_board != null && server.is_board_exist(data.id_board)){
            socket.board = server.get_board_by_id(data.id_board) // view on board
            socket.player = server.player_connected(data.pseudo, socket.board) // view on player
            setup_socket_connection()
        } else {
            socket.emit('connection_failed')
        }
    })

    socket.on('disconnect', function(){
        if(socket.player != null){
            server.player_disconnected(socket.player.get_id())
            socket.to(socket.board.get_id()).emit('player_disconnected', socket.player.get_id())
        }
    })

    socket.on('start_game', function(){
        // empeche d'actualiser la page pour recommencer on doit restart le serva cahque fois
        if(socket.board.get_ranking() == null) socket.board.set_player_turn(socket.board.get_players()[(Math.floor(Math.random() * Math.floor(socket.board.get_players().length)))]) // if first game random else tdc (set in set_start_hands)
        socket.board.reset_players_hand()
        socket.board.reset_players_fold()
        socket.board.reset_players_turn()
        socket.board.round_winner = null
        socket.board.jump = false
        socket.board.set_starting_hands(Math.floor(52/(socket.board.get_players().length)))
        socket.board.reset_ranking()
        socket.board.reset_pot()
        io.sockets.to(socket.board.get_id()).emit('ask_for_hand')
    })

    socket.on('ask_for_hand', function(){
        socket.emit('your_hand', socket.player)
    })

    socket.on('play_cards', function(cards){
        cards = JSON_parse_cards(cards)
        socket.board.get_pot().add_new_pot(socket.player, cards)
        socket.board.remove_cards_of_player(socket.player.get_id(), cards)
        socket.board.update_player_statut(socket.player.get_id())
        if(socket.board.get_ranking().get_nb_ranked() < (socket.board.get_players().length-1) ){
            if(socket.board.get_pot().is_jump()) socket.board.set_jump(true)
            socket.board.next_player_turn()
            io.sockets.to(socket.board.get_id()).emit('card_played', {
                id: socket.player.get_id(),
                score: socket.player.get_hand_size(),
                pot: socket.board.get_pot().get_pot()
            })
        } else { //end game
            socket.board.next_player_turn() // get tdc id
            socket.board.get_ranking().add_player(socket.board.get_player_turn())
            io.sockets.to(socket.board.get_id()).emit('end_game', socket.board.get_ranking())
        }
    })

    socket.on('fold', function(){
        let p = socket.player
        socket.board.next_player_turn()
        if(socket.board.is_jump()){
            socket.board.set_jump(false)
            io.sockets.to(socket.board.get_id()).emit('player_jump', p.get_name())  
        } else {
            p.set_fold(true)
            io.sockets.to(socket.board.get_id()).emit('player_fold', p.get_name())   
        }         
    })

    socket.on('update_player', function(){
        socket.emit('update_player', socket.player)
    })

    socket.on('get_turn', function(){
        if(socket.player.get_id() == socket.board.get_player_turn().get_id()){
            if(socket.board.is_round_winner()){
                io.sockets.to(socket.board.get_id()).emit('round_winner', {
                    winner_pseudo: socket.board.get_round_winner().get_name(),
                    winner_id: socket.board.get_round_winner().get_id(),
                    is_pdt: (socket.board.get_ranking().get_pdt() != null && socket.board.get_ranking().get_pdt().get_id() == socket.board.get_round_winner().get_id()),
                    cards: socket.board.get_pot().get_cards()
                })
                socket.board.reset_players_fold()
                if(socket.board.get_pot().get_player().is_ranked()){ // if ranked
                    socket.board.set_player_turn(socket.board.get_pot().get_player())
                    socket.board.next_player_turn()
                } else {
                    socket.board.set_player_turn(socket.board.get_round_winner())
                }
                socket.board.set_jump(false)
                socket.board.get_pot().reset_pot()
            } else {
                io.sockets.to(socket.board.get_id()).emit('turn', {
                    player_turn: socket.board.get_player_turn(),
                    pot: socket.board.get_pot().get_pot(),
                    is_jump: socket.board.is_jump()
                })
            }
        }
    })

})

server_http.listen(8080)
 