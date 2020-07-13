/*
Lo script si occupa di verificare e autenticare un visitatore che effettua il login.
In caso di autenticazione riuscita, il campo session_id della tabella ACCOUNT viene
memorizzato sotto forma di hash MD5 univoco per ogni utente. L'univocità è garantita
dal fatto che l'hashing è basato su email, password e data corrente.
*/
const DBMSboundary = require('./DBMSboundary');
const md5 = require('../node_modules/js-md5');

const dbmsboundary = new DBMSboundary();

var main = function (risposta, richiesta, cb) {
	var dati = richiesta.query;
	var action = dati["action"];
	var session_id = dati["session_id"];
	var email = dati["email"];
	var password = dati["password"];

	if (action == "check") {
		dbmsboundary.cercaSessione(session_id, function (err, result) {
			if (result.length > 0)
				cb(result); //devo fare la query di login per questioni di sicurezza????
			else
				cb("NOSESSION");
		});
	}

	if (action == "notificaConferma") {
		var psw=md5(password);
		dbmsboundary.cercaUtente(email, psw, function (err, result) {
			if (err) {
				cb("ERR");
			}
			if (result) {
				if (result.length > 0) {
					//cb(result);
					session_id = creaSessionId(email, psw);
					dbmsboundary.inserisciSessionId(email, psw, session_id, function (err, result) {
						if (err) {
							console.log("ENTRO")
							cb("ERR");
						}
						else {
							cb(session_id);
						}
					});
				}
				else
					cb("NOTAUTH"); //non esiste un utente con i dati inseriti in fase di login.
			}
		});
	}
}

function creaSessionId(email, password) {
	var users = { email, password };
	var data = new Date();
	var dd = String(data.getDate()).padStart(2, '0');
	var mm = String(data.getMonth() + 1).padStart(2, '0');
	var yyyy = data.getFullYear();
	data = yyyy + '-' + mm + '-' + dd;
	var session_id = md5(users.email + " " + users.password + " " + data); // HASHING BASATO SU EMAIL, PWD CRIPTATA E DATA CORRENTE 
																																				//session_id cambia ogni giorno per un utente quindi;
	return session_id;
}

module.exports = {
	main: main
};
