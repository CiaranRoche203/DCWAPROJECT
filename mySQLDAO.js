//creating a connection to mysql 
var mysql = require('promise-mysql')

var pool
//linking to the database in question
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
    //get cities function
var getCities = function () {
    //return a new promise
    return new Promise((resolve, reject) => {
        //query then sends a result
        pool.query('select * from city;')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
               reject(error)
            })
        })
}
//get individual cities function
var cityDetails = function (cty_code) {
    //return a new promise
    return new Promise((resolve, reject) => {
         //query then sends a result
        var newQuery ={
            sql: 'select * from city where cty_code = ?',
            values: [cty_code]
        }
        pool.query(newQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var getCountries = function (co_code) {
    //return a new promise
   return new Promise((resolve, reject) => {
        //query then sends a result
        myQuery = (co_code == undefined ? "select * from country": "select * from country where co_code = ?;");
        var queryObj = {
            sql: myQuery,
            values: [co_code]
        }
       pool.query(queryObj)
           .then((result) => {
               resolve(result)
           })
           .catch((error) => {
               reject(error)
           })
   })
}
var addCountry = function (co_code,co_name,co_details) {
    //return a new promise
   return new Promise((resolve, reject) => {
        //query then sends a result
        var myQuery = {
            sql: 'INSERT INTO country VALUES (?, ?, ?)',
            values: [co_code, co_name, co_details]
        }
        pool.query(myQuery)
           .then((result) => {
               resolve(result)
           })
           .catch((error) => {
               reject(error)
           })
   })
}
//delete a country from the database function
var deleteCountry = function (co_code) {
    //return a new promise
   return new Promise((resolve, reject) => {
     //query then sends a result
       var newQuery ={
           sql: 'delete from country where co_code = ?',
           values: [co_code]
       }
       pool.query(newQuery)
           .then((result) => {
               resolve(result)
           })
           .catch((error) => {
               reject(error)
           })
   })
}
var updateCountry = function ( co_name,co_details, co_code) {
   //return a new promise
  return new Promise((resolve, reject) => {
    //query then sends a result
    var myQuery = {
        sql: 'update country set co_name =?, co_details=? where co_code =?',
        values: [co_name, co_details, co_code]
    }
    pool.query(myQuery)
          .then((result) => {
              resolve(result)
          })
          .catch((error) => {
              reject(error)
          })
  })
}


    module.exports = { getCities, cityDetails, getCountries, deleteCountry, updateCountry, addCountry}