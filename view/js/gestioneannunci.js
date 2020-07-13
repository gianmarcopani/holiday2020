var sessione_corrente = localStorage.getItem("BOOKSESSION_ID");
var CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dcuyf7n3n/image/upload';
var CLOUDINARY_UPLOAD_PRESET = 't9fcoln5';
var fileUpload = document.getElementById("file-upload");
var files;
var imageURLS = []; //da passare al db

window.onload = function() {
    mostra();
}

fileUpload.addEventListener('change', function(event) {
    files = Array.from(this.files);
    console.log(files);

    var formData1 = new FormData();
    formData1.append('file', files[0]);
    formData1.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    var formData2 = new FormData();
    formData2.append('file', files[1]);
    formData2.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    axios.all([
        axios({
            url: CLOUDINARY_URL,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formData1
        }),
        axios({
            url: CLOUDINARY_URL,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formData2
        })
    ])
    .then(responseArr => {
        //this will be executed only when all requests are complete
        console.log('Date created: ', responseArr[0].data.secure_url);
        imageURLS[0] = ""+responseArr[0].data.secure_url+"";
        console.log('Date created: ', responseArr[1].data.secure_url);
        imageURLS[1] = ""+responseArr[1].data.secure_url+"";
        localStorage.setItem("photo", JSON.stringify(imageURLS));
    });
});

function mostra() {
    var tipo = richiedi("../../controller/gestioneannunci?action=getTipoAccount&session_id="+sessione_corrente);

    //LOCATORE
    if(tipo == "2") {
        var res = richiedi("../../controller/gestioneannunci?action=showannunci&session_id="+sessione_corrente);

        if(res == "ERR") {
            alert("Errore!");
            return false;
        }
        else if(res == "NOSESSION") {
            alert("Devi effettuare il login per accedere alla pagina!")
            return false;
        }

        else {
            var listaAnnunci = JSON.parse(res);

                var container = document.getElementById("accordion");
                for(var i=0; i<listaAnnunci.length; i++) {
                    container.innerHTML+=
                        "<div class='carta card'>"+
                            "<div class='card-header bg-success' id='heading"+i+"'>"+
                                "<h5 class='mb-0'>"+
                                    "<button class='btn btn-link btn-outline-success' data-toggle='collapse' data-target='#collapse"+i+"' aria-expanded='true' aria-controls='collapseUno"+i+"'>"+
                                        "Annuncio #"+i+""+
                                    "</button>"+
                                "</h5>"+
                            "</div>"+

                            "<div id='collapse"+i+"' class='collapse' aria-labelledby='heading"+i+"' data-parent='#accordion'>"+
                                "<div class='card-body'>"+
                                    ""+listaAnnunci[i].descrizione+""+

                                    "<br>"+


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
                                                    "Cliccando Conferma cancellerai l'annuncio selezionato"+
                                                "</div>"+
                                                "<div class='modal-footer'>"+
                                                    "<button type='button' class='btn btn-success' data-dismiss='modal' onClick='clickConfermaCancella("+listaAnnunci[i].id_annuncio+")'>Conferma</button>"+
                                                "</div>"+
                                            "</div>"+
                                        "</div>"+
                                    "</div>"+



                                    "<button type='button' class='btn btn-dark float-right mr-1' data-toggle='modal' data-target='#modalModifica"+i+"'>"+
                                        "Modifica"+
                                    "</button>"+
                                    "<div class='modal fade' id='modalModifica"+i+"' tabindex='-1' role='dialog' aria-labelledby='modalModifica"+i+"' aria-hidden='true'>"+
                                        "<div class='modal-dialog' role='document'>"+
                                            "<div class='modal-content'>"+
                                                "<div class='modal-header'>"+
                                                    "<h5 class='modal-title' id='modalModifica"+i+"'>Modifica annuncio</h5>"+
                                                    "<button type='button' class='close' data-dismiss='modal' aria-label='Close'>"+
                                                        "<span aria-hidden='true'>&times;</span>"+
                                                    "</button>"+
                                                "</div>"+
                                                "<div class='modal-body'>"+
                                                    "<form>"+
                                                        "<label for='titolo'><strong>Titolo</strong></label>"+
                                                        "<input type='text' class='form-control' id='titolo"+i+"' placeholder='Inserisci titolo' value='"+listaAnnunci[i].titolo+"' required>"+
                                                        "<br>"+
                                                        "<label for='disponibileDa'><strong>Disponibile da</strong></label>"+
                                                        "<input type='date' class='form-control' id='disponibileDa"+i+"' placeholder='Inserisci data inizio disponibilità' value='"+JSON.stringify(listaAnnunci[i].validita_start).substring(1,11)+"' onfocus='(this.type='date')' required>"+
                                                        "<br>"+
                                                        "<label for='disponibileFinoA'><strong>Disponibile fino a</strong></label>"+
                                                        "<input type='date' class='form-control' id='disponibileFinoA"+i+"' placeholder='Inserisci data fine disponibilità' value='"+JSON.stringify(listaAnnunci[i].validita_stop).substring(1,11)+"' onfocus='(this.type='date')' required>"+
                                                        "<br>"+
                                                        "<label for='prezzo'><strong>Prezzo alloggio €/notte</strong></label>"+
                                                        "<input type='text' class='form-control' id='prezzo"+i+"' placeholder='Prezzo alloggio €/notte' value='"+listaAnnunci[i].prezzo+"' required>"+
                                                        "<br>"+          
                                                        "<label for='tassa'><strong>Tassa soggiorno €</strong></label>"+
                                                        "<input type='text' class='form-control' id='tassa"+i+"' placeholder='Prezzo alloggio €/notte' value='"+listaAnnunci[i].tassa+"' required>"+
                                                        "<br>"+                                          
                                                        "<label for='descrizione'><strong>Descrizione</strong></label>"+
                                                        "<textarea class='form-control' id='descrizione"+i+"' placeholder='Inserisci descrizione annuncio' rows='3' required>"+listaAnnunci[i].descrizione+"</textarea>"+
                                                        "<br>"+
                                                        "<label for='foto'><strong>Foto</strong></label>"+
                                                        "<input type='file' class='form-control-file' id='foto"+i+"'>"+
                                                    "</form>"+
                                                "</div>"+
                                                "<div class='modal-footer'>"+
                                                    "<button type='submit' class='btn btn-success' data-dismiss='modal' onClick='clickConfermaModifica("+listaAnnunci[i].id_annuncio+", "+listaAnnunci[i].id_alloggio+" ,"+i+")'>Conferma</button>";
                                                "</div>"+
                                            "</div>"+
                                        "</div>"+
                                    "</div>"+


                                "</div>"+
                            "</div>"+
                        "</div>";
                }

        }
    }

    //ADMIN
    else if(tipo == "0") {
        var x = document.getElementById("insert");
        x.style.display = "none";

        var res = richiedi("../../controller/gestioneannunci?action=showannunciloc&session_id="+sessione_corrente);

        var listaAnnunci = JSON.parse(res);

        var container = document.getElementById("accordion");
        for(var i=0; i<listaAnnunci.length; i++) {
            container.innerHTML+=
                "<div class='carta card'>"+
                    "<div class='card-header bg-success' id='heading"+i+"'>"+
                        "<h5 class='mb-0'>"+
                            "<button class='btn btn-link btn-outline-success' data-toggle='collapse' data-target='#collapse"+i+"' aria-expanded='true' aria-controls='collapseUno"+i+"'>"+
                                "Annuncio #"+i+""+
                            "</button>"+
                        "</h5>"+
                    "</div>"+

                    "<div id='collapse"+i+"' class='collapse' aria-labelledby='heading"+i+"' data-parent='#accordion'>"+
                        "<div class='card-body'>"+
                            "'"+listaAnnunci[i].descrizione+"'"+
                            "<br><a href=''><strong>Visualizza dettagli annuncio</strong></a>"+
                            "<br>"+


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
                                            "Cliccando Conferma cancellerai l'annuncio selezionato"+
                                        "</div>"+
                                        "<div class='modal-footer'>"+
                                            "<button type='button' class='btn btn-success' data-dismiss='modal' onClick='clickConfermaCancellaAdmin("+listaAnnunci[i].id_annuncio+")'>Conferma</button>"+
                                        "</div>"+
                                    "</div>"+
                                "</div>"+
                            "</div>"+

                        "</div>"+
                    "</div>"+
                "</div>";
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

function clickConfermaInserisci() {
    var photo = localStorage.getItem("photo");

    var datiAnnuncio = [document.getElementById("titolo").value, document.getElementById("disponibileDa").value, document.getElementById("disponibileFinoA").value,
                        document.getElementById("prezzo").value, document.getElementById("descrizione").value];
    var datiAlloggio = [document.getElementById("posizione").value, document.getElementById("tassa").value,
                        document.getElementById("num_camere_max").value, document.getElementById('num_ospiti_max').value,
                        document.getElementById("bagni").value, document.getElementById('lettiSingoli').value,
                        document.getElementById("lettiMatrimoniali").value, document.getElementById('colazione').checked, 
                        document.getElementById('parcheggio').checked, document.getElementById('piscina').checked];

    datAnn = JSON.stringify(datiAnnuncio);
    datAll = JSON.stringify(datiAlloggio);

    var res = richiedi("../../controller/gestioneannunci?action=notificaInserisciAnnuncio&datiAnnuncio="+datAnn+"&datiAlloggio="+datAll+"&imm="+photo+"&session_id="+sessione_corrente);

    if(res == "ERR") {
        alert("Errore!");
        return false;
    }
    else if(res == "NOSESSION") {
        alert("Devi effettuare il login per accedere alla pagina!")
        return false;
    }

    //aggiorna
    else {
        localStorage.removeItem("photo");
        window.open("../view/GestioneAnnunci.html", "_self", true);  
    }
}

function clickConfermaModifica(id_ann, id_all, i) {
        /*"<button type='submit' class='btn btn-success' data-dismiss='modal' onClick='clickConfermaModifica("+listaAnnunci[i].id_annuncio+", "+listaAnnunci[i].id_alloggio+" ,"+document.getElementById("titolo"+i).value+", "+document.getElementById("disponibileDa"+i).value+
    ", "+document.getElementById("disponibileFinoA"+i).value+", "+document.getElementById("prezzo"+i).value+", "+document.getElementById("tassa"+i).value+", "+document.getElementById("descrizione"+i).value+")'>Conferma</button>";*/
    //manca inserimento foto
    var datiAnnuncio = [document.getElementById("titolo"+i).value, document.getElementById("disponibileDa"+i).value, document.getElementById("disponibileFinoA"+i).value,
                        document.getElementById("prezzo"+i).value, document.getElementById("descrizione"+i).value];
    var datiAlloggio = [document.getElementById("tassa"+i).value];

    datAnn = JSON.stringify(datiAnnuncio);
    datAll = JSON.stringify(datiAlloggio);

    var res = richiedi("../../controller/gestioneannunci?action=notificaAggiornaDati&id_ann="+id_ann+"&id_all="+id_all+"&datiAnnuncio="+datAnn+"&datiAlloggio="+datAll+"&session_id="+sessione_corrente);

    if(res == "ERR") {
        alert("Errore!");
        return false;
    }
    else if(res == "NOSESSION") {
        alert("Devi effettuare il login per accedere alla pagina!")
        return false;
    }

    //aggiorna
    else {
        window.open("../view/GestioneAnnunci.html", "_self", true);  
    }
}

function clickConfermaCancella(id_ann) {
    var res = richiedi("../../controller/gestioneannunci?action=notificaEliminaAnnuncio&id_ann="+id_ann+"&session_id="+sessione_corrente);

    if(res == "ERR") {
        alert("Errore!");
        return false;
    }
    else if(res == "NOSESSION") {
        alert("Devi effettuare il login per accedere alla pagina!")
        return false;
    }

    //aggiorna
    else {
        window.open("../view/GestioneAnnunci.html", "_self", true);
    }
}

function clickConfermaCancellaAdmin(id_ann) {
    var res = richiedi("../../controller/gestioneannunci?action=notificaEliminaAnnuncioLocatore&id_ann="+id_ann+"&session_id="+sessione_corrente);

    if(res == "ERR") {
        alert("Errore!");
        return false;
    }
    else if(res == "NOSESSION") {
        alert("Devi effettuare il login per accedere alla pagina!")
        return false;
    }

    //aggiorna
    else {
        window.open("../view/GestioneAnnunci.html", "_self", true);
    }
}