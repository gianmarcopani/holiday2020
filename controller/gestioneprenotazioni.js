const DBMSboundary = require('./DBMSboundary');
const email = require('./email');

const dbmsboundary = new DBMSboundary();

var main = function(risposta, richiesta, cb) {
    var dati = richiesta.query;
    var action = dati["action"];
    var session_id = dati["session_id"];
    var id_pren = dati["id_pren"];

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
            //funzionalità a disposizione dell'affittuario e del locatore
            if(result[0].tipo == 1 || result[0].tipo == 2) {
                if(action == "notificaGestionePrenotazioni") {
                    dbmsboundary.cercaPrenotazioniCliente(result[0].email, function(err, result) {
                        if(err) {
                            cb("ERR");
                        }
                        if(result) {
                            cb(result);
                        }
                    });
                }

                if(action == "notificaEliminaPrenotazione") {
                    dbmsboundary.cercaPrenotazione(id_pren, function(err, result) {
                        if(err) 
                            cb("ERR");
                        if(result) {
                            var oggettoAff = "La tua prenotazione è stata eliminata - Holiday";
                            var oggettoLoc = "Una prenotazione presso un tuo alloggio è stata eliminata - Holiday";
                            var corpoAff="La tua prenotazione su Holiday con i seguenti dati è stata eliminata:"
                            corpoAff+="<ul>"+
                                    "<li><strong>Importo €:"+result[0].importo+"</strong></li>"+
                                    "<li><strong>Check-in: "+JSON.stringify(result[0].checkin).substring(1,11)+"</strong></li>"+
                                    "<li><strong>Check-out: "+JSON.stringify(result[0].checkout).substring(1,11)+"</strong></li>"+
                                    "<li><strong>Numero di ospiti: "+result[0].num_ospiti+"</strong></li>"+
                                "</ul>"+
                                "<p>&nbsp;</p>";
                            var corpoLoc="Una prenotazione presso un tuo alloggio su Holiday con i seguenti dati è stata eliminata:"
                            corpoLoc+="<ul>"+
                                    "<li><strong>Importo €:"+result[0].importo+"</strong></li>"+
                                    "<li><strong>Check-in: "+JSON.stringify(result[0].checkin).substring(1,11)+"</strong></li>"+
                                    "<li><strong>Check-out: "+JSON.stringify(result[0].checkout).substring(1,11)+"</strong></li>"+
                                    "<li><strong>Numero di ospiti: "+result[0].num_ospiti+"</strong></li>"+
                                "</ul>"+
                                "<p>&nbsp;</p>";                            
                            email.inviaEmailAffittuario(result[0].email_fk, oggettoAff, corpoAff);
                            email.inviaEmailLocatore(result[0].email_locatore_fk, oggettoLoc, corpoLoc);

                            dbmsboundary.eliminaPrenotazione(result[0].email_fk, id_pren, function(err, result) {
                                if(result) {
                                    cb("OK");
                                }
                                else {
                                    cb("ERR");
                                }
                            });
                        }
                    });
                }
            }

            //funzionalità a disposizione dell'admin
            else if(result[0].tipo == 0) {
              
                if(action == "notificaGestionePrenotazioni") {
                    dbmsboundary.cercaPrenotazioni(function(err, result) {
                        if(err)
                            cb("ERR");
                        if(result)
                            cb(result);
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