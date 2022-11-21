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


    /*

    I don't think this is the strat, use the one above

    // Parse the Query string for all the parameters
    function parseQueryString(q_string){
        let key_values = q_string.substring(1).split('&');
        let i;

        let code = " WHERE code = ";
        query = query + code + key_values[1] //This may not work, but hard coded for code



        let query_obj = {};
        for(i = 0; i < key_values.length; i++){
            let key_val = key_values[i].split('=');
            console.log(key_val);
            //We could put in the query parameters, so like if the user put in ?LIMIT=10, we could see in this with an if statement for it being LIMIT, and inside add on to the query LIMIT value
            query_obj[key_val[0]] = key_val[1];
        }
        return query_obj;
    }*/

    //Does limit matter in these statements? How does that work
    //Finally, set the ordering
    query = query + " Order by code";


    


    databaseSelect(query, [])
    .then((data) =>{
        console.log(data);
        res.status(200).type('json').send(data);
    })
    .catch((err) => {
        res.status(200).type(html).send('Error ', err);
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
                //If there is more than one code contraint
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
        res.status(200).type(txt).send('Error ', err);
    })

});

// GET request handler for crime incidents
app.get('/incidents', (req, res) => {
    console.log(req.query); // query object (key-value pairs after the ? in the url)
    
    let query = 'SELECT * FROM Incidents'; //WHERE code > value
    let input = " WHERE "

    //Currently hard coded limit
    let limit = 10

    for([key, value] of Object.entries(req.query)){
        if(key == "code"){
            let values = value.split(",");
            for(i=0; i<values.length; i++){
                query = query + input + "code = " + values[i];
                //If there is more than one code contraint
                input = " OR ";
            }
        }
        else if(key == "id"){
            let values = value.split(",");
            for(i=0; i<values.length; i++){
                query = query + input + "neighborhood_number = " + values[i];
                //If there is more than one code contraint
                input = " OR ";
            }
        }
    }

    //Sort by the case number
    query = query + " Order by case_number ASC ";
    // Set the limit
    query = query + " LIMIT " + limit


    databaseSelect(query, [])
    .then((data) =>{
        console.log(data);
        res.status(200).type('json').send(data);
    })
    .catch((err) => {
        res.status(200).type(txt).send('Error ', err);
    })
});

// PUT request handler for new crime incident
app.put('/new-incident', (req, res) => {
    console.log(req.body); // uploaded data
    
    let query = ''; //Insert: case_number, see if that that case number does not exist, then add date_time, code, incident, police_grid, neighborhood_number, block

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
    
    let query = ''; //Find the case number, and remove that entry

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
