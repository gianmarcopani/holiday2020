var sessione_corrente = localStorage.getItem("BOOKSESSION_ID");

window.onload = function() {
    mostra();
}

function mostra() {
    var tipo = richiedi("../../controller/gestioneprenotazioni?action=getTipoAccount&session_id="+sessione_corrente);

    //LOCATORE
    if(tipo == 1 || tipo == 2) {
        var res = richiedi("../../controller/gestioneprenotazioni?action=notificaGestionePrenotazioni&session_id="+sessione_corrente);

        if(res == "ERR") {
            alert("Errore!");
            return false;
        }
        else if(res == "NOSESSION") {
            alert("Devi effettuare il login per accedere alla pagina!")
            return false;
        }

        else {
            var listaPrenotazioni = JSON.parse(res);
            var container = document.getElementById("accordion");

            for(var i=0; i<listaPrenotazioni.length; i++) {
                if(listaPrenotazioni[i].stato_prenotazione == 0) {
                    container.innerHTML+=
                    "<div class='carta card'>"+
                        "<div class='card-header bg-success' id='heading"+i+"'>"+
                            "<h5 class='mb-0'>"+
                                "<button class='btn btn-link btn-outline-success' data-toggle='collapse' data-target='#collapse"+i+"' aria-expanded='true' aria-controls='collapse"+i+"'>"+
                                    "Prenotazione #"+i+""+
                                "</button>"+
                            "</h5>"+
                        "</div>"+
      
                        "<div id='collapse"+i+"' class='collapse' aria-labelledby='heading"+i+"' data-parent='#accordion'>"+
                            "<div class='card-body'>"+
                            "<ul>"+
                                "<li>ID Prenotazione: "+listaPrenotazioni[i].id_prenotazione+"</li>"+
                                "<li>Check-In: "+JSON.stringify(listaPrenotazioni[i].checkin).substring(1,11)+"</li>"+
                                "<li>Check-Out: "+JSON.stringify(listaPrenotazioni[i].checkout).substring(1,11)+"</li>"+
                                "<li>Ora arrivo: "+listaPrenotazioni[i].ora_arrivo+"</li>"+
                                "<li>Prezzo stimato: €"+listaPrenotazioni[i].importo+"</li>"+
                                "<li>Stato prenotazione: <strong>in sospeso</strong></li>"+
                            "</ul>"+
                            "<br>"+
                            "<!--INZIO MODAL CANCELLAZIONE-->"+
                                "<button type='button' class='btn btn-danger float-right' data-toggle='modal' data-target='#modalConferma"+i+"'>"+
                                    "Cancella"+
                                "</button>"+
                                "<div class='modal fade' id='modalConferma"+i+"' tabindex='-1' role='dialog' aria-labelledby='modalConferma"+i+"' aria-hidden='true'>"+
                                    "<div class='modal-dialog' role='document'>"+
                                        "<div class='modal-content'>"+
                                            "<div class='modal-header'>"+
                                                "<h5 class='modal-title' id='modalConferma"+i+"'>Sei sicuro?</h5>"+
                                                "<button type='button' class='close' data-dismiss='modal' aria-label='Close'>"+
                                                "<span aria-hidden='true'>&times;</span>"+
                                                "</button>"+
                                            "</div>"+
                                            "<div class='modal-body'>"+
                                            "Cliccando 'Conferma' cancellerai la prenotazione effettuata"+
                                            "</div>"+
                                            "<div class='modal-footer'>"+
                                                "<button onClick='clickConfermaCancella("+listaPrenotazioni[i].id_prenotazione+")' type='button' class='btn btn-success' data-dismiss='modal'>Conferma</button>"+
                                            "</div>"+
                                        "</div>"+
                                    "</div>"+
                                "</div>"+

                                "<!-- FINE MODAL CANCELLAZIONE-->"+
                            "</div>"+
                        "</div>"+
                    "</div>";                  

                }

                if(listaPrenotazioni[i].stato_prenotazione == 1) {
                    container.innerHTML+=
                    "<div class='carta card'>"+
                        "<div class='card-header bg-success' id='heading"+i+"'>"+
                            "<h5 class='mb-0'>"+
                                "<button class='btn btn-link btn-outline-success' data-toggle='collapse' data-target='#collapse"+i+"' aria-expanded='true' aria-controls='collapse"+i+"'>"+
                                    "Prenotazione #"+i+""+
                                "</button>"+
                            "</h5>"+
                        "</div>"+
                        "<div id='collapse"+i+"'' class='collapse' aria-labelledby='heading"+i+"' data-parent='#accordion'>"+
                            "<div class='card-body'>"+
                            "<ul>"+
                                "<li>ID Prenotazione: "+listaPrenotazioni[i].id_prenotazione+"</li>"+
                                "<li>Check-In: "+JSON.stringify(listaPrenotazioni[i].checkin).substring(1,11)+"</li>"+
                                "<li>Check-Out: "+JSON.stringify(listaPrenotazioni[i].checkout).substring(1,11)+"</li>"+
                                "<li>Ora arrivo: "+listaPrenotazioni[i].ora_arrivo+"</li>"+
                                "<li>Prezzo stimato: €"+listaPrenotazioni[i].importo+"</li>"+
                                "<li>Stato prenotazione: <strong>accettata</strong></li>"+
                            "</ul>"+      
                            "</div>"+
                        "</div>"+
                    "</div>";                 
                }

                if(listaPrenotazioni[i].stato_prenotazione == 2) {
                    container.innerHTML+=
                    "<div class='carta card'>"+
                        "<div class='card-header bg-success' id='heading"+i+"'>"+
                            "<h5 class='mb-0'>"+
                                "<button class='btn btn-link btn-outline-success' data-toggle='collapse' data-target='#collapse"+i+"' aria-expanded='true' aria-controls='collapse"+i+"'>"+
                                    "Prenotazione #"+i+""+
                                "</button>"+
                            "</h5>"+
                        "</div>"+
                        "<div id='collapse"+i+"'' class='collapse' aria-labelledby='heading"+i+"' data-parent='#accordion'>"+
                            "<div class='card-body'>"+
                            "<ul>"+
                                "<li>ID Prenotazione: "+listaPrenotazioni[i].id_prenotazione+"</li>"+
                                "<li>Check-In: "+JSON.stringify(listaPrenotazioni[i].checkin).substring(1,11)+"</li>"+
                                "<li>Check-Out: "+JSON.stringify(listaPrenotazioni[i].checkout).substring(1,11)+"</li>"+
                                "<li>Ora arrivo: "+listaPrenotazioni[i].ora_arrivo+"</li>"+
                                "<li>Prezzo stimato: €"+listaPrenotazioni[i].importo+"</li>"+
                                "<li>Stato prenotazione: <strong>rifiutata</strong></li>"+
                            "</ul>"+      
                            "</div>"+
                        "</div>"+
                    "</div>";                 
                }
            }
        }
    }

    //ADMIN
    else if(tipo == 0) {
        var res = richiedi("../../controller/gestioneprenotazioni?action=notificaGestionePrenotazioni&session_id="+sessione_corrente);

        if(res == "ERR") {
            alert("Errore!");
            return false;
        }
        else if(res == "NOSESSION") {
            alert("Devi effettuare il login per accedere alla pagina!")
            return false;
        }

        else {

            var listaPrenotazioniUtenti = JSON.parse(res);

            var container = document.getElementById("accordion");
            for(var i=0; i<listaPrenotazioniUtenti.length; i++) {
                container.innerHTML+=
                "<div class='carta card'>"+
                    "<div class='card-header bg-success' id='heading"+i+"'>"+
                        "<h5 class='mb-0'>"+
                            "<button class='btn btn-link btn-outline-success' data-toggle='collapse' data-target='#collapse"+i+"' aria-expanded='true' aria-controls='collapse"+i+"'>"+
                                "Prenotazione #"+i+""+
                            "</button>"+
                        "</h5>"+
                    "</div>"+
                    "<div id='collapse"+i+"'' class='collapse' aria-labelledby='heading"+i+"' data-parent='#accordion'>"+
                        "<div class='card-body'>"+
                            "<ul>"+
                                "<li>ID Prenotazione: "+listaPrenotazioniUtenti[i].id_prenotazione+"</li>"+
                                "<li>Check-In: "+JSON.stringify(listaPrenotazioniUtenti[i].checkin).substring(1,11)+"</li>"+
                                "<li>Check-Out: "+JSON.stringify(listaPrenotazioniUtenti[i].checkout).substring(1,11)+"</li>"+
                                "<li>Ora arrivo: "+listaPrenotazioniUtenti[i].ora_arrivo+"</li>"+
                                "<li>Prezzo stimato: €"+listaPrenotazioniUtenti[i].importo+"</li>"+
                                "<li>Stato prenotazione: <strong>rifiutata</strong></li>"+
                            "</ul>"+                            
                        "</div>"+
                    "</div>"+
                "</div>";   
            }
        }
    }

    else if(tipo == "ERR") {
        alert("Errore!");
        return false;
    }
    else if(tipo == "NOSESSION") {
        alert("Devi effettuare il login per accedere alla pagina!");
        return false;
    }

    return true;
}

function clickConfermaCancella(id_pren) {
    var res = richiedi("../../controller/gestioneprenotazioni?action=notificaEliminaPrenotazione&id_pren="+id_pren+"&session_id="+sessione_corrente);

    if(res == "ERR") {
        alert("Errore!");
        return false;
    }
    else if(res == "NOSESSION") {
        alert("Devi effettuare il login per accedere alla pagina!");
        return false;
    }

    //aggiorna
    else
        window.open("../view/GestionePrenotazioni.html", "_self", true);
}