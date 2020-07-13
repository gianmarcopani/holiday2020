var sessione_corrente = localStorage.getItem("BOOKSESSION_ID");

window.onload = function() {
    mostra();
}

function mostra() {

    var res = richiedi("../../controller/gestionealloggi?action=notificaGestioneAlloggi&session_id=" + sessione_corrente);

    if (res == "ERR") {
        alert("Errore!");
        return false;
    } else if (res == "NOSESSION") {
        alert("Devi effettuare il login per accedere alla pagina!");
        return false;
    } else {
        var listaAlloggi = JSON.parse(res);
        var container = document.getElementById("alloggi");

        for (var i = 0; i < listaAlloggi.length; i++) {
            container.innerHTML +=
                "<div class='carta card' id='alloggio" + i + "'>" +
                "<div class='card-header bg-success' id = 'heading" + i + "'>" +
                "<h5 class='mb-0'>" +
                "<button type='button' onClick='clickAlloggio(" + listaAlloggi[i].id_alloggio + ", " + i + ")' class='btn btn-link btn-outline-dark' data-toggle='modal' data-target='#modalAlloggio" + i + "' aria-expanded='true'>" +
                "<strong>Alloggio #" + i + "</strong>" +
                "</button>" +
                "<p class='float-right'><strong>TOTALE: €" + listaAlloggi[i].guadagno + "</strong></p>" +
                "</h5>" +
                "</div>" +
                "</div>" +
                "<div class='modal fade' id='modalAlloggio" + i + "' tabindex='-1' role='dialog' aria-labelledby='modalAlloggio" + i + "' aria-hidden='true'>" +
                "<div class='modal-dialog' role='document'>" +
                "<div class='modal-content'>" +
                "<div class='modal-header'>" +
                "<h3 class='modal-title' id='modalAlloggio" + i + "'>Alloggio #" + i + "</h3>" +
                "<button type='button' class='close' data-dismiss='modal' aria-label='Close'>" +
                "<span aria-hidden='true'>&times;</span>" +
                "</button>" +
                "</div>" +
                "<div class='modal-body'>" +
                "<h4 class='bg-dark'>Richieste in sospeso</h4>" +
                "<div id='innerSOS" + i + "'>" +
                "</div>" +
                "<hr>" +
                "<h4 class='bg-success'>Richieste accettate</h4>" +
                "<div id='innerACC" + i + "'>" +
                "</div>" +
                "<hr>" +
                "<h4 class='bg-danger'>Richieste rifiutate</h4>" +
                "<div id='innerRIF" + i + "'>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>";

        }

        return true;
    }
}

function clickAlloggio(id_all, i) {
    var res = richiedi("../../controller/gestionealloggi?action=notificaCercaDettagli&id_all=" + id_all + "&session_id=" + sessione_corrente);

    if (res == "ERR") {
        alert("Errore!");
        return false;
    } else if (res == "NOSESSION") {
        alert("Devi effettuare il login per accedere alla pagina!");
        return false;
    } else {
        var listaPrenotazioni = JSON.parse(res);

        var containerSOS = document.getElementById("innerSOS" + i);
        var containerACC = document.getElementById("innerACC" + i);
        var containerRIF = document.getElementById("innerRIF" + i);
        containerSOS.innerHTML='';
        containerACC.innerHTML='';
        containerRIF.innerHTML='';

        for (var j = 0; j < listaPrenotazioni.length; j++) {
            if (listaPrenotazioni[j].stato_rendicontazione == 0)
                listaPrenotazioni[j].stato_rendicontazione = "Non effettuata";
            else
                listaPrenotazioni[j].stato_rendicontazione = "Effettuata";
            if (listaPrenotazioni[j].stato_questura == 0)
                listaPrenotazioni[j].stato_questura = "Non effettuata";
            else
                listaPrenotazioni[j].stato_stato_questura = "Effettuata";

            // RICHIESTE IN SOSPESO
            if (listaPrenotazioni[j].stato_prenotazione == 0) {
                containerSOS.innerHTML +=
                    "<div id='sospese" + i + "'>" +
                    "<h5>Richiesta di: " + listaPrenotazioni[j].email_fk + "</h5>" +
                    "<ul>" +
                    "<li>Check-In: " + JSON.stringify(listaPrenotazioni[j].checkin).substring(1,11) + "</li>" +
                    "<li>Check-Out: " + JSON.stringify(listaPrenotazioni[j].checkout).substring(1,11) + "</li>" +
                    "<li>Ora arrivo: " + JSON.stringify(listaPrenotazioni[j].ora_arrivo).substring(1,17) + "</li>" +
                    "<li>Ospiti: " + listaPrenotazioni[j].num_ospiti + "</li>" +
                    "</ul>" +
                    "<button onClick='clickRifiuta(" + listaPrenotazioni[j].id_prenotazione + ")' type='button' class='btn btn-danger float-right'>" +
                    "Rifiuta" +
                    "</button>" +
                    "<button onClick='clickAccetta(" + listaPrenotazioni[j].id_prenotazione + ")' type='button' class='btn btn-success float-right mr-1'>" +
                    "Accetta" +
                    "</button>" +
                    "<br><br>" +
                    "</div>";
            }

            // RICHIESTE ACCETTATE
            if (listaPrenotazioni[j].stato_prenotazione == 1) {
                containerACC.innerHTML +=
                    "<div id='accettate" + i + "'>" +
                    "<h5>Prenotazione di: " + listaPrenotazioni[j].email_fk + "</h5>" +
                    "<ul>" +
                    "<li>Check-In: " + JSON.stringify(listaPrenotazioni[j].checkin).substring(1,11) + "</li>" +
                    "<li>Check-Out: " + JSON.stringify(listaPrenotazioni[j].checkout).substring(1,11) + "</li>" +
                    "<li>Ora arrivo: " + JSON.stringify(listaPrenotazioni[j].ora_arrivo).substring(1,11) + "</li>" +
                    "<li>Ospiti: " + listaPrenotazioni[j].num_ospiti + "</li>" +
                    "<li>Guadagno: €" + listaPrenotazioni[j].importo + "</li>" +
                    "<li>COMUNICAZIONE QUESTURA: <strong>" + listaPrenotazioni[j].stato_questura + "</strong></li>" +
                    "<li>RENDICONTAZIONE: <strong>" + listaPrenotazioni[j].stato_rendicontazione + "</strong></li>" +
                    "</ul>" +
                    "<button onClick='clickCancella(" + listaPrenotazioni[j].id_prenotazione + ")' type='button' class='btn btn-danger float-right'>" +
                    "Cancella" +
                    "</button>" +
                    "<br><br>" +
                    "</div>";

            }

            // RICHIESTE RIFIUTATE
            if (listaPrenotazioni[j].stato_prenotazione == 2) {
                containerRIF.innerHTML +=
                    "<div class='rifiutate" + i + "'>" +
                    "<h5>Richiesta di " + listaPrenotazioni[j].email_fk + "</h5>" +
                    "<ul>" +
                    "<li>Richiesta effettuata per giorno " + JSON.stringify(listaPrenotazioni[j].checkin).substring(1,11) + "</li>" +
                    "<li>Check-Out: " + JSON.stringify(listaPrenotazioni[j].checkout).substring(1,11) + "</li>" +
                    "<li>Ospiti: " + listaPrenotazioni[j].num_ospiti + "</li>" +
                    "</ul>" +
                    "</div>";

            }
        }
    }
}

function clickCancella(id_pren) {
    var res = richiedi("../../controller/gestionealloggi?action=notificaEliminaPrenotazione&id_pren=" + id_pren + "&session_id=" + sessione_corrente);

    if (res == "ERR") {
        alert("Errore!");
        return false;
    } else if (res == "NOSESSION") {
        alert("Devi effettuare il login per accedere alla pagina!");
        return false;
    } else {
        aggiorna();
    }
}

function clickAccetta(id_pren) {
    var res = richiedi("../../controller/gestionealloggi?action=notificaAccettaPrenotazione&id_pren=" + id_pren + "&session_id=" + sessione_corrente);

    if (res == "ERR") {
        alert("Errore!");
        return false;
    } else if (res == "NOSESSION") {
        alert("Devi effettuare il login per accedere alla pagina!");
        return false;
    } else {
        aggiorna();
    }

}

function clickRifiuta(id_pren) {
    clickCancella(id_pren);
}

function aggiorna() {
    window.open("../view/GestioneAlloggi.html", "_self", true);
}