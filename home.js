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
    //get countries function
var getCountries = function () {
     //return a new promise
    return new Promise((resolve, reject) => {
         //query then sends a result
        pool.query('select * from country;')
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
       var newQuery ={
        sql: 'update country set co_name =?, co_details=? where co_code =?',
        values: [co_name, co_details, co_code]
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

//exporting the modules so they can be accessed in the index. js page
    module.exports = { getCountries, deleteCountry, updateCountry }