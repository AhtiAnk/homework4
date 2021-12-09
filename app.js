const express = require('express'); 
const pool = require('./database'); 
 
const app = express(); 
 
app.set('view engine', 'ejs'); 
 
app.use(express.json()); 
 
app.listen(3000, () => { 
    console.log("Server is listening to port 3000") 
});