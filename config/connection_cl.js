var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'insurance_client',
    multipleStatements: true
});
connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return err;
    }});



module.exports = connection;
