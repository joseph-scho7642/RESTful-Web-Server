// Built-in Node.js modules
let fs = require('fs');
let path = require('path');

// NPM modules
let express = require('express');
let sqlite3 = require('sqlite3');


let db_filename = path.join(__dirname, 'db', 'stpaul_crime.sqlite3');

let app = express();
let port = 8000;

app.use(express.json());

// Open SQLite3 database (in read-only mode)
let db = new sqlite3.Database(db_filename, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.log('Error opening ' + path.basename(db_filename));
    }
    else {
        console.log('Now connected to ' + path.basename(db_filename));
    }
});


// GET request handler for crime codes
app.get('/codes', (req, res) => {
    console.log(req.query); // query object (key-value pairs after the ? in the url)

    function parseQueryString(q_string){
        let key_values = q_string.substring(1).split('&');
        let i;
        let query_obj = {};
        for(i = 0; i < key_values.length; i++){
            let key_val = key_values[i].split('=');
            console.log(key_val);
            query_obj[key_val[0]] = key_val[1];
        }
        return query_obj;
    }



    let query = 'SELECT * FROM Codes'; //WHERE code > value
    //Get limit
    //query = ' WHERE code > query_obj[0]' // Something along these lines

    databaseSelect(query, [])
    .then((data) =>{
        res.send(data);
    })
    .catch((err) => {
        res.send('Error ', err);
    })
    
    res.status(200).type('json').send({}); // <-- you will need to change this
});

// GET request handler for neighborhoods
app.get('/neighborhoods', (req, res) => {
    console.log(req.query); // query object (key-value pairs after the ? in the url)

    let query = 'SELECT * FROM Neighborhoods'; //WHERE code > value

    let range = document.getElementById()
    databaseSelect(query, [])
    .then((data) =>{
        res.send(data);
    })
    .catch((err) => {
        res.send('Error ', err);
    })

    res.status(200).type('json').send({}); // <-- you will need to change this
});

// GET request handler for crime incidents
app.get('/incidents', (req, res) => {
    console.log(req.query); // query object (key-value pairs after the ? in the url)
    
    let query = 'SELECT * FROM Incidents'; //WHERE code > value

    databaseSelect(query, [])
    .then((data) =>{
        res.send(data);
    })
    .catch((err) => {
        res.send('Error ', err);
    })

    res.status(200).type('json').send({}); // <-- you will need to change this
});

// PUT request handler for new crime incident
app.put('/new-incident', (req, res) => {
    console.log(req.body); // uploaded data
    
    let query = 'SELECT * FROM Codes'; //WHERE code > value

    databaseSelect(query, [])
    .then((data) =>{
        res.send(data);
    })
    .catch((err) => {
        res.send('Error ', err);
    })

    res.status(200).type('txt').send('OK'); // <-- you may need to change this
});

// DELETE request handler for new crime incident
app.delete('/remove-incident', (req, res) => {
    console.log(req.body); // uploaded data
    
    let query = 'SELECT * FROM Codes'; //WHERE code > value

    databaseSelect(query, [])
    .then((data) =>{
        res.send(data);
    })
    .catch((err) => {
        res.send('Error ', err);
    })

    res.status(200).type('txt').send('OK'); // <-- you may need to change this
});


// Create Promise for SQLite3 database SELECT query 
function databaseSelect(query, params) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        })
    })
}

// Create Promise for SQLite3 database INSERT or DELETE query
function databaseRun(query, params) {
    return new Promise((resolve, reject) => {
        db.run(query, params, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    })
}


// Start server - listen for client connections
app.listen(port, () => {
    console.log('Now listening on port ' + port);
});
