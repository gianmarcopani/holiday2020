const DBMSboundary = require('./DBMSboundary');
const email = require('./email');

const dbmsboundary = new DBMSboundary();

var main = function(risposta, richiesta, cb) {
    var dati = richiesta.query;
    var action = dati["action"];
    var session_id = dati["session_id"];
    var id_pren = dati["id_pren"];
    var stato_pagamento = dati["stato_pagamento"];
    var datiOspiti = dati["datiOspiti"];
    var categorie = dati["categorie"];
    var num_ospiti = dati["num_ospiti"];
    var id_alloggio = dati["id_all"];
    var emailloc;

    //tipo in account: 0 admin, 1 affittuario, 2 locatore.
    //stato pagamento: 0 in sospeso, 1 effettuato.
    if(action == "getTipoAccount") {
        dbmsboundary.cercaSessione(session_id, function (err, result) {
            if(result.length > 0) {
                emailloc = result[0].email;
                cb((result[0].tipo).toString());
            }
            else if(result.length == 0)
                cb("NOSESSION"); //NON LOGGATO
            else
                cb("ERR");
        })
    }

    else {
    dbmsboundary.cercaSessione(session_id, function (err, result) {
        if(result.length > 0) { //LOGGATO
            //funzionalità a disposizione del locatore
            if(result[0].tipo == 2) {
                emailloc = result[0].email;
                if(action == "notificaComunicazioneQuestura") {
                    dbmsboundary.cercaPrenotazioniAccettate(result[0].email, function(err, result) {
                        if(err) {
                            cb("ERR");
                        }
                        if(result) {
                            cb(result);
                        }
                    });
                }

                if(action == "notificaAggiungiDettagli") {
                    dbmsboundary.cercaDatiPrenotazione(result[0].email, id_pren, function(err, result) {
                        if(err) {
                            cb("ERR");
                        }
                        if(result) {
                            cb(result);
                        }
                    });

                }

                if(action == "notificaInvia") {
                    if(stato_pagamento == 0) {
                        calcolaTasse(JSON.parse(categorie), id_alloggio, function(resultCat) {
                            if(resultCat != "ERR") {
                                dbmsboundary.inserisciDatiOspiteEaggiornaStatoComunicazioneQuestura(id_pren, JSON.parse(datiOspiti), JSON.parse(categorie), num_ospiti, resultCat , function(err, result) {
                                    if(result != "ERR") {
                                        var oggetto = "Comunicazione degli ospiti";
                                        var corpo = 
                                        "<p>Ecco i dati degli ospiti presenti nel mio alloggio:</p>";
                                        for(var i=0; i<JSON.parse(datiOspiti).length; i++) {
                                            corpo+="<ul>"+
                                                "<li><strong>Nome: "+JSON.parse(datiOspiti)[i][0]+"</strong></li>"+
                                                "<li><strong>Cognome: "+JSON.parse(datiOspiti)[i][1]+"</strong></li>"+
                                                "<li><strong>Data di nascita: "+JSON.parse(datiOspiti)[i][2]+"</strong></li>"+
                                                "<li><strong>Luogo di nascita: "+JSON.parse(datiOspiti)[i][3]+"</strong></li>"+
                                                "<li><strong>Residenza: "+JSON.parse(datiOspiti)[i][4]+"</strong></li>"+
                                                "<li><strong>Indirizzo "+JSON.parse(datiOspiti)[i][5]+"</strong></li>"+
                                            "</ul>"+
                                            "<p>&nbsp;</p>";
                                        }

                                        email.inviaEmailQuestura("progwebemobile@gmail.com", oggetto, corpo);
                                        cb("OK");
                                    }
                                    else {
                                        cb("ERR");
                                    }
                                });	
                            }
                            else cb("ERR");
                        })
                    }
                    else if(stato_pagamento == 1) {
                        dbmsboundary.aggiornaStatoComunicazioneQuestura(id_pren, function(err, result) {
                            if(err) {
                                cb("ERR");
                            }
                            if(result) {
                                dbmsboundary.cercaDatiPrenotazione(emailloc, id_pren, function(err, result) {
                                    if(err) 
                                        cb("ERR");
                                    if(result) {
                                        var oggetto = "Comunicazione degli ospiti";
                                        var corpo = 
                                        "<p>Ecco i dati degli ospiti presenti nel mio alloggio:</p>";
                                        for(var i=0; i<result.length; i++) {
                                            corpo+="<ul>"+
                                                "<li><strong>Nome: "+result[i].nome+"</strong></li>"+
                                                "<li><strong>Cognome: "+result[i].cognome+"</strong></li>"+
                                                "<li><strong>Data di nascita: "+result[i].ddn+"</strong></li>"+
                                                "<li><strong>Luogo di nascita: "+result[i].ldn+"</strong></li>"+
                                                "<li><strong>Residenza: "+result[i].residenza+"</strong></li>"+
                                                "<li><strong>Indirizzo "+result[i].indirizzo+"</strong></li>"+
                                            "</ul>"+
                                            "<p>&nbsp;</p>";
                                        }

                                        email.inviaEmailQuestura("progwebemobile@gmail.com", oggetto, corpo);
                                        cb("OK");
                                    }
                                });
                            }
                        });	
                    }
                }

                //inserire cb di errore anche qui
            }
        }

        else if(result.length == 0) {
            cb("NOSESSION"); //NON LOGGATO
        }
        else
            cb("ERR");
    });
    }
}

function calcolaTasse(categorie, id_alloggio, cb) {
    var tasse = [];

	dbmsboundary.cercaAlloggio(id_alloggio, function(err, result) {
		if(err) {
			cb("ERR");
		}
		if(result) {
			var tassa = result[0].tassa;
			for(var i=0; i<categorie.length; i++) {
				if(categorie[i] == "impiegato" || categorie[i] == "disoccupato" || categorie[i] == "studente") {
					tasse[i] = tassa;
				}
				else {
					tasse[i] = 0;
				}
			}
			cb(tasse);
		}
	});	
	
}

module.exports = {
    main:main
};