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

    let query = 'SELECT * FROM Codes'; 
    let input = " WHERE code ="; //WHERE code = value to get that exact code information

    for([key, value] of Object.entries(req.query)){
        if(key == "code"){
            let values = value.split(",");
            for(i=0; i<values.length; i++){
                query = query + input + values[i];
                //If there is more than one code contraint
                input = " OR code = ";
            }
        }
    }

    //Does limit matter in these statements? How does that work
    //Finally, set the ordering
    query = query + " Order by code";


    


    databaseSelect(query, [])
    .then((data) =>{
        console.log(data);
        res.status(200).type('json').send(data);
    })
    .catch((err) => {
        res.status(200).type('html').send('Error ', err);
    })
});

// GET request handler for neighborhoods
app.get('/neighborhoods', (req, res) => {
    console.log(req.query); // query object (key-value pairs after the ? in the url)

    let query = 'SELECT * FROM Neighborhoods'; 
    let input = " WHERE neighborhood_number = "; //WHERE code = value to get that exact code information

    for([key, value] of Object.entries(req.query)){
        if(key == "id"){
            let values = value.split(",");
            for(i=0; i<values.length; i++){
                query = query + input + values[i];
                //If there is more than one neighborhood contraint
                input = " OR neighborhood_number = ";
            }
        }
    }

    //Sort from low to high neighborhood_number
    query = query + " Order by neighborhood_number ASC";

    //let range = document.getElementById()
    databaseSelect(query, [])
    .then((data) =>{
        console.log(data);
        res.status(200).type('json').send(data);
    })
    .catch((err) => {
        res.status(200).type('txt').send('Error ', err);
    })

});

// GET request handler for crime incidents
app.get('/incidents', (req, res) => {
    console.log(req.query); // query object (key-value pairs after the ? in the url)
    
    let query = 'SELECT * FROM Incidents'; //WHERE code > value
    let input = " WHERE ("

    //Currently hard coded limit
    let limit = 1000

    for([key, value] of Object.entries(req.query)){
        if(key == "code"){
            let values = value.split(",");
            for(i=0; i<values.length; i++){
                query = query + input + "code = " + values[i];
                //If there is more than one code contraint
                input = " OR ";
            }
            input = ") AND ("
        }
        else if(key == "id"){
            let values = value.split(",");
            for(i=0; i<values.length; i++){
                query = query + input + "neighborhood_number = " + values[i];
                //If there is more than one neighborhood contraint
                input = " OR ";
            }
            input = ") AND ("
        }
        else if(key == 'grid'){
            let values = value.split(",");
            for(i=0; i<values.length; i++){
                query = query + input + "police_grid = " + values[i];
                //If there is more than one grid contraint
                input = " OR ";
            }
            input = ") AND ("
        }
        else if(key == 'limit'){
            let values = value.split(",");
            for(i=0; i<values.length; i++){
                limit = values[i]
            }
        }
        else if(key == 'start_date'){

        }
        else if(key == 'end_date'){

        }
    }


    //Sort by the case number
    query = query + ") Order by case_number ASC ";
    // Set the limit
    query = query + " LIMIT " + limit


    databaseSelect(query, [])
    .then((data) =>{
        console.log(data);
        res.status(200).type('json').send(data);
    })
    .catch((err) => {
        res.status(200).type('txt').send('Error ', err);
    })
});

// PUT request handler for new crime incident
app.put('/new-incident', (req, res) => {
    console.log(req.body); // uploaded data
    
    let query = ''; //Insert: case_number, see if that that case number does not exist, then add date_time, code, incident, police_grid, neighborhood_number, block

    databaseSelect(query, [])
    .then((data) =>{
        console.log(data);
        res.status(200).type('json').send(data);
    })
    .catch((err) => {
        res.status(200).type(txt).send('Error ', err);
    })
});

// DELETE request handler for new crime incident
app.delete('/remove-incident', (req, res) => {
    console.log(req.body); // uploaded data
    
    let query = ''; //Find the case number, and remove that entry

    databaseSelect(query, [])
    .then((data) =>{
        console.log(data);
        res.status(200).type('json').send(data);
    })
    .catch((err) => {
        res.status(200).type(txt).send('Error ', err);
    })
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
