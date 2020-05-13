function display_ranking(ranking, party, round){
    $('#settings .ranking .content > *').remove()
    $('#settings .ranking .content').append('<p>La partie ' + party + ' vient de se terminer en ' + round + ' tours</p>')
    $('#settings .ranking .content').append('<p><span style="color:white; background-color: #FFD700">LE PRESIDENT</span> <b>' + ranking.get_pdt().get_name() + '</b></p>')
    $('#settings .ranking .content').append('<p><span style="color:white; background-color: #888888">LE VICE PRESIDENT</span> <b>' + ranking.get_vpdt().get_name() + '</b></p>')
    ranking.get_neutrals().forEach(p => {
        $('#settings .ranking .content').append('<p><span style="color:white; background-color: blue">LE NEUTRE</span> <b>' + p.get_name() + '</b></p>')
    })
    $('#settings .ranking .content').append('<p><span style="color:white; background-color: #D2691E">LE VICE TROU DU CUL</span> <b>' + ranking.get_vtdc().get_name() + '</b></p>')
    $('#settings .ranking .content').append('<p><span style="color:white; background-color: #A52A2A">LE TROU DU CUL</span> <b>' + ranking.get_tdc().get_name() + '</b></p>')
}