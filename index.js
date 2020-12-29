//imports that are required in order to access other js pages and express features
const express = require('express')
var mySQLDAO = require('./mySQLDAO')
var ejs = require('ejs')
var bodyParser = require('body-parser')
const app = express()
//import to access mysql
var mysql = require('promise-mysql')
var mongoDAO = require('./mongoDAO')
//creating the databse connection

//use of body parser for web app functionality
app.use(bodyParser.urlencoded({ extended: false }))

//used so we can view the web pages
app.set('view engine', 'ejs')

//home page get method
app.get('/', (req, res) => {
    //render the home page
   res.render("home")
})
//get method for countries where we display all the countries on one page
app.get('/countries', (req, res) => {
    //access the mySQLDAO.js page and use the get countries function
    mySQLDAO.getCountries()
    //send a result in a try catch statement
        .then((result) => {
            //displaying the result
            console.log(result)
            res.render('countries', { countries: result })
        })
        //should the user not be able to connect to the database display this message
        .catch((error) => {
            res.send('<h3>Error Cannot Connect to database! </h3')
        })
})

//get method for getting an individual country and deleting it
app.get('/countries/:co_code', (req, res) => {
    //delete the country based on the co_code
    mySQLDAO.deleteCountry(req.params.co_code)
        .then((result) => {
            //if the country doesnt exist send this
            if (result.affectedRows == 0) {
                res.send("<h3>Country: " + req.params.co_code + " doesnt exist")
            }
            //otherwise say that it was deleted 
            else {
                res.send("<h3> Country: " + req.params.co_code + " deleted")
            }
            //send the result
            res.send(result);
        })
        //error should there be an issue with deleting an existing country that is referenced in another table
        .catch((err) => {
            if (err.code == "ER_ROW_IS_REFERENCED_2") {
                res.send("<h3> ERROR: " + err.errno + " cannot delete country with ID:" + req.params.co_code + " as it has cities");
            }
            else {
                res.send("<h3> ERROR: " + err.errno + " " + error.sqlMessage)
            }
        })
})


//rendering the add country page
app.get('/addCountry', (req, res) => {
    res.render("addCountry")
})

//rendering the update country page
app.get('/updateCountry/:co_code', (req, res) => {
    mySQLDAO.getCountries(req.params.co_code)
    .then((result)=>{
        //if the result is not null essentially, send the country to edit back
        if(result.length > 0){
            console.log(result)
            res.render("update", {countries: result[0]})
        }
        //otherwise it does not exist
        else{
            res.send("<h3> No such country exists </h3>")
        }
      
    })
    //error should this fail
    .catch((error)=>{
        res.send(error)
    })
})

//post method to post the query result to the server
app.post("/updateCountry", (req, res) => {
    //update the country and pass the following parameters
    mySQLDAO.updateCountry(req.body.co_name, req.body.co_details, req.body.co_code)
        .then((data) => {
            //redirect to the main countries page
            res.redirect('/countries')
        })
        .catch((error) => {
            console.log(error)
        })
})

//post method to post the details of the query to the server
app.post("/addCountry", (req, res) => {
    //add the following parameters to the record and record in the databse
    mySQLDAO.addCountry(req.body.co_code, req.body.co_name, req.body.co_details)
        .then((data) => {
            //return user to countries page
            res.redirect('/countries')
            console.log(data)
        })
        //error 
        .catch((error) => {
           res.send('<h3>Country already exists </h3')
        })
})

//cities individual method
//used to get one citys individual data on a page
app.get('/cities/:cty_code', (req, res) => {
    mySQLDAO.cityDetails(req.params.cty_code)
    .then((result) => {
        //display the cities details based on cty_code
        res.render('allcities', {cities: result})
    })
    .catch((error) => {
        res.send(error)
    })
})

//get method to get all the cities details on one page
app.get('/cities', (req, res) => {
    mySQLDAO.getCities()
        .then((result) => {
            res.render('cities', { cities: result })
        })
        .catch((error) => {
            res.send('<h3>Error Cannot Connect to database! </h3')
        })
})
//getting the view page of the heads of state and rendering it for view
app.get('/headofstate', (req, res) => {
    mongoDAO.getHeadOfState()
    .then((documents)=>{
        //rendering the head of state page
        res.render('headofstate', {headofstate: documents})
    })
    .catch((error)=>{
        res.send(error)
    })
  })
//rendering the head of state page
app.get('/addHeadOfState', (req, res) => {
    res.render("addHeadOfState")
})

//post method to send the result of the query to the view page
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
