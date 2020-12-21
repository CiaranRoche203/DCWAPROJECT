//imports that are required in order to access other js pages and express features
const express = require('express')
var home = require('./home')
var cities = require('./cities')
var ejs = require('ejs')
var bodyParser = require('body-parser')
const app = express()
//import to access mysql
var mysql = require('promise-mysql')
var mongoDAO = require('./mongoDAO')
//creating the databse connection
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
    //use of body parser for web app functionality
app.use(bodyParser.urlencoded({ extended: false }))
//used so we can view the web pages
app.set('view engine', 'ejs')
//home page get method
app.get('/', (req, res) => {
   res.render("home")
})
//getting the view page of the heads of state and rendering it for view
app.get('/headofstate', (req, res) => {
   mongoDAO.getHeadOfState()
   .then((documents)=>{
       res.render('headofstate', {headofstate: documents})
   })
   .catch((error)=>{
       res.send(error)
   })
 })
//get method for countries where we display all the countries on one page
app.get('/countries', (req, res) => {
    home.getCountries()
        .then((result) => {
            console.log(result)
            res.render('countries', { countries: result })
        })
        .catch((error) => {
            res.send('<h3>Error Cannot Connect to database! </h3')
        })
})
//get method for getting an individual country and deleting it
app.get('/countries/:co_code', (req, res) => {
    //res.send(req.params.co_code)
    home.deleteCountry(req.params.co_code)
        .then((result) => {
           res.redirect('/countries')
        })
        .catch((error) => {
            res.send('<h3>Country has cities, cannot be deleted </h3')
        })
})
//rendering the add country page
app.get('/addCountry', (req, res) => {
    res.render("addCountry")
})
//rendering the update country page
app.get('/updateCountry/:co_code', (req, res) => {
    home.getCountries(req.params.co_code)
    .then((result)=>{
        console.log(result)
        res.render("update", {countries: result[0]})
    })
    .catch((error)=>{
        res.send(error)
    })
})
/*app.get('/updateCountry/:co_code', (req, res) => {
        res.render('update');
   
})*/
//post method to post the query result to the server
app.post("/updateCountry", (req, res) => {
    var myQuery = {
        sql: 'update country set co_name =?, co_details=? where co_code =?',
        values: [req.body.co_name, req.body.co_details, req.body.co_code]
    }
    pool.query(myQuery)
        .then((data) => {
            //res.send(data)
            res.redirect('/countries')
        })
        .catch((error) => {
            console.log(error)
        })
})
//post method to post the details of the query to the server
app.post("/addCountry", (req, res) => {
    var myQuery = {
        sql: 'INSERT INTO country VALUES (?, ?, ?)',
        values: [req.body.co_code, req.body.co_name, req.body.co_details]
    }
    pool.query(myQuery)
        .then((data) => {
            res.redirect('/countries')
            console.log(data)
        })
        .catch((error) => {
           res.send('<h3>Country already exists </h3')
        })
})
//cities individual method
//used to get one citys individual data on a page
app.get('/cities/:cty_code', (req, res) => {
    cities.cityDetails(req.params.cty_code)
    .then((result) => {
        res.render('allcities', {cities: result})
    })
    .catch((error) => {
        res.send(error)
    })
})
//get method to get all the cities details on one page
app.get('/cities', (req, res) => {
    cities.getCities()
        .then((result) => {
            res.render('cities', { cities: result })
        })
        .catch((error) => {
            res.send('<h3>Error Cannot Connect to database! </h3')
        })
})
//rendering the head of state page
app.get('/addHeadOfState', (req, res) => {
    res.render("addHeadOfState")
})
//post mehtod to send the result of the query to the view page
app.post('/addHeadOfState', (req, res)=>{
    mongoDAO.addHeadOfState(req.body._id, req.body.headOfState)
    .then((result)=>{
        res.redirect('/headofstate')
    }).catch((error)=>{
        res.send('<h3>Error Cannot Connect to database! </h3')
    })
})

//listening at port 300 for a connection
app.listen(3000, () => {
    console.log(`Example app listening at http://localhost:${3000}`)
})
