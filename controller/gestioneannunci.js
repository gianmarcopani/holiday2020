const DBMSboundary = require('./DBMSboundary');

const dbmsboundary = new DBMSboundary();

var main = function(risposta, richiesta, cb) {
    var dati = richiesta.query;
    var action = dati["action"];
    var session_id = dati["session_id"];
    var id_ann = dati["id_ann"];
    var id_all = dati["id_all"];
    var dati_ann = dati["datiAnnuncio"];
    var dati_all = dati["datiAlloggio"];
    var urlphotos = dati["imm"];

    //AL POSTO DI 1 C'E' session_id
    //tipo in account: 0 admin, 1 affittuario, 2 locatore.
    if(action == "getTipoAccount") {
        dbmsboundary.cercaSessione(session_id, function (err, result) {
            if(result.length > 0) {
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
                if(action == "showannunci") {
                    dbmsboundary.cercaAnnunci(result[0].email, function(err, result) {
                        if(err) {
                            cb("ERR");
                        }
                        if(result) {
                            cb(result);
                        }
                    });
                }

                if(action == "notificaInserisciAnnuncio") {
                    dbmsboundary.inserisciAnnuncioeAlloggio(result[0].email, JSON.parse(dati_ann), JSON.parse(dati_all), function(err, result) {
                        if(result != "ERR") {
                            dbmsboundary.idprenmax(function(err, result) {        
                                if(err)
                                    cb("ERR");
                                if(result) {
                                    dbmsboundary.inserisciFoto(JSON.parse(urlphotos), result[0].id_annuncio, function(err, result) {
                                        if(result != "ERR")
                                            cb("OK");
                                        else    
                                            cb("ERR");
                                    });
                                }
                            });
                        }
                        else {
                            cb("ERR");
                        }
                    });
                }

                if(action == "notificaAggiornaDati") {
                    dbmsboundary.aggiornaDatiAnnuncioeAlloggio(result[0].email, id_ann, id_all, JSON.parse(dati_ann), JSON.parse(dati_all), function(err, result) {
                        if(result != "ERR") {
                            cb("OK");
                        }
                        else {
                            cb("ERR");
                        }
                    });	
                }

                if(action == "notificaEliminaAnnuncio") {
                    dbmsboundary.eliminaAnnuncio(result[0].email, id_ann, function(err, result) {
                        if(err)
                            cb("ERR");
                        if(result)
                            cb("OK");
                    });
                }

                //inserire cb di errore anche qui
            }

            //funzionalità a disposizione dell'admin
            else if(result[0].tipo == 0) {
                if(action == "showannunciloc") {
                    dbmsboundary.cercaAnnunciLocatori(function(err, result) {
                        if(err) {
                            cb("ERR");
                        }
                        if(result) {
                            cb(result);
                        }
                    });
                }
                
                if(action == "notificaEliminaAnnuncioLocatore") {
                    dbmsboundary.eliminaAnnuncioLocatore(id_ann, function(err, result) {
                        if(err)
                            cb("ERR");
                        if(result)
                            cb("OK");
                    });
                }
            }
        }

        else if(result.length == 0)
            cb("NOSESSION"); //NON LOGGATO
        else
            cb("ERR");
    });
    }
}

module.exports = {
    main:main
};