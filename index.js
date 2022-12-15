const express = require('express');

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'us-east.connect.psdb.cloud',
    user: '1ahqr93b5nvd9eaueczp',
    password: 'pscale_pw_XVhl0RAK7MdqNfztqSR3oqiw5B4oYFAI7vBNib5sKSD',
    database : 'start',
    ssl: true
});

connection.connect()

const app = express();
app.use(express.json());

//GET all shows
app.get('/show', (req, res) => {

    const query = "SELECT id, lat, lng FROM shows"

    connection.query(query, (error, results, fields) => {

        if(!error){
            res.json(results)
            res.status(200).end()
        }
        
    })

})

//GET show by id
app.get('/show/:id', (req, res) => {

    const query = "SELECT users.name, users.username, description FROM shows, users WHERE users.id = shows.user AND shows.id = '" + req.params.id + "'"

    connection.query(query, (error, results, fields) => {

        if(!error){
            res.json(results)
            res.status(200).end()
        }
        else{
            console.log(error)
        }
        
    })

})

//ADD show
app.post('/show', (req, res) => {

    const { lat, lng, user, description } = req.body
    const query = "INSERT INTO shows (lat, lng, user, description) VALUES (" + lat + ", " + lng + ", " + user + ", '" + description + "');"

    console.log(query)

    connection.query(query, (error, results, fields) => {

        if(!error){
            res.status(200).end()
        }
        else{
            console.log(error)
        }
        
    })

})

//DEL show
app.delete('/show/:id', (req, res) => {

    const query = "DELETE FROM shows WHERE id = " + req.params.id

    connection.query(query, (error, results, fields) => {

        if(!error){
            res.status(200).end()
        }
        
    })

})

//DEL all shows
app.delete('/shows', (req, res) => {

    connection.query("DELETE FROM shows", (error, results, fields) => {

        if(!error){

            connection.query("ALTER TABLE shows AUTO_INCREMENT = 1", (error, results, fields) => {
            
                if(!error){
                    res.status(200).end()
                }

            })

            
        }
        
    })

})

//ADD user
app.post('/user', (req, res) => {

    const { username, name, password } = req.body
    const query = "INSERT INTO users (username, name, password) VALUES ('" + username + "', '" + name + "', '" + password + "');"

    connection.query(query, (error, results, fields) => {

        if(!error){
            res.status(200).end()
        }
        
    })

})

//Login
app.post('/login', (req, res) => {

    const { username, password } = req.body
    const query = "SELECT password FROM users WHERE username = '" + username + "'";

    connection.query(query, (error, results, fields) => {

        if(!error){

            if(results[0].password == password){

                res.status(200).end()
            }
            else{
                res.status(401).end()
            }

        }
        else{
            console.log(error)
        }
        
    })

})

app.listen(3000)