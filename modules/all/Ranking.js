class Ranking{
    constructor(nb_players){
        this.pdt = null
        this.vpdt = null
        this.neutrals = []
        this.vtdc = null
        this.tdc = null
        this.nb_ranked = 0
        this.nb_players = nb_players
    }

    set_pdt(p){
        this.pdt = p
    }

    set_vpdt(p){
        this.vpdt = p
    }

    set_vtdc(p){
        this.vtdc = p
    }

    set_tdc(p){
        this.tdc = p
    }

    add_neutral(p){
        this.neutrals.push(p)
    }

    get_pdt(){
        return this.pdt
    }

    get_vpdt(){
        return this.vpdt
    }

    get_vtdc(){
        return this.vtdc
    }

    get_tdc(){
        return this.tdc
    }

    get_neutrals(){
        return this.neutrals
    }

    is_player_ranked(){
        return this.nb_ranked > 0
    }

    add_player(p){
        if(this.pdt == null){
            this.pdt = p
        } else {
            if(this.vpdt == null){
                this.vpdt = p
            } else {
                if(this.nb_ranked < (this.nb_players-2)){ // neutral
                    this.neutrals.push(p)
                } else {
                    if (this.vtdc == null) {
                        this.vtdc = p
                    } else {
                        this.tdc = p
                    }
                }
            }
        }
        this.nb_ranked++
    }

    add_player_tdc(p){
        if(this.tdc == null){
            this.tdc = p
        } else {
            if(this.vtdc == null){
                this.vtdc = p
            } else {
                if(this.nb_ranked < (this.nb_players-2)){ // neutral
                    this.neutrals.push(p)
                } else {
                    if (this.vpdt == null) {
                        this.vpdt = p
                    } else {
                        this.pdt = p
                    }
                }
            }
        }
        this.nb_ranked++
    }

    reset_all(){
        this.pdt = null
        this.vpdt = null
        this.vtdc = null
        this.tdc = null
        this.neutrals = []
        this.nb_ranked = 0
    }

    get_nb_ranked(){
        return this.nb_ranked
    }
}

function create_ranking(nb_players){
    return new Ranking(nb_players)
}