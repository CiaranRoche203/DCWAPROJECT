//import the mongodb documentation to connect. Set url connection
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
//state the names of the db and collection and assign them variable names
const dbName = 'headsOfStateDB'
const collName = 'headsOfState'

var headsOfStateDB
var headsOfState
//connect to mongodb
MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((client)=>{
        headsOfStateDB =client.db(dbName)
        headsOfState = headsOfStateDB.collection(collName)

    })
    .catch((error)=>{
        console.log(error)
    })
//function to get the heads of state for each country. 
var getHeadOfState = function(){
    return new Promise((resolve, reject)=>{
        var cursor = headsOfState.find()
        cursor.toArray()
        .then((documents)=>{
            resolve(documents)
        })
        .catch((error)=>{
            reject(error)
        })
    })

}
var addHeadOfState = function(_id, headOfState){
    return new Promise((resolve, reject)=>{
        headsOfState.insertOne({"_id":_id, "headOfState":headOfState})
        .then((result)=>{
            resolve(result)
        })
        .catch((error)=>{
            reject(error)
        })
    })
}
module.exports = {getHeadOfState, addHeadOfState}