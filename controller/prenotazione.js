const DBMSboundary = require('./DBMSboundary');
const email = require('./email');

const dbmsboundary = new DBMSboundary();

var main = function (risposta, richiesta, cb) {
	var dati = richiesta.query;
	var action = dati["action"];
	var localita = dati["localita"];
	var checkin = dati["checkin"];
	var checkout = dati["checkout"];
	var ospiti = dati["ospiti"];
	var camere = dati["camere"];
	var id_ann = dati["id_ann"];
	var session_id = dati["session_id"];
	var id_alloggio = dati["id_all"];
	var categorie = dati["categorie"];
	var datiOspiti = dati["datiOspiti"];
	var prezzo = dati["prezzo"];
	var emailAff;
	var emailLoc = dati["emailLoc"];

	//AL POSTO DI 1 C'E' session_id
	dbmsboundary.cercaSessione(session_id, function (err, result) {
		if(result.length > 0) { //LOGGATO
			if(action == "notificaPrenota") {
				dbmsboundary.numeroGiorniSoggiorno(id_alloggio, session_id, function(err, result) {
					if(err) {
						cb("ERR");
					}
					if(result) {
						console.log(result);
						var giorniCheck = checkTotaleGiorni(result, checkin, checkout);
						cb(giorniCheck);
					}
				});
			}

			if(action == "notificaPagamentoInLoco") {
				emailAff = result[0].email;
				dbmsboundary.inserisciRichiestaPrenotazioneLoco(checkin, checkout, result, id_alloggio, ospiti, prezzo, function(err, result) {
					if(err || result == "ERR") {
						cb("ERR");
					}
					if(result) {
						var inizio = new Date(checkin);
						var fine = new Date(checkout);
						var importoTotale = (prezzo*ospiti)*(parseInt((fine - inizio) / (24 * 3600 * 1000)));
						var oggettoAff = "La tua prenotazione - Holiday";
						var oggettoLoc = "Nuova prenotazione - Holiday"
						var corpoAff =
						"<p>Ecco i dati della nuova prenotazione:</p>"+
						"<ul>"+
							"<li><strong>Check-in: "+checkin+"</strong></li>"+
							"<li><strong>Check-out: "+checkout+"</strong></li>"+
							"<li><strong>Numero ospiti: "+ospiti+"</strong></li>"+
							"<li><strong>La somma che hai pagato: € "+importoTotale+"</strong></li>"+
						"</ul>"+
						"<p>&nbsp;</p>"+
						"<p><span style='color: #ff0000;'><strong>Accedi al panello Gestione Prenotazioni per monitorare la tua prenotazione.</strong></span></p>"+
						"<p><span style='color: #ff0000;'><strong>Sarai comunque aggiornato via email!</strong></span></p>";
						var corpoLoc =
							"<p>Ecco i dati della nuova prenotazione:</p>"+
							"<ul>"+
								"<li><strong>Check-in: "+checkin+"</strong></li>"+
								"<li><strong>Check-out: "+checkout+"</strong></li>"+
								"<li><strong>Numero ospiti: "+ospiti+"</strong></li>"+
								"<li><strong>Guadagno potenziale: € "+importoTotale+"</strong></li>"+
							"</ul>"+
							"<p>&nbsp;</p>"+
							"<p><span style='color: #ff0000;'><strong>Accedi al panello Gestione Alloggi per gestire la prenotazione.</strong></span></p>";

						email.inviaEmailAffittuario(emailAff, oggettoAff, corpoAff);
						email.inviaEmailLocatore(emailLoc, oggettoLoc, corpoLoc);
						cb("OK");
					}
				});				
			}

			if(action == "notificaPagamentoConCarta") {
				cb(result); //torno i dati dell'utente per il form di pagamento.
			}

			if(action == "notificaInserimentoDatiOspite") {
				calcolaTasse(JSON.parse(categorie), id_alloggio, cb);
			}
			
			if(action == "notificaEffettuaPagamento") {
				emailAff = result[0].email;
				calcolaTasse(JSON.parse(categorie), id_alloggio, function(resultCat) {
					if(resultCat != "ERR") {
						dbmsboundary.inserisciRichiestaPrenotazioneEdatiOspite(JSON.parse(datiOspiti), JSON.parse(categorie), result, checkin, checkout, id_alloggio, ospiti, prezzo, resultCat , function(err, result) {
							if(result != "ERR") {
								var inizio = new Date(checkin);
								var fine = new Date(checkout);
								var importoTotale = (prezzo*ospiti)*(parseInt((fine - inizio) / (24 * 3600 * 1000)));
								var oggettoAff = "La tua prenotazione - Holiday";
								var oggettoLoc = "Nuova prenotazione - Holiday"
								var corpoAff =
								"<p>Ecco i dati della nuova prenotazione:</p>"+
								"<ul>"+
									"<li><strong>Check-in: "+checkin+"</strong></li>"+
									"<li><strong>Check-out: "+checkout+"</strong></li>"+
									"<li><strong>Numero ospiti: "+ospiti+"</strong></li>"+
									"<li><strong>La somma che hai pagato: € "+importoTotale+"</strong></li>"+
								"</ul>"+
								"<p>&nbsp;</p>"+
								"<p><span style='color: #ff0000;'><strong>Accedi al panello Gestione Prenotazioni per monitorare la tua prenotazione.</strong></span></p>"+
								"<p><span style='color: #ff0000;'><strong>Sarai comunque aggiornato via email!</strong></span></p>";
								var corpoLoc =
									"<p>Ecco i dati della nuova prenotazione:</p>"+
									"<ul>"+
										"<li><strong>Check-in: "+checkin+"</strong></li>"+
										"<li><strong>Check-out: "+checkout+"</strong></li>"+
										"<li><strong>Numero ospiti: "+ospiti+"</strong></li>"+
										"<li><strong>Guadagno potenziale: € "+importoTotale+"</strong></li>"+
									"</ul>"+
									"<p>&nbsp;</p>"+
									"<p><span style='color: #ff0000;'><strong>Accedi al panello Gestione Alloggi per gestire la prenotazione.</strong></span></p>";

								email.inviaEmailAffittuario(emailAff, oggettoAff, corpoAff);
								email.inviaEmailLocatore(emailLoc, oggettoLoc, corpoLoc);

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
		}
		else if(result.length == 0)
			cb("NOSESSION"); //NON LOGGATO
		else
			cb("ERR");
	});
}

function checkTotaleGiorni(result, checkin, checkout) {
	var inizio = new Date(checkin);
	var fine = new Date(checkout);
	var soggiorno = parseInt((fine - inizio) / (24 * 3600 * 1000));
	var somma = soggiorno + result[0].sommagiorni;
	console.log(somma)
	if(somma <= 28)
		return "OK";
	else
		return "EXCEEDED";
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
	main: main
};