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
eval(fs.readFileSync('./modules/server/Deck.js')+'');
eval(fs.readFileSync('./modules/all/Ranking.js')+'');
eval(fs.readFileSync('./modules/server/Pot.js')+'');
eval(fs.readFileSync('./modules/server/Board.js')+'');
eval(fs.readFileSync('./modules/all/Card.js')+'');
eval(fs.readFileSync('./modules/all/Player.js')+'');
eval(fs.readFileSync('./public/js/json_fct.js')+'');

server = http.createServer(app)
io = require('socket.io').listen(server)

board = create_board()

/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
// CONNEXION AVEC LE CLIENT SOCKET.IO
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

io.sockets.on('connection', function(socket) {

    socket.pseudo = null
    socket.id = null

    socket.on('connection_try', function(pseudo){
        socket.pseudo = pseudo
        socket.id = board.add_player(pseudo)
        board.get_player_by_id(socket.id).set_connected(true)
        socket.emit('connected_ok', {
            my_player: board.get_player_by_id(socket.id),
            tab_id_players : board.get_players_id(),
            tab_name_players : board.get_players_name()
        })
    })

    socket.on('connected', function(){
        socket.broadcast.emit('new_player', board.get_player_by_id(socket.id))
    })

    socket.on('disconnect', function(){
        board.remove_player(socket.id)
        socket.broadcast.emit('player_disconnected', socket.id)
    })

    socket.on('start_game', function(){
        // empeche d'actualiser la page pour recommencer on doit restart le serva cahque fois
        if(board.get_ranking() == null) board.set_player_turn(board.get_players()[(Math.floor(Math.random() * Math.floor(board.get_players().length)))]) // if first game random else tdc (set in set_start_hands)
        board.reset_players_hand()
        board.reset_players_fold()
        board.reset_players_turn()
        board.round_winner = null
        board.jump = false
        board.set_starting_hands(Math.floor(52/(board.get_players().length)))
        board.reset_ranking()
        board.reset_pot()
        socket.broadcast.emit('ask_for_hand', (Math.floor(52/(board.get_players().length))))
    })

    socket.on('ask_for_hand', function(){
        socket.emit('your_hand', board.get_player_by_id(socket.id))
    })

    socket.on('play_cards', function(cards){
        cards = JSON_parse_cards(cards)
        board.get_pot().add_new_pot(board.get_player_by_id(socket.id), cards)
        board.remove_cards_of_player(socket.id, cards)
        board.update_player_statut(socket.id)
        if(board.get_ranking().get_nb_ranked() < (board.get_players().length-1) ){
            if(board.get_pot().is_jump()) board.set_jump(true)
            board.next_player_turn()
            socket.broadcast.emit('card_played', {
                id: socket.id,
                score: board.get_player_by_id(socket.id).get_hand_size(),
                pot: board.get_pot().get_pot()
            })
        } else { //end game
            board.next_player_turn() // get tdc id
            board.get_ranking().add_player(board.get_player_turn())
            socket.broadcast.emit('end_game', board.get_ranking())
        }
    })

    socket.on('fold', function(){
        let p = board.get_player_by_id(socket.id)
        board.next_player_turn()
        if(board.is_jump()){
            board.set_jump(false)
            socket.broadcast.emit('player_jump', p.get_name())  
        } else {
            p.set_fold(true)
            socket.broadcast.emit('player_fold', p.get_name())   
        }         
    })

    socket.on('update_player', function(){
        socket.emit('update_player', board.get_player_by_id(socket.id))
    })

    socket.on('get_turn', function(){
        if(socket.id == board.get_player_turn().get_id()){
            if(board.is_round_winner()){
                socket.broadcast.emit('round_winner', {
                    winner_pseudo: board.get_round_winner().get_name(),
                    winner_id: board.get_round_winner().get_id(),
                    is_pdt: (board.get_ranking().get_pdt() != null && board.get_ranking().get_pdt().get_id() == board.get_round_winner().get_id()),
                    cards: board.get_pot().get_cards()
                })
                board.reset_players_fold()
                if(board.get_pot().get_player().is_ranked()){ // if ranked
                    board.set_player_turn(board.get_pot().get_player())
                    board.next_player_turn()
                } else {
                    board.set_player_turn(board.get_round_winner())
                }
                board.set_jump(false)
                board.get_pot().reset_pot()
            } else {
                socket.broadcast.emit('turn', {
                    player_turn: board.get_player_turn(),
                    pot: board.get_pot().get_pot(),
                    is_jump: board.is_jump()
                })
            }
        }
    })

})

//server.listen(8080)
server.listen(45850);
 