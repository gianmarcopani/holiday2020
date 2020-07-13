const util = require('util');
const mysql = require('mysql');

/**
 * Creo la connessione al database
 */

const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'sql7.freemysqlhosting.net',
    user: 'sql7350678',
    password: 'WaCTmsBaHX',
    database: 'sql7350678',
    timezone: 'utc',
    multipleStatement: true,
});

pool.getConnection((err, connection) =>{
    if(err)
        console.log(err + " --- Connessione al db non riuscita");
    if(connection)
        connection.release();
    return;
});

pool.query = util.promisify(pool.query);

module.exports = pool;
