const { response } = require('express');
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
        }
        else{
            res.status(500).end()
        }
        
    })

})

//GET show by id
app.get('/show/:id', (req, res) => {

    const query = "SELECT users.name, users.username, description, time, likes FROM shows, users WHERE users.id = shows.user AND shows.id = ?"

    connection.query(query, [req.params.id], (error, results, fields) => {

        if(!error){
            res.json(results)
        }
        else{
            res.status(500).end()
        }
        
    })

})

//ADD show
app.post('/show', (req, res) => {

    const { lat, lng, user, description, time } = req.body

    if(lat==null || lng==null || user==null || description==null || time==null){
        res.status(400).end()
    }

    const query = "INSERT INTO shows (lat, lng, user, description, time) VALUES (?, ?, ?, ?, ?);"

    connection.query(query, [lat, lng, user, description, time], (error, results, fields) => {

        if(!error){

            var show = results.insertId
            res.json({show})
        }
        else{
            var show = 0
            res.json({show})
        }
        
    })

})

//ADD like
app.post('/like/:id', (req, res) => {

    connection.query("SELECT likes FROM shows WHERE id = ?", [req.params.id], (error, results, fields) => {

        if(!error){

            if(!results.length > 0){

                res.status(400).end()
            }
            else{
                var newLikes = results[0].likes + 1

                connection.query("UPDATE shows SET likes = ? WHERE id = ?", [newLikes, req.params.id], (error, results, fields) => {

                    if(!error){
        
                        var result = true
                        res.json({result})
                    }
                    else{
                        var result = false
                        res.json({result})
                    }
                    
                })
            }

        }
        else{
            res.status(500).end()
        }
    
    })

})


//DEL show
app.delete('/show/:id', (req, res) => {

    const query = "DELETE FROM shows WHERE id = ?"

    connection.query(query, [req.params.id], (error, results, fields) => {

        if(!error){

            var result = true
            res.json({result})
        }
        else{
            var result = false
            res.json({result})
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
                else{
                    res.status(500).end()
                }

            })
            
        }
        else{
            res.status(500).end()
        }
        
    })

})

//ADD user
app.post('/user', (req, res) => {

    var { username, name, password } = req.body

    if(username==null || name==null || password==null){
        res.status(400).end()
    }
    else{

        username = username.trim()
        name = name.trim()
        password = password.trim()

        if(username.length > 50 || name.length > 50 || password.length >50 || username==="" || name==="" || password==""){
            res.status(400).end()
        }
        else{

            const query = "INSERT INTO users (username, name, password) VALUES (?, ?, ?);"

            connection.query(query, [username, name, password], (error, results, fields) => {

                if(!error){

                    const user = results.insertId
                    res.json({user})

                }
                else{
                    res.status(500).end()
                }
                
            })
        }

    }

})

//Login
app.post('/login', (req, res) => {

    var { username, password } = req.body

    if(username==null || password==null){
        res.status(400).end()
    }
    else{

        username = username.trim()
        password = password.trim()

        if(username==="" || password===""){
            res.status(400).end()
        }
        else{

            const query = "SELECT id, password FROM users WHERE username = ?";

            connection.query(query, [username], (error, results, fields) => {

                if(!error){

                    if(results[0].password == password){

                        const id = results[0].id
                        res.json({id})
                    }
                    else{
                        const result = false
                        res.json({result})
                    }

                }
                else{
                    
                    res.status(500).end()
                }
                
            })

        }

    }

})

app.listen(3000)