// get the client
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
    host: '192.168.3.25',
    user: 'wanglei',
    password: 'mnbvcxz@123',
    database: 'web-node'
});
connection.on('error', err => {
    console.log('error emited', err.message);
})
console.log(new Date().toLocaleString())
// simple query
connection.query(
    'SELECT * FROM `table` WHERE `name` = "Page" AND `age` > 45',
    function (err, results, fields) {
        console.log(results); // results contains rows returned by server
        console.log(fields); // fields contains extra meta data about results, if available
    }
);

// with placeholder
connection.query(
    'SELECT * FROM `table` WHERE `name` = ? AND `age` > ?',
    ['Page', 45],
    function (err, results) {
        console.log(results);
    }
);

// with placeholder
connection.query(
    'show TABLES',
    [],
    function (err, results, fields) {
        console.log(results, typeof fields);
    }
);

console.log('bottom runing')