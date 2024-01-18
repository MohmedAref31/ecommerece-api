
const mongoose = require("mongoose")


const dbConnection = ()=>{
    mongoose.connect(process.env.DB_URL)
        .then(c=>{
            console.log(`Database connected on : ${c.connection.host}`)
        }).catch(e=>{
            console.log(`Database error: ${e}`)
            process.exit(1)
        })
    }

module.exports = dbConnection


