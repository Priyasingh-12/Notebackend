 
const express = require('express');
const app = express();            
var cors = require('cors')   
const dotenv = require("dotenv");

 const cookieParser = require('cookie-parser');

 dotenv.config({ path: './config.env' });
 
   require('./db/conn');

   app.use(express.json());             //convert json tpo object data 
   app.use(cors())
   app.use(cookieParser());


//we link the router files to make our route easy
 app.use("/api/auth", require('./router/auth'));


 const PORT = process.env.PORT;

// ==========        middleware===================           to check wherter it is login with authentication in about
// app.use(express.cookieParser())
// app.use(express.cookieSession())

 app.listen(PORT, () => {
     console.log(`server is running at port no ${PORT}`);
 })
