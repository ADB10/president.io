class Server{

    constructor(){
        this.boards = []
        this.players = []
        this.total_players = 0 // id of players
    }

    get_player_by_id(id_player){
        let res = null
        this.players.forEach(p => {
            if(p.get_id() == id_player) res = p
        });
        return res
    }

    get_board_by_id(id_board){
        let res = null
        this.boards.forEach(b => {
            if(b.get_id() == id_board) res = b
        });
        return res
    }

    is_board_exist(id_board){
        let res = false
        this.boards.forEach(b => {
            if(b.get_id() == id_board) res = true
        });
        return res
    }

    create_new_board(){
        let id_board = (Math.floor(Math.random() * Math.floor(9000)) + 1000) // id between 1000 - 9999
        while (this.is_board_exist(id_board + '')){
            id_board = (Math.floor(Math.random() * Math.floor(9000)) + 1000)
        }
        this.boards.push(create_board(id_board + ''))
        return this.boards[this.boards.length-1]
    }

    player_connected(name, board){
        this.total_players++
        let p = create_player(this.total_players, name, [])
        p.set_id_board(board.get_id())
        this.players.push(p)
        this.get_board_by_id(board.get_id()).add_player(p)
        return this.get_board_by_id(board.get_id()).get_player_by_id(p.get_id())
    }

    player_disconnected(id_player){
        this.players.splice(this.players.indexOf(this.get_player_by_id(id_player)), 1)
    }

}

function create_server(){
    return new Server()
}