const mysql = require('mysql2/promise');

var pool = mysql.createPool({
    host: 'localhost',
    user: 'vitor',
    password: 'Insert27Home',
    database: 'bdentregas'
});

module.exports = pool;