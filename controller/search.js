const DBMSboundary = require('./DBMSboundary');

const dbmsboundary = new DBMSboundary();

var main = function(risposta, richiesta, cb) {
    var dati = richiesta.query;
    var action = dati["action"];
    var localita = dati["localita"];
    var checkin = dati["checkin"]; //da inserire
    var checkout = dati["checkout"]; //da inserire
    var ospiti = dati["ospiti"];
    var camere = dati["camere"];
    var id_ann = dati["id_ann"];
    //mancano gli attr dei servizi

    if(action == "searchlist") {
        //è la notificaCerca()
        dbmsboundary.cercaListaAnnunci(localita, ospiti, camere, function(err, result) {
            if(err) {
                cb("ERR");
            }
            if(result) {
                if(result.length > 0)
                    cb(result);
                else
                    cb("NORES");
            }
        });
    }

    if(action == "searchad") {
        //è la notificaAnnuncio()
        dbmsboundary.cercaAnnuncio(id_ann, function(err, result) {
            if(err) {
                cb("ERR");
            }
            if(result) {
                if(result.length > 0) {
                    cb(result);
                }
                else
                    cb("NORES");
            }
        });
    }
    
    if(action == "searchfoto") {
        dbmsboundary.cercaFoto(id_ann, function(err, result) {
            if(err) {
                cb("ERR");
            }
            if(result) {
                if(result.length > 0) {
                    cb(result);
                }
                else
                    cb("NORES");
            }
        });        
    }
}

module.exports = {
    main:main
};