const DBMSboundary = require('./DBMSboundary');

const dbmsboundary = new DBMSboundary();

var main = function(risposta, richiesta, cb) {
    var dati = richiesta.query;
    var action = dati["action"];
    var session_id = dati["session_id"];
    var prenotazioni = dati["prenotazioni"];

	dbmsboundary.cercaSessione(session_id, function (err, result) {
		if(result.length > 0 && result[0].tipo == 2) { //LOCATORE LOGGATO
			if(action == "notificaRendicontazione") {
                checkDataCorrente(function(state) {
                    if(state == "AVAILABLE") {
                        dbmsboundary.rendiconta(result[0].email, function(err, result) {
                            if(err)
                                cb("ERR");
                            if(result)
                                cb(result);
                        });
                    }
                    else
                        cb("NOTAVAILABLE");
                });
            }

            if(action == "notificaInviaRendiconto") {
                dbmsboundary.aggiornaStatoUfficioTurismo(JSON.parse(prenotazioni), function(err, result) {
                    if(result != "ERR")
                        cb("OK");
                        //invio email ufficio turismo
                    else
                        cb("ERR");
                });
            }
        }

		else if(result.length == 0)
			cb("NOSESSION"); //NON LOGGATO
		else
			cb("ERR"); //ERRORE DI SISTEMA O UTENTE NON AUTORIZZATO
	});
}

function checkDataCorrente(cb) {
    var d = new Date();
    var m = new Date();
    var day = d.getDate();
    var month = m.getMonth();

    if((month % 3 == 0)&&(day >= 1 && day <= 7)) {
        cb("AVAILABLE");
    }
    else {
        cb("NOTAVAILABLE");
    }
}

module.exports = {
    main:main
};