const express = require('express');

const app = express();
const path = require('path');
const cors = require('cors');

const PORT = process.env.PORT || 3000 || 5000 || 5500;
app.use(express.static('public'));

const connectDB = require('./config/db');
connectDB();

//cors for protection

/*
const corsOptions= {
    origin: process.env.ALLOWED_CLIENTS.split(',') 
    //website for cross server like localhost, heroku-git

}
app.use(cors(corsOptions));
*/

//new cors allowance

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

//template engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

//Routes
app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});