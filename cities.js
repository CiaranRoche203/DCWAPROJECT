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

    module.exports = { getCities, cityDetails }