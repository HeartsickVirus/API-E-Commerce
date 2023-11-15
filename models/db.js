const  mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host:"mysql-aaron.alwaysdata.net",
    user:"aaron_iriyc",
    password:"0fftheMolly",
    database:"aaron_iriyc71",
    waitForConnections: true,
    queueLimit: 0
});

module.exports = pool;