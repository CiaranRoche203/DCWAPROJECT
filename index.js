const express = require('express')
var home = require('./home')
var cities = require('./cities')
var ejs = require('ejs')
var bodyParser = require('body-parser')

const app = express()

var mysql = require('promise-mysql')

var pool

mysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'geography'
})
    .then((result) => {
        pool = result
    })
    .catch((error) => {
        console.log(error)
    })
app.use(bodyParser.urlencoded({ extended: false }))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
   res.render("home")
})
app.get('/countries', (req, res) => {
    home.getCountries()
        .then((result) => {
            console.log(result)
            res.render('countries', { countries: result })
        })
        .catch((error) => {
            res.send(error)
        })
    //res.render("countries", {})
})

app.get('/countries/:co_code', (req, res) => {
    //res.send(req.params.co_code)
    home.deleteCountry(req.params.co_code)
        .then((result) => {
            res.send(result)
        })
        .catch((error) => {
            res.send(error)
        })
})

app.get('/addCountry', (req, res) => {
    res.render("addCountry")
})

app.post("/addCountry", (req, res) => {
    var myQuery = {
        sql: 'INSERT INTO country VALUES (?, ?, ?)',
        values: [req.body.co_code, req.body.co_name, req.body.co_details]
    }
    pool.query(myQuery)
        .then((data) => {
            console.log(data)
        })
        .catch((error) => {
            console.log(error)
        })
})
app.get('/cities/:cty_code', (req, res) => {
    var newQuery = {
        sql: 'select * from city where population = 98469;',
        values: [req.body.population]
    }
    pool.query(newQuery)
        .then((result) => {
            res.send(result)
        })
        .catch((error) => {
            res.send(error)
        })
})
app.get('/cities', (req, res) => {
    cities.getCities()
        .then((result) => {
            res.render('cities', { cities: result })
        })
        .catch((error) => {
            res.send(error)
        })
})



app.listen(3000, () => {
    console.log(`Example app listening at http://localhost:${3000}`)
})
