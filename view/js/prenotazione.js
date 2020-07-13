var sessione_corrente = localStorage.getItem("BOOKSESSION_ID");
var soggiorno = JSON.parse(localStorage.getItem("soggiorno"));
var annunci = JSON.parse(localStorage.getItem("annunci"));
var id = getQueryVariable("id");


function clickPrenota(id_alloggio) {
    //apertura modal
    var checkin = soggiorno.checkin;
    var checkout = soggiorno.checkout;
    //ospiti e camere

    var res = richiedi("../../controller/prenotazione?action=notificaPrenota&checkin="+checkin+"&checkout="+checkout+"&id_all="+id_alloggio+"&session_id="+sessione_corrente);
    var warning = document.getElementById("warn");

    if(res == "ERR") {
        alert("Errore!");
        return false;
    }
    else if(res == "NOSESSION") {
        warning.innerHTML+="<div class='alert alert-warning' role='alert'>Devi effettuare il login per prenotare!</div>";
    }
    else if(res == "EXCEEDED") {
        mostraAvviso(warning);
    }
    else if(res == "OK") {
        mostra(id_alloggio);
    }
    return true;
}

function mostraAvviso(warning) {
    var butt1 = document.getElementById("pagaloco");
    var butt2 = document.getElementById("pagacarta");
    warning.innerHTML="<div class='alert alert-warning' role='alert'>Hai superato i 28 giorni!</div>";
    butt1.innerHTML="<button type='button' class='btn btn-success mr-auto' data-toggle='modal' data-target='#modalSuccesso' disabled>Paga in loco</button>";
    butt2.innerHTML="<button type='button' class='btn btn-success' data-dismiss='modal' disabled>Paga con carta</button>"
}

function mostra(id_alloggio) {
    var containersogg = document.getElementById("soggiorno");
    containersogg.innerHTML="<li>Check-In: "+soggiorno.checkin+"</li>"+
                        "<li>Check-Out: "+soggiorno.checkout+"</li>"+
                        "<li>Località: "+
                        "<li>Ospiti: "+soggiorno.ospiti+"</li>"+
                        "<h4 class='prezzo'>"+(soggiorno.ospiti)*annunci[id].prezzo+"€/notte</h4>"+
                        "<p class='prezzo'>tasse di soggiorno escluse</p>";
    var butt1 = document.getElementById("pagaloco");
    var butt2 = document.getElementById("pagacarta");

    butt1.innerHTML="<button type='button' class='btn btn-success mr-auto' data-toggle='modal' data-target='#modalSuccesso' onClick='clickEffettuaPagamentoLoco("+id_alloggio+")'>Paga in loco</button>";
    butt2.innerHTML="<button type='button' class='btn btn-success' data-dismiss='modal' onClick='clickPagaCarta("+id_alloggio+")'>Paga con carta</button>"
}

function clickEffettuaPagamentoLoco(id_all){
    var res = richiedi("../../controller/prenotazione?action=notificaPagamentoInLoco&checkin="+soggiorno.checkin+"&checkout="+soggiorno.checkout+"&session_id="+sessione_corrente+"&id_all="+id_all+"&ospiti="+soggiorno.ospiti+"&prezzo="+annunci[id].prezzo+"&emailLoc="+annunci[id].email_locatore_fk);

    if (res == "ERR") {
		alert("Errore!");
		return false;
    }  
    
    return true;
}

function clickPagaCarta(id_all) {
    //action fittizia
    window.open("../view/Pagamento.html?notificaPagamentoConCarta&id_alloggio="+id_all+"&id="+id,"_self", true);
    return true;
}

function aggiorna() {
    var res = richiedi("../../controller/prenotazione?action=notificaPagamentoConCarta&session_id="+sessione_corrente);

    if(res == "ERR") {
        alert("Errore!")
        return false;
    }
    else if(res == "NOSESSION") {
        alert("Devi effettuare il login per pagare!");
        return false;
    }
    else {
        res = JSON.parse(res);
        document.getElementById("emailreg").value=res[0].email;
        document.getElementById("nomereg").value=res[0].nome
        document.getElementById("cognomereg").value=res[0].cognome;
        document.getElementById("datareg").value = JSON.stringify(res[0].ddn).substring(1,11);
        document.getElementById("ldnreg").value=res[0].ldn;
        document.getElementById("residenzareg").value=res[0].residenza;
        document.getElementById("indirizzoreg").value=res[0].indirizzo;
        document.getElementById("cellularereg").value=res[0].cellulare;

        var form = document.getElementById("formOspiti");

        for(var i=1; i<soggiorno.ospiti; i++) {
            form.innerHTML+=
            "<br>"+
            "<div class='col-md-8 offset-md-2 order-md-1'>"+
            "<div class='card'>"+
                "<div class='card-body'>"+
                    "<h3 class='mb-3'>Dati ospite</h3>"+
                    "<div class='row'>"+
                        "<div class='col-md-6 mb-3'>"+
                            "<label for='nome'>Nome</label>"+
                            "<input type='text' class='form-control' id='nome"+i+"' placeholder='Inserisci nome' value='' required>"+
                        "</div>"+
                        "<div class='col-md-6 mb-3'>"+
                            "<label for='cognome'>Cognome</label>"+
                            "<input type='text' class='form-control' id='cognome"+i+"' placeholder='Inserisci cognome' value='' required>"+
                        "</div>"+
                    "</div>"+

                    "<div class='mb-3'>"+
                        "<label for='data'>Data di nascita</label>"+
                        "<input type='date' class='form-control' id='data"+i+"' required>"+
                    "</div>"+


                    "<div class='mb-3'>"+
                        "<label for='ldn'>Luogo di nascita</label>"+
                        "<input type='text' class='form-control' id='ldn"+i+"' placeholder='Inserisci luogo di nascita' required>"+
                    "</div>"+
                    "<div class='mb-3'>"+
                        "<label for='residenza'>Luogo di residenza</label>"+
                        "<input type='text' class='form-control' id='residenza"+i+"' placeholder='Inserisci luogo di residenza' required>"+
                    "</div>"+
                    "<div class='mb-3'>"+
                        "<label for='indirizzo'>Indirizzo</label>"+
                        "<input type='text' class='form-control' id='indirizzo"+i+"' placeholder='Inserisci indirizzo di residenza' required>"+
                    "</div>"+

                    "<div class='row'>"+
                        "<div class='col-md-5 mb-3'>"+
                            "<label for='categoria'>Categoria</label>"+
                            "<select class='custom-select d-block w-100' id='categoria"+i+"' required>"+
                                "<option value='impiegato'>Impiegato</option>"+
                                "<option value='disoccupato'>Disoccupato</option>"+
                                "<option value='studente'>Studente</option>"+
                                "<option value='liberoprof'>Libero professionista</option>"+
                                "<option value='forzaord'>Forza dell'ordine</option>"+
                                "<option value='accompagnatoretur'>Accompagnatore turistico</option>"+
                                "<option value='autista'>Autista di autobus</option>"+          
                            "</select>"+
                        "</div>"+
                    "</div>"+
                "</div>"+
            "</div>"+
            "</div>";
        }

        var importoTotale = ((annunci[id].prezzo)*soggiorno.ospiti)*(parseInt((new Date(soggiorno.checkout) - new Date(soggiorno.checkin)) / (24 * 3600 * 1000)));
        var totale = document.getElementById("totale");
        totale.innerHTML+="Prezzo soggiorno: €"+importoTotale+"";
    }
}

function clickCalcolaTasse() {
    //La richiesta invia solamente le categorie per il calcolo delle tasse di soggiorno.
    var id_alloggio = getQueryVariable("id_alloggio");
    var categorie = [];
    for(var i=0; i<soggiorno.ospiti; i++) {
        categorie.push(document.getElementById('categoria'+i).options[document.getElementById('categoria'+i).selectedIndex].value);
    }
    var cat = JSON.stringify(categorie);
    var res = richiedi("../../controller/prenotazione?action=notificaInserimentoDatiOspite&categorie="+cat+"&id_all="+id_alloggio+"&session_id="+sessione_corrente);

    if(res == "ERR") {
        alert("Errore!")
        return false;
    }
    else if(res == "NOSESSION") {
        alert("Devi effettuare il login per pagare!");
        return false;
    }
    else {
        res = JSON.parse(res);
        var tasse = document.getElementById("tasse");
        for(var i=0; i<soggiorno.ospiti; i++) {
            tasse.innerHTML+=
            "<li>Ospite "+i+": €"+res[i]+"</li>";
        }
    }
}

function clickEffettuaPagamento() {

    var id_alloggio = getQueryVariable("id_alloggio");
    var categorie = [];
    var ospite = new Array();
    var check1, check2;

    for(var i=0; i<soggiorno.ospiti; i++) {
        if(i==0) {
            categorie.push(document.getElementById('categoria'+i).options[document.getElementById('categoria'+i).selectedIndex].value);
        }
        else {
            categorie.push(document.getElementById('categoria'+i).options[document.getElementById('categoria'+i).selectedIndex].value);

            ospite[i] = new Array();
            ospite[i][0] = document.getElementById("nome"+i).value;
            ospite[i][1] = document.getElementById("cognome"+i).value;
            ospite[i][2] = document.getElementById("data"+i).value;
            ospite[i][3] = document.getElementById("ldn"+i).value;
            ospite[i][4] = document.getElementById("residenza"+i).value;
            ospite[i][5] = document.getElementById("indirizzo"+i).value;

        }
    }

    //Controllo campi ospiti.
    for(var i=0; i<soggiorno.ospiti; i++) {
        if(categorie[i] == '') {
            check1=false;
            return;
        }
        i++;
        for(var j=0; j<6; j++) {
            console.log(i)
            if(ospite[i][j] == '') {
                check1=false;
                return;
            }
        }
    }

    for(var i=1; i<=4; i++) {
        if(document.getElementById(i).value == '') {
            check2=false;
            return;
        }
    }

    if(check1 != false && check2 != false) {
        var cat = JSON.stringify(categorie);
        var osp = JSON.stringify(ospite);
        var res = richiedi("../../controller/prenotazione?action=notificaEffettuaPagamento&categorie="+cat+"&datiOspiti="+osp+"&id_all="+id_alloggio+
                            "&checkin="+soggiorno.checkin+"&checkout="+soggiorno.checkout+"&ospiti="+soggiorno.ospiti+"&prezzo="+annunci[id].prezzo+"&emailLoc="+annunci[id].email_locatore_fk+"&session_id="+sessione_corrente);

        if(res == "ERR") {
            alert("Errore!")
            return false;
        }
        else if(res == "NOSESSION") {
            alert("Devi effettuare il login per pagare!");
            return false;
        }
        else {
            alert("Prenotazione effettuata con successo e email inviate!")
        }

        return true;
    }

    return false;
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}