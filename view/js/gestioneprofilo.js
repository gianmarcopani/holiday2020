var sessione_corrente = localStorage.getItem("BOOKSESSION_ID");

window.onload = function() {
    mostra();
}

function mostra() {
    var tipo = richiedi("../../controller/gestioneprofilo?action=getTipoAccount&session_id="+sessione_corrente);

    //AFFITTUARIO O LOCATORE
    if(tipo == 1 || tipo == 2) {

        var res = richiedi("../../controller/gestioneprofilo?action=searchaccount&session_id="+sessione_corrente);

        if(res == "ERR") {
            alert("Errore!");
            return false;
        }
        else if(res == "NOSESSION") {
            alert("Devi effettuare il login per accedere alla pagina!");
            return false;
        }

        else {
            var profilo = JSON.parse(res);
            var datiProfilo = document.getElementById("datiProfilo");
            if(profilo[0].tipo == 1)
                profilo[0].tipo = "Affittuario";
            else
                profilo[0].tipo = "Locatore";
            datiProfilo.innerHTML+=
            "<li><strong>Nome:</strong> "+profilo[0].nome+"</li>"+
            "<br>"+
            "<li><strong>Cognome:</strong> "+profilo[0].cognome+"</li>"+
            "<br>"+
            "<li><strong>Email:</strong> "+profilo[0].email+"</li>"+
            "<br>"+
            "<li><strong>Password:</strong>********</li>"+
            "<br>"+
            "<li><strong>Data di nascita:</strong> "+JSON.stringify(profilo[0].ddn).substring(1,11)+"</li>"+
            "<br>"+
            "<li><strong>Luogo di nascita:</strong> "+profilo[0].ldn+"</li>"+
            "<br>"+
            "<li><strong>Residenza:</strong> "+profilo[0].residenza+"</li>"+
            "<br>"+
            "<li><strong>Indirizzo:</strong> "+profilo[0].indirizzo+"</li>"+
            "<br>"+
            "<li><strong>Telefono:</strong> "+profilo[0].cellulare+"</li>"+
            "<br>"+
            "<li><strong>Tipo:</strong> "+profilo[0].tipo+"</li>";
        }
    }

    //ADMIN
    else if(tipo == "0") {
        var x = document.getElementById("utente");
        x.style.display = "none";

        var res = richiedi("../../controller/gestioneprofilo?action=searchusers&session_id="+sessione_corrente);

        if(res == "ERR") {
            alert("Errore!");
            return false;
        }
        else if(res == "NOSESSION") {
            alert("Devi effettuare il login per accedere alla pagina!")
            return false;
        }

        else {
            var utenti = JSON.parse(res);
            var containeradmin = document.getElementById("blocco");

            for(var i=0; i<utenti.length; i++) {
                if(utenti[i].tipo == 1)
                    utenti[i].tipo = "Affittuario";
                else
                    utenti[i].tipo = "Locatore";

                containeradmin.innerHTML+=
                "<div class='carta card'>"+
                "<div class='card-header bg-success'>"+
                    "<h5 class='mb-0'>"+
                        "Utente #"+i+
                    "</h5>"+
                "</div>"+
                    "<div class='card-body'>"+
                        "<ul>"+
                            "<li><strong>Nome:</strong> "+utenti[i].nome+"</li>"+
                            "<li><strong>Cognome:</strong> "+utenti[i].cognome+"</li>"+
                            "<li><strong>Email:</strong> "+utenti[i].email+"</li>"+
                        "</ul>"+
                        "<!--INZIO MODAL CANCELLAZIONE-->"+
                        "<button type='button' class='btn btn-danger float-right' data-toggle='modal' data-target='#modalConferma"+i+"'>"+
                            "Cancella"+
                        "</button>"+
                        "<div class='modal fade' id='modalConferma"+i+"' tabindex='-1' role='dialog' aria-labelledby='modalConferma1"+i+"' aria-hidden='true'>"+
                            "<div class='modal-dialog' role='document'>"+
                                "<div class='modal-content'>"+
                                    "<div class='modal-header'>"+
                                        "<h4 class='modal-title' id='modalConferma"+i+"'>Sei sicuro?</h4>"+
                                        "<button type='button' class='close' data-dismiss='modal' aria-label='Close'>"+
                                        "<span aria-hidden='true'>&times;</span>"+
                                        "</button>"+
                                    "</div>"+
                                    "<div class='modal-body'>"+
                                    "Cliccando 'Conferma' cancellerai l'utente selezionato"+
                                    "</div>"+
                                    "<div class='modal-footer'>"+
                                        "<button onclick='clickConfermaCancella("+utenti[i].email+")' type='button' class='btn btn-success' data-dismiss='modal'>Conferma</button>"+
                                    "</div>"+
                                "</div>"+
                            "</div>"+
                        "</div>"+
                        "<!-- FINE MODAL CANCELLAZIONE-->"+
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

function clickConfermaModifica() {
    var res = -1;
    var psw = document.getElementById("psw").value;
    var cnf_psw = document.getElementById("confermapsw").value;
    var telefono = document.getElementById("telefono").value;
    var residenza = document.getElementById("ldr").value;
    var indirizzo = document.getElementById("idr").value;

    if(psw == '' || cnf_psw == '' || telefono == '' || residenza == '' || indirizzo == '') {
        alert("Non hai compilato tutti i campi!");
        return false;   
    }     

    if (matchPSW(psw, cnf_psw) == true) {
        res = richiedi("../../controller/gestioneprofilo?action=notificaAggiornaDati&password="+psw+"&telefono="+telefono+"&residenza="+residenza+"&indirizzo="+indirizzo+"&session_id="+sessione_corrente);
    }
    else {
        alert("Le password non coincidono");
        return false;
    }
    if(res == "OK") {
        $('#modalModifica').modal('hide');
        window.open("../view/GestioneProfilo.html", "_self", false);
    }
    else {
        alert("Errore!");
        return false;
    }
    return false;
}

function matchPSW(pwd1, pwd2) {
    if(pwd1 == pwd2){
      return true;
    }
    return false;
}

function clickConfermaCancella(email) {
    var res = richiedi("../../controller/gestioneprofilo?action=notificaCancellaUtente&email="+email+"&session_id="+sessione_corrente);

    if(res == "OK") {
        window.open("../view/GestioneProfilo.html", "_self", false);
    }
    else {
        alert("Errore!");
        return false;
    }
    return false;
}

