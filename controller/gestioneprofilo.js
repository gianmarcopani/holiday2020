const DBMSboundary = require('./DBMSboundary');

const dbmsboundary = new DBMSboundary();

var main = function(risposta, richiesta, cb) {
    var dati = richiesta.query;
    var action = dati["action"];
    var session_id = dati["session_id"];
    var email = dati["email"];
    var password = dati["password"];
    var telefono = dati["telefono"];
    var residenza = dati["residenza"];
    var indirizzo = dati["indirizzo"];
 

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
            if(result[0].tipo == 1 || result[0].tipo == 2) {
                if(action == "searchaccount") {
                    cb(result);
                }

                if(action == "notificaAggiornaDati") {
                    dbmsboundary.aggiornaDatiProfilo(result[0].email, password, telefono, residenza, indirizzo, function(err, result) {
                        if(result != "ERR") {
                            console.log(err);
                            cb("OK");
                        }
                        else {
                            cb("ERR");
                        }
                    });	
                }

                //inserire cb di errore anche qui
            }

            //funzionalità a disposizione dell'admin
            else if(result[0].tipo == 0) {
                if(action == "searchusers") {
                    dbmsboundary.cercaUtenti(result[0].email, function(err, result) {
                        if(err) {
                            cb("ERR");
                        }
                        if(result) {
                            cb(result);
                        }
                    });
                }
                
                if(action == "notificaCancellaUtente") {
                    dbmsboundary.cancellaAccountAnnunciPrenotazioni(email, function(err, result) {
                        if(result)
                            cb("OK");
                        else
                            cb("ERR");
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