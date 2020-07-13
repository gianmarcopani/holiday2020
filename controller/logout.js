/*
Lo script si occupa di deautenticare un utente loggato.
In caso di deautenticazione riuscita, il campo session_id della tabella ACCOUNT,
relativo all'utente loggato, viene posto a NULL.
*/

const DBMSboundary = require('./DBMSboundary');

const dbmsboundary = new DBMSboundary();

var main = function (risposta, richiesta, cb) {
	var dati = richiesta.query;
	var action = dati["action"];
	var session_id = dati["session_id"];


	if (action == "notificaLogout") {
		dbmsboundary.cercaSessione(session_id, function (err, result) {
			if (result.length > 0) {
				dbmsboundary.rimuoviSessionId(session_id, function (err, result) {
					if (result) {
						cb("SLOGGED");
					}
					else
						cb("ERR");
				});
			}
			else
				cb("NOSESSION");
		});
	}
}

module.exports = {
    main: main
};
