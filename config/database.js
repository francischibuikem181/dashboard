//const mysql = require ('mysql2/promise');
const { Pool } = require('pg')
require('dotenv').config();

// //connection pool

// // const pool = mysql.createPool({
// //     host: process.env.DB_HOST|| 'localhost',
// //     user: process.env.DB_USER ||'root',
// //     password: process.env.DB_PASSWORD ||  '',
// //     database: process.env.DB_NAME2,
// //     waitForConnections:true,
// //     connectionLimit: 20,
// //     queueLimit: 0
// // })

// const pool = new Pool({
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER ||'root',
//     password: process.env.DB_PASSWORD || '',
//     database: process.env.DB_NAME2,
//     waitForConnections: true,
//     connectionLimit: 20,
//     queueLimit: 0

// })
// module.exports = pool;

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME2,
})

const createTablesQuery = `
    CREATE TABLE IF NOT EXISTS users (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
name VARCHAR(255),
email VARCHAR(255),
password VARCHAR(255)
);


 CREATE TABLE IF NOT EXISTS testusers (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
firstname VARCHAR(255),
lastname VARCHAR(255),
email VARCHAR(255),
password VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS profiles (
id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
userid UUID REFERENCES users(id) on DELETE CASCADE,
profileimage VARCHAR(255),
mobilenumber VARCHAR(255),
gender VARCHAR(255),
dob VARCHAR(200),
address VARCHAR(255)
);
`;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               

pool.connect((err, client, release)=>{
    if(err){
        return console.error("connection error:",err.stack);
    }
    console.log("connected to postgreSGL database");
    
    client.query(createTablesQuery, (queryErr, res) =>{
   release() ;  // Always release the client back to the pool
   if (queryErr){
    console.error ("Error creating tables:", queryErr.stack);
   }else{
    console.log("Database tables verified/created successfully.");
   }
    });
});
module.exports=   pool;