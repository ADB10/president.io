http = require('http');
express = require('express');
app = express();

app.get('/', function(req, res) { res.render('index.ejs') })
.use(express.static(__dirname + '/modules'))
.use(express.static(__dirname + '/public'));

var fs = require('fs');
eval(fs.readFileSync('./modules/Server.js')+'');
eval(fs.readFileSync('./modules/Deck.js')+'');
eval(fs.readFileSync('./modules/Ranking.js')+'');
eval(fs.readFileSync('./modules/Pot.js')+'');
eval(fs.readFileSync('./modules/Board.js')+'');
eval(fs.readFileSync('./modules/Card.js')+'');
eval(fs.readFileSync('./modules/Player.js')+'');
eval(fs.readFileSync('./public/js/rules.js')+'');
eval(fs.readFileSync('./public/js/json_fct.js')+'');

server_http = http.createServer(app)
io = require('socket.io').listen(server_http)

server = create_server()

io.sockets.on('connection', function(socket) {

    socket.player = null // view on player of board
    socket.board = null // view on board of server

    function setup_socket_connection(){
        socket.join(socket.board.get_id())
        socket.emit('connected_ok', {
            player: socket.player,
            board: socket.board
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
            if(!server.is_board_in_game(data.id_board)){
                socket.board = server.get_board_by_id(data.id_board) // view on board
                socket.player = server.player_connected(data.pseudo, socket.board) // view on player
                setup_socket_connection()
            } else {
                socket.emit('board_already_in_game')
            }
        } else {
            socket.emit('connection_failed')
        }
    })

    socket.on('disconnect', function(){
        if(socket.player != null){
            if(socket.board.get_player_turn() != null && socket.board.get_player_turn().get_id() == socket.player.get_id()){
                socket.board.next_player_turn() // if it's his turn
                if(socket.board.get_player_turn() != null){
                    io.sockets.to(socket.board.get_id()).emit('turn', {
                        player_turn_id: socket.board.get_player_turn().get_id(),
                        pot: socket.board.get_pot(),
                        is_jump: socket.board.is_jump()
                    })
                }
            } 
            server.player_disconnected(socket.player.get_id())
            socket.board.remove_player(socket.player.get_id())
            socket.to(socket.board.get_id()).emit('player_disconnected', socket.player.get_id())
        }
    })

    socket.on('start_game', function(){
        if(!socket.board.is_in_game()){
            socket.board.start_game()
            io.sockets.to(socket.board.get_id()).emit('ask_for_hand')
        }
    })

    socket.on('ask_for_hand', function(){
        socket.emit('your_hand', socket.player.get_hand())
    })

    socket.on('play_cards', function(cards){
        cards = JSON_parse_cards(cards)

        // check client dont change card value and the play is possible
        if(assert_player_get_cards(socket.player, cards) && ((!socket.board.is_jump() && check_play_possible(cards, socket.board.get_pot().get_cards())) || (socket.board.is_jump() && check_jump_play_possible(cards, socket.board.get_pot().get_cards())))){

            // set new pot and upadte player status
            socket.board.get_pot().add_new_pot(socket.player, cards)
            socket.board.remove_cards_of_player(socket.player.get_id(), cards)
            socket.board.update_player_statut(socket.player.get_id())
            if(socket.board.get_pot().is_jump()) socket.board.set_jump(true)
            socket.board.next_player_turn()
            
            // send cards played
            io.sockets.to(socket.board.get_id()).emit('card_played', {
                id: socket.player.get_id(),
                hand_size: socket.player.get_hand_size(),
                pot: socket.board.get_pot()
            })

            // send end round
            if(socket.board.is_round_winner()){
                io.sockets.to(socket.board.get_id()).emit('end_round', {
                    winner_pseudo: socket.board.get_round_winner().get_name(),
                    winner_id: socket.board.get_round_winner().get_id(),
                    // is_ranked: socket.board.get_round_winner().is_ranked(),
                    // is_pdt: (socket.board.get_ranking().get_pdt() != null && socket.board.get_ranking().get_pdt().get_id() == socket.board.get_round_winner().get_id()),
                    cards: socket.board.get_pot().get_cards()
                })
                socket.board.reset_players_fold()
                socket.board.set_jump(false)
                socket.board.get_pot().reset_pot()
                // if not ranked its his turn
                if(!socket.player.is_ranked()) socket.board.set_player_turn(socket.player)
            }

            // send if player is ranked
            if(socket.player.is_ranked()){
                io.sockets.to(socket.board.get_id()).emit('player_ranked', socket.player)
            }

            // end party
            if(socket.board.get_ranking().get_nb_ranked() >= (socket.board.get_players().length-1)){
                socket.board.get_ranking().add_player(socket.board.get_player_turn())
                socket.board.set_score_player()
                socket.board.incr_party()
                socket.board.set_in_game(false)
                io.sockets.to(socket.board.get_id()).emit('end_game', socket.board)
            }

        // chlient has changed cards
        } else {
            socket.emit('error_play_cards')
        }
    })

    socket.on('fold', function(){
        socket.board.next_player_turn()
        if(socket.board.is_jump()){
            socket.board.set_jump(false)
            io.sockets.to(socket.board.get_id()).emit('player_jump', socket.player.get_id())  
        } else {
            socket.player.set_fold(true)
            io.sockets.to(socket.board.get_id()).emit('player_fold', socket.player.get_id())   
        }         
    })

    socket.on('update_player', function(){
        socket.emit('update_player', socket.player)
    })

    socket.on('get_turn', function(){
        // if winner after all fold
        if(socket.board.is_round_winner()){
            io.sockets.to(socket.board.get_id()).emit('end_round', {
                winner_pseudo: socket.board.get_round_winner().get_name(),
                winner_id: socket.board.get_round_winner().get_id(),
                // is_ranked: socket.board.get_round_winner().is_ranked(),
                // is_pdt: (socket.board.get_ranking().get_pdt() != null && socket.board.get_ranking().get_pdt().get_id() == socket.board.get_round_winner().get_id()),
                cards: socket.board.get_pot().get_cards()
            })
            socket.board.reset_players_fold()
            socket.board.set_jump(false)
            socket.board.get_pot().reset_pot()
            socket.board.set_player_turn(socket.board.get_round_winner())
            if(socket.board.get_round_winner().is_ranked()) socket.board.next_player_turn()
        }
        socket.emit('turn', {
            player_turn_id: socket.board.get_player_turn().get_id(),
            pot: socket.board.get_pot(),
            is_jump: socket.board.is_jump()
        })
    })

})

server_http.listen(8080)
 
