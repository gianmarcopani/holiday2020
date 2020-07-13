var sessione_corrente = localStorage.getItem("BOOKSESSION_ID");

window.onload = function() {
    mostra();
}

function mostra() {
    var tipo = richiedi("../../controller/comunicazionequestura?action=getTipoAccount&session_id="+sessione_corrente);
    var container = document.getElementById("accordion");

    //LOCATORE
    if(tipo == 2) {
        var res = richiedi("../../controller/comunicazionequestura?action=notificaComunicazioneQuestura&session_id="+sessione_corrente);

        if(res == "ERR") {
            alert("Errore!");
            return false;
        }
        else if(res == "NOSESSION") {
            alert("Devi effettuare il login per accedere alla pagina!");
            return false;
        }
        else {
            var stato_pagamento;
            var listaPrenotazioni = JSON.parse(res);
            for(var i=0; i<listaPrenotazioni.length; i++) {
                if(listaPrenotazioni[i].stato_pagamento == 0)
                    stato_pagamento = "sospeso";
                else
                    stato_pagamento = "effettuato";               
                container.innerHTML+=
                "<div class='carta card'>"+
                    "<div class='card-header bg-success' id='heading"+i+"'>"+
                        "<h5 class='mb-0'>"+
                            "<button class='btn btn-link btn-outline-success' data-toggle='collapse' data-target='#collapse"+i+"' aria-expanded='true' aria-controls='collapse'"+i+"'>"+
                                "Prenotazione di "+listaPrenotazioni[i].email_fk+
                            "</button>"+
                        "</h5>"+
                    "</div>"+

                    "<div id='collapse"+i+"' class='collapse' aria-labelledby='heading"+i+"' data-parent='#accordion'>"+
                        "<div class='card-body'>"+
                            "Stato pagamento: <strong>"+stato_pagamento+"</strong>"+
                            "<br>"+

                            "<!-- AGGIUNGI DETTAGLI OSPITI -->"+
                            "<button onclick='clickAggiungiDettagli("+i+", "+listaPrenotazioni[i].stato_pagamento+", "+listaPrenotazioni[i].id_prenotazione+", "+listaPrenotazioni[i].num_ospiti+", "+listaPrenotazioni[i].id_alloggio_fk+")' type='button' class='btn btn-dark float-right mr-1' data-toggle='modal' data-target='#modalDettOsp"+i+"'>"+
                                "Aggiungi dettagli ospiti"+
                            "</button>"+
                            "<!-- MODAL AGGIUNGI DETTAGLI OSPITI -->"+
                            "<div class='modal fade' id='modalDettOsp"+i+"' tabindex='-1' role='dialog' aria-labelledby='modalDettOsp"+i+"' aria-hidden='true'>"+
                                "<div class='modal-dialog' role='document'>"+
                                    "<div class='modal-content'>"+
                                        "<div class='modal-header'>"+
                                            "<h5 class='modal-title' id='modalDettOsp"+i+"'>Aggiungi dettagli ospiti</h5>"+
                                            "<button type='button' class='close' data-dismiss='modal' aria-label='Close'>"+
                                                "<span aria-hidden='true'>&times;</span>"+
                                            "</button>"+
                                        "</div>"+
                                        "<div class='modal-body' id='modal-body"+i+"'>"+


                                        "</div>"+
                                        "<div class='modal-footer'>"+
                                            "<button onClick='invia("+i+", "+listaPrenotazioni[i].num_ospiti+", "+listaPrenotazioni[i].stato_pagamento+", "+listaPrenotazioni[i].id_prenotazione+", "+listaPrenotazioni[i].id_alloggio_fk+")'type='submit' class='btn btn-success' data-dismiss='modal'>Invia</button>"+
                                        "</div>"+
                                    "</div>"+
                                "</div>"+
                            "</div>"+
                            "<!-- FINE MODAL AGGIUNGI DETTAGLI OSPITI -->"+
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
}

function clickAggiungiDettagli(j, stato_pagamento, id_prenotazione, num_ospiti) {
    var form = document.getElementById("modal-body"+j);
    form.innerHTML = '';

    var res = richiedi("../../controller/comunicazionequestura?action=notificaAggiungiDettagli&id_pren="+id_prenotazione+"&session_id="+sessione_corrente);

    if(res == "ERR") {
        alert("Errore!");
        return false;
    }
    else if(res == "NOSESSION") {
        alert("Devi effettuare il login per accedere alla pagina!");
        return false;
    }
    else {
        var dettagliOspiti = JSON.parse(res);
        for(var i=0; i<num_ospiti; i++) {
            //Pagamento in sospeso, form non compilati.
            if(stato_pagamento == 0) {
                form.innerHTML+=
                "<form id='myForm"+i+""+j+"' action='/upload' enctype='multipart/form-data' method='POST'>"+
                    "<div class='row'>"+
                        "<div class='col-md-6 mb-3'>"+
                            "<label for='nome'><strong>Nome</strong></label>"+
                            "<input type='text' class='form-control' id='nome"+i+""+j+"' placeholder='Inserisci il nome' value='' required>"+
                        "</div>"+
                        "<div class='col-md-6 mb-3'>"+
                            "<label for='cognome'><strong>Cognome</strong></label>"+
                            "<input type='text' class='form-control' id='cognome"+i+""+j+"' placeholder='Inserisci il cognome' value='' required>"+
                            "<br>"+
                        "</div>"+
                    "</div>"+
                    "<div class='row'>"+
                        "<div class='col-md-6 mb-3'>"+
                            "<label for='ddn'><strong>Data di nascita</strong></label>"+
                            "<input type='date' class='form-control' id='ddn"+i+""+j+"' placeholder='Inserisci la data di nascita' value='' required>"+
                        "</div>"+
                        "<div class='col-md-6 mb-3'>"+
                            "<label for='ldn'><strong>Luogo di nascita</strong></label>"+
                            "<input type='text' class='form-control' id='ldn"+i+""+j+"' placeholder='Inserisci il luogo di nascita' value='' required>"+
                            "<br>"+
                        "</div>"+
                    "</div>"+
                    "<div class='row'>"+
                        "<div class='col-md-6 mb-3'>"+
                            "<label for='ldr'><strong>Residenza</strong></label>"+
                            "<input type='text' class='form-control' id='ldr"+i+""+j+"' placeholder='Inserisci il luogo di residenza' value='' required>"+
                        "</div>"+
                        "<div class='col-md-6 mb-3'>"+
                            "<label for='idr'><strong>Indirizzo</strong></label>"+
                            "<input type='text' class='form-control' id='idr"+i+""+j+"' placeholder='Inserisci indirizzo di residenza' value='' required>"+
                            "<br>"+
                        "</div>"+
                    "</div>"+
                    "<div class='row'>"+
                        "<div class='col-md-6 mb-3'>"+
                            "<label for='telefono'><strong>Telefono</strong></label>"+
                            "<input type='tel' class='form-control' id='telefono' placeholder='Inserisci il numero di telefono (XXXXXXXXXX)' value='' pattern='[0-9]{10}' required>"+
                        "</div>"+
                        "<div class='col-md-6 mb-3'>"+
                            "<label for='categoria'>Categoria</label>"+
                            "<select class='custom-select d-block w-100' id='categoria"+i+""+j+"' required>"+
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
                    "<br>";
                if(i==num_ospiti-1) {
                    var forminn = document.getElementById('myForm'+i+""+j);
                    forminn.innerHTML+="<label for='foto'><strong>Allega documenti</strong></label>";
                    forminn.innerHTML+="<input type='file' name='image' class='form-control-file' id='foto"+i+""+j+"'>";
                    forminn.innerHTML+="<input type='submit' value='Allega'>";
                }
                form.innerHTML+="</form>";

                if(i!=num_ospiti-1)
                    form.innerHTML+="<hr>";
            }

            //Pagamento effettuato, recupero dal JSON i dati degli ospiti.
            if(stato_pagamento == 1) {
                form.innerHTML+=
                "<form id='myForm"+i+""+j+"' action='/upload' enctype='multipart/form-data' method='POST'>"+
                    "<div class='row'>"+
                        "<div class='col-md-6 mb-3'>"+
                            "<label for='nome'><strong>Nome</strong></label>"+
                            "<input type='text' class='form-control' id='nome"+i+""+j+"' placeholder='Inserisci il nome' value='"+dettagliOspiti[i].nome+"' required disabled>"+
                        "</div>"+
                        "<div class='col-md-6 mb-3'>"+
                            "<label for='cognome'><strong>Cognome</strong></label>"+
                            "<input type='text' class='form-control' id='cognome"+i+""+j+"' placeholder='Inserisci il cognome' value='"+dettagliOspiti[i].cognome+"' required disabled>"+
                            "<br>"+
                        "</div>"+
                    "</div>"+
                    "<div class='row'>"+
                        "<div class='col-md-6 mb-3'>"+
                            "<label for='ddn'><strong>Data di nascita</strong></label>"+
                            "<input type='date' class='form-control' id='ddn"+i+""+j+"' placeholder='Inserisci la data di nascita' value='"+dettagliOspiti[i].ddn+"' onfocus='(this.type='date')' required disabled>"+
                        "</div>"+
                        "<div class='col-md-6 mb-3'>"+
                            "<label for='ldn'><strong>Luogo di nascita</strong></label>"+
                            "<input type='text' class='form-control' id='ldn"+i+""+j+"' placeholder='Inserisci il luogo di nascita' value='"+dettagliOspiti[i].ldn+"' required disabled>"+
                            "<br>"+
                        "</div>"+
                    "</div>"+
                    "<div class='row'>"+
                        "<div class='col-md-6 mb-3'>"+
                            "<label for='ddn'><strong>Residenza</strong></label>"+
                            "<input type='text' class='form-control' id='ldr"+i+""+j+"' placeholder='Inserisci il luogo di residenza' value='"+dettagliOspiti[i].residenza+"' required disabled>"+
                        "</div>"+
                        "<div class='col-md-6 mb-3'>"+
                            "<label for='ldn'><strong>Indirizzo</strong></label>"+
                            "<input type='text' class='form-control' id='idr"+i+""+j+"' placeholder='Inserisci indirizzo di residenza' value='"+dettagliOspiti[i].indirizzo+"' required disabled>"+
                            "<br>"+
                        "</div>"+
                    "</div>"+
                    "<div class='row'>"+
                        "<div class='col-md-6 mb-3'>"+
                            "<label for='telefono'><strong>Telefono</strong></label>"+
                            "<input type='tel' class='form-control' id='telefono' placeholder='Inserisci il numero di telefono (XXXXXXXXXX)' value='"+dettagliOspiti[i].cellulare+"' pattern='[0-9]{10}' required disabled>"+
                        "</div>"+
                        "<div class='col-md-6 mb-3'>"+
                            "<label for='categoria'>Categoria</label>"+
                            "<select class='custom-select d-block w-100' id='categoria"+i+""+j+"' required disabled>"+
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
                    "<br>";
                if(i==num_ospiti-1) {
                    var forminn = document.getElementById('myForm'+i+""+j);
                    forminn.innerHTML+="<label for='foto'><strong>Allega documenti</strong></label>";
                    forminn.innerHTML+="<input type='file' name='image' class='form-control-file' id='foto"+i+""+j+"'>";
                    forminn.innerHTML+="<input type='submit' value='Allega'>";
                }
                form.innerHTML+="</form>";
                if(i!=num_ospiti-1)
                    form.innerHTML+="<hr>";

                document.getElementById("categoria"+i+""+j).value = dettagliOspiti[i].categoria;
            }

        }
    }
}

function invia(j, num_ospiti, stato_pagamento, id_prenotazione, id_all) {
    //Richiedo l'inserimento, sul DB, degli ospiti, delle tasse corrispondenti alle categorie, 
    //l'aggiornamento dello stato pagamento e dello stato comunicazione questura. Le foto dei documenti
    //e i dati degli ospiti sono inviati per email alla questura.
    if(stato_pagamento == 0) {
        var categorie = [];
        var ospite = new Array();

        for(var i=0; i<num_ospiti; i++) {
            categorie.push(document.getElementById("categoria"+i+""+j).options[document.getElementById("categoria"+i+""+j).selectedIndex].value);
            ospite[i] = new Array();
            ospite[i][0] = document.getElementById("nome"+i+""+j).value;
            ospite[i][1] = document.getElementById("cognome"+i+""+j).value;
            ospite[i][2] = document.getElementById("ddn"+i+""+j).value;
            ospite[i][3] = document.getElementById("ldn"+i+""+j).value;
            ospite[i][4] = document.getElementById("ldr"+i+""+j).value;
            ospite[i][5] = document.getElementById("idr"+i+""+j).value;
        }

        var cat = JSON.stringify(categorie);
        var osp = JSON.stringify(ospite);

        console.log(cat)
        console.log(osp)
        var res = richiedi("../../controller/comunicazionequestura?action=notificaInvia&stato_pagamento="+stato_pagamento+
        "&datiOspiti="+osp+"&categorie="+cat+"&num_ospiti="+num_ospiti+"&id_pren="+id_prenotazione+"&id_all="+id_all+"&session_id="+sessione_corrente);

        if(res == "ERR") {
            alert("Errore!")
            return false;
        }
        else if(res == "NOSESSION") {
            alert("Devi effettuare il login per effettuare le comununicazioni alla questura!");
            return false;
        }
        else {
            alert("Dati aggiornati con successo e comunicazione alla questura effettuata!")
            aggiorna();
        }
        
        return true;
    }

    //Richiedo l'aggiornamento, sul DB, dello stato comunicazione questura.
    //Le foto dei documenti e i dati degli ospiti (questi ultimi già presenti sul DB) sono inviati per email alla questura.
    else if(stato_pagamento == 1) {
        var res = richiedi("../../controller/comunicazionequestura?action=notificaInvia&stato_pagamento="+stato_pagamento+
        "&id_pren="+id_prenotazione+"&session_id="+sessione_corrente);

        if(res == "ERR") {
            alert("Errore!")
            return false;
        }
        else if(res == "NOSESSION") {
            alert("Devi effettuare il login per effettuare le comunicazioni alla questura!");
            return false;
        }
        else {
            alert("Dati aggiornati con successo e comunicazione alla questura effettuata!")
            aggiorna();
        }
        
        return true;
    }
}

function aggiorna() {
    window.open("../view/ComunicazioneQuestura.html", "_self", false);
}