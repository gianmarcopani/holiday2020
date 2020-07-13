const DBMSboundary = require('./DBMSboundary');
const email = require('./email');

const dbmsboundary = new DBMSboundary();

var main = function(risposta, richiesta, cb) {
    var dati = richiesta.query;
    var action = dati["action"];
    var session_id = dati["session_id"];
    var id_all = dati["id_all"];
    var id_pren = dati["id_pren"];

    //tipo in account: 0 admin, 1 affittuario, 2 locatore.
    //stato prenotazione: 0 in sospeso, 1 accettata, 2 rifiutata o cancellata.
    dbmsboundary.cercaSessione(session_id, function (err, result) {
        if(result.length > 0) { //LOGGATO
            //funzionalità a disposizione del locatore
            if(result[0].tipo == 2) {
                emailloc=result[0].email;
                if(action == "notificaGestioneAlloggi") {
                    dbmsboundary.cercaAlloggi(result[0].email, function(err, result) {
                        if(err) {
                            cb("ERR");
                        }
                        if(result) {
                            cb(result);
                        }
                    });
                }

                if(action == "notificaCercaDettagli") {
                    dbmsboundary.cercaPrenotazioniLocatore(result[0].email, id_all, function(err, result) {
                        if(err) {
                            cb("ERR");
                        }
                        if(result) {
                            cb(result);
                        }
                    });
                }

                if(action == "notificaEliminaPrenotazione") {
                    dbmsboundary.eliminaPrenotazioneLocatore(id_pren, function(err, result) {
                        if(err) {
                            cb("ERR");
                        }
                        if(result) {
                            dbmsboundary.cercaPrenotazione(id_pren, function(err, result) {
                                if(err) 
                                    cb("ERR");
                                if(result) {
                                    var oggetto = "La tua prenotazione è stata cancellata";
                                    corpo="La tua prenotazione su Holiday con i seguenti dati è stata eliminata:"
                                    corpo+="<ul>"+
                                            "<li><strong>Importo €:"+result[0].importo+"</strong></li>"+
                                            "<li><strong>Check-in: "+JSON.stringify(result[0].checkin)+"</strong></li>"+
                                            "<li><strong>Check-out: "+JSON.stringify(result[0].checkout)+"</strong></li>"+
                                            "<li><strong>Numero di ospiti: "+result[0].num_ospiti+"</strong></li>"+
                                        "</ul>"+
                                        "<p>&nbsp;</p>";
                                    email.inviaEmailAffittuario(result[0].email_fk, oggetto, corpo);
                                    cb("OK");
                                }
                            })
                        }
                    });
                } 
                
                if(action == "notificaAccettaPrenotazione") {
                    dbmsboundary.accettaPrenotazione(id_pren, function(err, result) {
                        if(err) {
                            cb("ERR");
                        }
                        if(result) {
                            dbmsboundary.cercaPrenotazione(id_pren, function(err, result) {
                                if(err) 
                                    cb("ERR");
                                if(result) {
                                    console.log(result)
                                    var oggetto = "La tua prenotazione è stata accettata";
                                    corpo="La tua prenotazione su Holiday con i seguenti dati è stata accettata:"
                                    corpo+="<ul>"+
                                            "<li><strong>Importo €:"+result[0].importo+"</strong></li>"+
                                            "<li><strong>Checkin: "+JSON.stringify(result[0].checkin)+"</strong></li>"+
                                            "<li><strong>Checkout: "+JSON.stringify(result[0].checkout)+"</strong></li>"+
                                            "<li><strong>Numero di ospiti: "+result[0].num_ospiti+"</strong></li>"+
                                        "</ul>"+
                                        "<p>&nbsp;</p>";
                                    email.inviaEmailAffittuario(result[0].email_fk, oggetto, corpo);
                                    cb("OK");
                                }
                            })
                        }
                    });
                } 

                //inserire cb di errore anche qui
            }
        }

        else if(result.length == 0)
            cb("NOSESSION"); //NON LOGGATO
        else
            cb("ERR");
    });

}

module.exports = {
    main:main
};