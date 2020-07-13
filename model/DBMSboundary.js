const pool = require('./sqlhelper2');

function DBMSboundary() {}

DBMSboundary.prototype = {

    cercaSessione : function (session_id, cb) {
        var qr = "SELECT * FROM account WHERE session_id='"+session_id+"'";
        pool.query(qr, function (err, result) {
            if(err) throw err;
            if(result) {
                cb(err, result);
            }
        })
    },

    cercaUtente : function (email, password, cb) {
        var qr = "SELECT * FROM account WHERE email='"+email+"' AND password='"+password+"'";
        pool.query(qr, function (err, result) {
            if(err) throw err;
            if(result) {
                cb(err, result);
            }
        })
    },

    inserisciSessionId : function (email, password, session_id, cb) {
        var qr = "UPDATE account SET session_id='"+session_id+"' WHERE email='"+email+"' AND password='"+password+"'"
        pool.query(qr, function (err, result) {
            if(err) throw err;
            if(result) {
                cb(err, result);
            }
        })
    },

    registraUtente : function (nome, cognome, email, psw, telefono, ddn, ldn, ldr, idr, tipo, cb) {
        var qr = "INSERT INTO account (email, password, nome, cognome, ddn, ldn, residenza, indirizzo, cellulare, tipo) "+
        "VALUES('"+email+"', '"+psw+"', '"+nome+"', '"+cognome+"', '"+ddn+"', '"+ldn+"', '"+ldr+"', '"+idr+"', '"+telefono+"', "+tipo+")";
        pool.query(qr, function (err, result) {
            if(err) throw err;
            if(result) {
                cb(err, result);
            }
        })
    },

    rimuoviSessionId : function (session_id, cb) {
        var qr = "UPDATE account SET session_id = null WHERE session_id='"+session_id+"'";
        pool.query(qr, function (err, result) {
            if(err) throw err;
            if(result) {
                cb(err, result);
            }
        })
    },

    cercaListaAnnunci : function (localita, ospiti, camere, cb) {
        var qr = "SELECT annuncio.*, alloggio.* FROM annuncio, alloggio "+ 
                "WHERE (alloggio.localita ='"+localita+"') AND (alloggio.num_ospiti_max >='"+ospiti+"') "+
                "AND (alloggio.num_camere_max >= '"+camere+"') AND (annuncio.id_alloggio_fk = alloggio.id_alloggio)";
        pool.query(qr, function (err, result) {
            if(err) throw err;
            if(result) {
                cb(err, result);
            }
        })
    },

    cercaAnnuncio : function (id_ann, cb) {
        var qr = "SELECT alloggio.*"+
                    "FROM annuncio, alloggio "+ 
                    "WHERE (annuncio.id_alloggio_fk = alloggio.id_alloggio) AND (annuncio.id_annuncio ='"+id_ann+"')";
        pool.query(qr, function (err, result) {
            if(err) throw err;
            if(result) {
                cb(err, result);
            }
        })    

    },

    cercaFoto : function(id_ann, cb) {
        var qr = "SELECT foto.* FROM annuncio, foto "+
        "WHERE (foto.id_annuncio_fk=annuncio.id_annuncio AND annuncio.id_annuncio='"+id_ann+"')";
        pool.query(qr, function (err, result) {
            if(err) throw err;
            if(result) {
                cb(err, result);
            }
        }) 
    },

    numeroGiorniSoggiorno : function(id_alloggio, session_id, cb) {
        var qr = "SELECT SUM(DATEDIFF(prenotazione.checkout, prenotazione.checkin)) AS sommagiorni "+
                    "FROM prenotazione, alloggio, account "+
                    "WHERE (account.session_id ='"+session_id+"') AND (account.email = prenotazione.email_fk)"+
                    "AND (alloggio.id_alloggio ='"+id_alloggio+"') AND (alloggio.id_alloggio = prenotazione.id_alloggio_fk)";

        pool.query(qr, function (err, result) {
            if(err) throw err;
            if(result) {
                cb(err, result);
            }
        }) 
    },

    inserisciRichiestaPrenotazioneLoco : function(checkin, checkout, datiUtente, id_alloggio, ospiti, importo, cb) {
        var inizio = new Date(checkin);
        var fine = new Date(checkout);
        var importoTotale = (importo*ospiti)*(parseInt((fine - inizio) / (24 * 3600 * 1000)));
        var qr = "INSERT INTO prenotazione(importo, stato_prenotazione, stato_rendicontazione, stato_questura, stato_pagamento, checkin, checkout, email_fk, id_alloggio_fk, num_ospiti) "+
                "VALUES("+importoTotale+", 0, 0, 0 , 0, '"+checkin+"', '"+checkout+"', '"+datiUtente[0].email+"', '"+id_alloggio+"', '"+ospiti+"')";
        pool.query(qr, function (err, result) {
            if(err) throw err;
            if(result)
                cb(err, result);
            if(!result)
                cb(err, "ERR");
        })
    },

    cercaAlloggio : function(id_all, cb) {
        var qr = "SELECT alloggio.* FROM alloggio "+ 
                "WHERE id_alloggio = "+id_all;
        pool.query(qr, function (err, result) {
            if(err) throw err;
            if(result) {
                cb(err, result);
            }
        }) 
    },

    inserisciRichiestaPrenotazioneEdatiOspite : function(datiOspiti, categorie, datiUtente, checkin, checkout, id_all, num_ospiti, importo, tasse, cb) {
        var sqllist = [];
        var inizio = new Date(checkin);
        var fine = new Date(checkout);
        var importoTotale = (importo*num_ospiti)*(parseInt((fine - inizio) / (24 * 3600 * 1000)));

        var qr1 = "INSERT INTO prenotazione (importo, stato_prenotazione, stato_rendicontazione, stato_questura, stato_pagamento, checkin, checkout, email_fk, id_alloggio_fk, num_ospiti) "+
        "VALUES ("+importoTotale+", 0, 0, 0, 1, '"+checkin+"', '"+checkout+"', '"+datiUtente[0].email+"', '"+id_all+"', '"+num_ospiti+"')";

        pool.query(qr1, function (err, result) {
            if(err) throw err;
            if(result) {
                var id_prenotazione = result.insertId;
                //UTENTE REGISTRATO
                sqllist.push("INSERT INTO ospite (nome, cognome, ddn, ldn, residenza, indirizzo, tassa, categoria, id_prenotazione_fk)" +
                "VALUES ('"+datiUtente[0].nome+"', '"+datiUtente[0].cognome+"', '"+datiUtente[0].ddn+"', '"+datiUtente[0].ldn+"', '"+datiUtente[0].residenza+"', '"+datiUtente[0].indirizzo+"', '"+tasse[0]+"', '"+categorie[0]+"', '"+id_prenotazione+"')");

                for(var i=1; i<num_ospiti; i++) {
                    //OSPITI
                    sqllist.push("INSERT INTO ospite (nome, cognome, ddn, ldn, residenza, indirizzo, tassa, categoria, id_prenotazione_fk)" +
                    "VALUES ('"+datiOspiti[i][0]+"', '"+datiOspiti[i][1]+"', '"+datiOspiti[i][2]+"', '"+datiOspiti[i][3]+"', '"+datiOspiti[i][4]+"', '"+datiOspiti[i][5]+"', '"+tasse[i]+"', '"+categorie[i]+"', '"+id_prenotazione+"')");
                }
        
                pool.getConnection(function (err, connection) {
                    connection.beginTransaction(function (err) {
                        if (err) {throw err;}
                        eseguiTransazione(sqllist,0,connection,cb);
                    });
        
                    if(err) return cb("ERR");
                })
            }
        })
    },

    cercaAnnunci : function(email, cb) {
        var qr = "SELECT annuncio.*, alloggio.* FROM annuncio, alloggio "+ 
        "WHERE annuncio.id_alloggio_fk=alloggio.id_alloggio AND annuncio.email_locatore_fk='"+email+"'"; 
        pool.query(qr, function (err, result) {
            if(err) throw err;
            if(result)
                cb(err, result);
        })
    },

    inserisciAnnuncioeAlloggio : function(email, datiAnnuncio, datiAlloggio, cb) {
        var sqllist = [];
        var sqllist2 = [];
        if(datiAlloggio[8] == false)
            datiAlloggio[8]=0;
        else
            datiAlloggio[8]=1;
        if(datiAlloggio[7] == false)
            datiAlloggio[7]=0;
        else
            datiAlloggio[7]=1;
        if(datiAlloggio[9] == false)
            datiAlloggio[9]=0;
        else
            datiAlloggio[9]=1;

        var qr1 = "INSERT INTO alloggio (num_camere_max, localita, num_ospiti_max, tassa, parcheggio, colazione, bagni, lettiSingoli, lettiMatrimoniali, piscina, email_locatore_fk) "+
        "VALUES ('"+datiAlloggio[2]+"', '"+datiAlloggio[0]+"', '"+datiAlloggio[3]+"', "+datiAlloggio[1]+", "+datiAlloggio[8]+", "+datiAlloggio[7]+", "+datiAlloggio[4]+", "+datiAlloggio[5]+", "+datiAlloggio[6]+", "+datiAlloggio[9]+", '"+email+"')";

        var qr2 = "INSERT INTO annuncio (titolo, descrizione, prezzo, validita_start, validita_stop, email_locatore_fk, id_alloggio_fk) "+
        "VALUES ('"+datiAnnuncio[0]+"', '"+datiAnnuncio[4]+"', '"+datiAnnuncio[3]+"', '"+datiAnnuncio[1]+"', '"+datiAnnuncio[2]+"', '"+email+"', ?)";   

        sqllist.push(qr1);
        sqllist.push(qr2);

        pool.getConnection(function (err, connection) {
            connection.beginTransaction(function (err) {
                if (err) {throw err;}
                eseguiTransazione2(sqllist,0,0,connection,cb);
            });
        
            if(err) return cb("ERR");
        });
    },

    idprenmax : function(cb) {
        var qr = "SELECT MAX(id_annuncio) AS id_annuncio FROM annuncio";
        pool.query(qr, function (err, result) {
            if(err) throw err;
            if(result)
                cb(err, result);
        })
    },

    inserisciFoto : function(foto, id_ann, cb) {
        sqllist = [];
        for(var i=0; i<foto.length; i++)
            sqllist.push("INSERT INTO foto (nome, id_annuncio_fk) VALUES ('"+foto[i]+"', '"+id_ann+"')");
        pool.getConnection(function (err, connection) {
            connection.beginTransaction(function (err) {
                if (err) {throw err;}
                eseguiTransazione(sqllist,0,connection,cb);
            });
            if(err) return cb("ERR");
        }); 
    },
    
    aggiornaDatiAnnuncioeAlloggio : function(email, id_ann, id_all, datiAnnuncio, datiAlloggio, cb) {
        var sqllist = [];

        var qr1 = "UPDATE alloggio SET num_ospiti_max=4, tassa="+datiAlloggio[0]+", colazione=1, lettiSingoli=1, lettiMatrimoniali=2 "+
        "WHERE email_locatore_fk='"+email+"' AND id_alloggio="+id_all+"";

        var qr2 = "UPDATE annuncio SET titolo='"+datiAnnuncio[0]+"', descrizione='"+datiAnnuncio[4]+"', prezzo="+datiAnnuncio[3]+","+
        "validita_start='"+datiAnnuncio[1]+"', validita_stop='"+datiAnnuncio[2]+"' "+
        "WHERE email_locatore_fk='"+email+"' AND id_annuncio="+id_ann+"";   
        
        sqllist.push(qr1);
        sqllist.push(qr2);
        
        pool.getConnection(function (err, connection) {
            connection.beginTransaction(function (err) {
                if (err) {throw err;}
                eseguiTransazione(sqllist,0,connection,cb);
            });
        
            if(err) return cb("ERR");
        })   

    },

    eliminaAnnuncio : function(email, id_ann, cb) {
        var qr = "DELETE FROM annuncio WHERE email_locatore_fk='"+email+"' AND id_annuncio="+id_ann+"";
        pool.query(qr, function (err, result) {
            if(err) throw err;
            if(result)
                cb(err, result);
        })
    },

    cercaAnnunciLocatori : function(cb) {
        var qr = "SELECT annuncio.*, alloggio.* FROM annuncio, alloggio "+ 
        "WHERE annuncio.id_alloggio_fk=alloggio.id_alloggio"; 
        pool.query(qr, function (err, result) {
            if(err) throw err;
            if(result)
                cb(err, result);
        })

    },

    eliminaAnnuncioLocatore : function(id_ann, cb) {
        var qr = "DELETE FROM annuncio WHERE id_annuncio="+id_ann+"";
        pool.query(qr, function (err, result) {
            if(err) throw err;
            if(result)
                cb(err, result);
        })
    },

    cercaAlloggi : function(email, cb) {
        var qr = "SELECT alloggio.*, SUM(prenotazione.importo) AS guadagno "+
        "FROM alloggio, prenotazione "+ 
        "WHERE (alloggio.id_alloggio = prenotazione.id_alloggio_fk) AND (email_locatore_fk='"+email+"')"+
        "GROUP BY alloggio.id_alloggio";
        pool.query(qr, function (err, result) {
            if(err) throw err;
            if(result)
                cb(err, result);
        })
    },

    cercaPrenotazioniLocatore : function(email, id_all, cb) {
        var qr = "SELECT prenotazione.* FROM alloggio, prenotazione "+
        "WHERE (alloggio.id_alloggio=prenotazione.id_alloggio_fk) AND (alloggio.id_alloggio="+id_all+") "+
        "AND (email_locatore_fk='"+email+"')";
        pool.query(qr, function (err, result) {
            if(err) throw err;
            if(result)
                cb(err, result);
        })
    },

    eliminaPrenotazioneLocatore : function(id_pren, cb) {
        var qr = "UPDATE prenotazione SET stato_prenotazione=2 WHERE id_prenotazione="+id_pren+"";
        pool.query(qr, function (err, result) {
            if(err) throw err;
            if(result)
                cb(err, result);
        })        

    },

    accettaPrenotazione : function(id_pren, cb) {
        var qr = "UPDATE prenotazione SET stato_prenotazione=1 WHERE id_prenotazione="+id_pren+"";
        pool.query(qr, function (err, result) {
            if(err) throw err;
            if(result)
                cb(err, result);
        })    
    },

    aggiornaDatiProfilo : function(email, password, telefono, residenza, indirizzo, cb) {
        var qr = "UPDATE account SET password='"+password+"', cellulare='"+telefono+"', residenza='"+residenza+"', indirizzo='"+indirizzo+"' "+
        "WHERE email='"+email+"'";
        pool.query(qr, function (err, result) {
            if(err) throw err;
            if(result)
                cb(err, result);
        })  
    },

    cercaUtenti : function(email, cb) {
        var qr = "SELECT * FROM account WHERE email <> '"+email+"'";
        pool.query(qr, function (err, result) {
            if(err) throw err;
            if(result)
                cb(err, result);
        })  

    },

    cancellaAccountAnnunciPrenotazioni : function(email, cb) {

    },

    cercaPrenotazioniCliente : function(email, cb) {
        var qr = "SELECT * FROM prenotazione WHERE email_fk='"+email+"'";
        pool.query(qr, function (err, result) {
            if(err) throw err;
            if(result)
                cb(err, result);
        });
    },

    eliminaPrenotazione : function(email, id_pren, cb) {
        var qr = "UPDATE prenotazione SET stato_prenotazione=2 WHERE id_prenotazione="+id_pren+" AND email_fk='"+email+"'";
        pool.query(qr, function (err, result) {
            if(err) throw err;
            if(result)
                cb(err, result);
        })        

    },

    cercaPrenotazioni(cb) {
        var qr = "SELECT * FROM prenotazione";
        pool.query(qr, function (err, result) {
            if(err) throw err;
            if(result)
                cb(err, result);
        });
    },

    cercaPrenotazioniAccettate : function(email, cb) {
        var qr = "SELECT prenotazione.* FROM alloggio, prenotazione "+ 
        "WHERE alloggio.email_locatore_fk='"+email+"' AND alloggio.id_alloggio=prenotazione.id_alloggio_fk AND prenotazione.stato_questura=0 "+
        "AND prenotazione.stato_prenotazione=1 AND (TIMESTAMPDIFF(day, checkin, NOW()) <= 1)";
        pool.query(qr, function (err, result) {
            if(err) throw err;
            if(result)
                cb(err, result);
        });        
    },

    cercaDatiPrenotazione : function(email, id_pren, cb) {
        var qr = "SELECT ospite.* FROM prenotazione, ospite, alloggio "+ 
        "WHERE alloggio.email_locatore_fk='"+email+"' AND alloggio.id_alloggio=prenotazione.id_alloggio_fk "+
        "AND prenotazione.id_prenotazione="+id_pren+" AND ospite.id_prenotazione_fk=prenotazione.id_prenotazione";
        pool.query(qr, function (err, result) {
            if(err) throw err;
            if(result)
                cb(err, result);
        });        
    },

    inserisciDatiOspiteEaggiornaStatoComunicazioneQuestura : function(id_pren, datiOspiti, categorie, num_ospiti, tasse, cb) {
        var sqllist = [];
        var qr0 = "UPDATE prenotazione SET stato_pagamento=1, stato_questura=1 WHERE id_prenotazione="+id_pren+"";
        sqllist.push(qr0);
        for(var i=0; i<num_ospiti; i++) {
            //OSPITI
            sqllist.push("INSERT INTO ospite (nome, cognome, ddn, ldn, residenza, indirizzo, tassa, categoria, id_prenotazione_fk)" +
            "VALUES ('"+datiOspiti[i][0]+"', '"+datiOspiti[i][1]+"', '"+datiOspiti[i][2]+"', '"+datiOspiti[i][3]+"', '"+datiOspiti[i][4]+"', '"+datiOspiti[i][5]+"', '"+tasse[i]+"', '"+categorie[i]+"', '"+id_pren+"')");
        }
        pool.getConnection(function (err, connection) {
            connection.beginTransaction(function (err) {
                if (err) {throw err;}
                eseguiTransazione(sqllist,0,connection,cb);
            });
        
            if(err) return cb("ERR");
        })
    },

    aggiornaStatoComunicazioneQuestura : function(id_pren, cb) {
        var qr = "UPDATE prenotazione SET stato_questura=1 WHERE id_prenotazione="+id_pren;
        pool.query(qr, function (err, result) {
            if(err) throw err;
            if(result)
                cb(err, result);
        }); 
    },

    rendiconta : function(email, cb) {
        var qr = "SELECT alloggio.*, prenotazione.*, ospite.* "+
        "FROM alloggio, prenotazione, ospite "+
        "WHERE alloggio.email_locatore_fk='"+email+"' AND alloggio.id_alloggio=prenotazione.id_alloggio_fk "+
        "AND prenotazione.id_prenotazione=ospite.id_prenotazione_fk AND "+
        "prenotazione.stato_questura=1 AND prenotazione.stato_rendicontazione=0 "+
        "AND TIMESTAMPDIFF(month, checkin, NOW()) <= 3";
        pool.query(qr, function (err, result) {
            if(err) throw err;
            if(result)
                cb(err, result);
        }); 
    },

    aggiornaStatoUfficioTurismo : function(prenotazioni, cb) {
        var sqllist = [];
        for(var i=0; i<prenotazioni.length; i++)
            sqllist.push("UPDATE prenotazione SET stato_rendicontazione=1 WHERE id_prenotazione="+prenotazioni[i]);
        pool.getConnection(function (err, connection) {
            connection.beginTransaction(function (err) {
                if (err) {throw err;}
                eseguiTransazione(sqllist,0,connection,cb);
            });
            if(err) return cb("ERR");
        })   
    }
};

var eseguiTransazione = function(sqllist,i,connection,callback){
    connection.query(sqllist[i], function(err, result) {
        if (err) { 
            console.log(err);
            connection.rollback(function() {
                return callback("ERR");
            });
        }
        else {
            if(i<sqllist.length-1)
                eseguiTransazione(sqllist,i+1,connection,callback);
            else {
                connection.commit(function(err) {
                    if (err) { 
                        connection.rollback(function() {
                            return callback("ERR");
                        });
                    }
                    console.log("Transazione Completata");
                    connection.release();
                    return callback(result);
                });
            }
        }
    });
}

var eseguiTransazione2 = function(sqllist,i, result, connection,callback){
    connection.query(sqllist[i], result, function(err, result) {
        if (err) { 
            console.log(err);
            connection.rollback(function() {
                return callback("ERR");
            });
        }
        else {
            if(i<sqllist.length-1)
                eseguiTransazione2(sqllist,i+1,result.insertId,connection,callback);
            else {
                connection.commit(function(err) {
                    if (err) { 
                        connection.rollback(function() {
                            return callback("ERR");
                        });
                    }
                    console.log("Transazione Completata");
                    connection.release();
                    return callback(result);
                });
            }
        }
    });
}


module.exports = DBMSboundary;