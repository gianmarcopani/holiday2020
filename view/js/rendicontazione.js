var sessione_corrente = localStorage.getItem("BOOKSESSION_ID");
var prenotazioni = [];

window.onload = function() {
    var res = richiedi("../../controller/rendicontazione?action=notificaRendicontazione&session_id="+sessione_corrente);

    if(res == "NOTAVAILABLE")
        avvisoRendicontazione();
    else if(res == "NOSESSION")
        alert("Devi effettuare il login per accedere alla pagina!");
    else if(res == "ERR")
        alert("Errore!");
    else
        mostra(res);
}

function avvisoRendicontazione() {
    var warning = document.getElementById("warning");
    warning.innerHTML+=
    "<div class='alert alert-warning' role='alert'>"+
        "Non è attualmente possibile fornire la rendicontazione relativa al trimestre precedente!"+
    "</div>";
}

function mostra(res) {
    datiRendicontazione = JSON.parse(res);

    var tabella = document.getElementById("rendicontazione");

    for(var i=0; i<datiRendicontazione.length; i++) {
        tabella.innerHTML+=
        "<tr>"+
            "<td id='pren'>"+datiRendicontazione[i].id_prenotazione+"</td>"+
            "<td>"+datiRendicontazione[i].nome+"</td>"+
            "<td>"+datiRendicontazione[i].cognome+"</td>"+            
            "<td>"+JSON.stringify(datiRendicontazione[i].ddn).substring(1,11)+"</td>"+
            "<td>"+datiRendicontazione[i].ldn+"</td>"+
            "<td>"+datiRendicontazione[i].localita+"</td>"+
            "<td>"+JSON.stringify(datiRendicontazione[i].checkin).substring(1,11)+"</td>"+
            "<td>"+JSON.stringify(datiRendicontazione[i].checkout).substring(1,11)+"</td>"+
            "<td>"+datiRendicontazione[i].categoria+"</td>"+
            "<td>"+datiRendicontazione[i].tassa+"</td>"+
        "</tr>";
        prenotazioni.push(datiRendicontazione[i].id_prenotazione);
    }
    tabella.innerHTML+=
    "</tbody>";

    return true;
}

function clickInviaRendiconto() {
    var prenotazioniUnique = JSON.stringify(prenotazioni.unique());
    var res = richiedi("../../controller/rendicontazione?action=notificaInviaRendiconto&prenotazioni="+prenotazioniUnique+"&session_id="+sessione_corrente);

    if(res == "ERR")
        alert("Errore!");
    else {
        alert("Dati aggiornati con successo e comunicazione all'ufficio turismo effettuata!");
        window.open("../view/Rendicontazione.html", "_self", false);
    }
    return true;
}

Array.prototype.unique = function() {
    return this.filter(function (value, index, self) { 
        return self.indexOf(value) === index;
    });
}