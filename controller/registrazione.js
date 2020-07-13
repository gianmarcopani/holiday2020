const DBMSboundary = require('./DBMSboundary');
const md5 = require('../node_modules/js-md5');

const dbmsboundary = new DBMSboundary();

var main = function (risposta, richiesta, cb) {
	var dati = richiesta.query;
    var action = dati["action"];
    var nome = dati["nome"];
    var cognome = dati["cognome"];
    var email = dati["email"];
    var password = dati["password"];
    var telefono = dati["telefono"];
    var ddn = dati["ddn"];
    var ldn = dati["ldn"];
    var ldr = dati["ldr"];
    var idr = dati["idr"];
    var tipo = dati["tipo"];

	if (action == "notificaConferma") {
        console.log("ENTRO")
        if(tipo == "Affittuario") {
            tipo = 1;
        }
        else if(tipo == "Locatore") {
            tipo = 2;
        }
        else
            cb("ERR");

        var psw = md5(dati["password"]);
		dbmsboundary.registraUtente(nome, cognome, email, psw, telefono, ddn, ldn, ldr, idr, tipo, function (err, result) {
            if (result) {
                cb("REG");
            }
			else
				cb("ERR");
		});
	}
}

module.exports = {
	main: main
};
