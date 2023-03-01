require('rootpath')();
require("dotenv").config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const methodOverride = require('method-override');
const cors = require('cors');


require('./database');


const app = express();

const usersRoutes = require('./routes/usersindex');
const photosRoutes = require('./routes/photosindex');
const collectionRoutes = require('./routes/collectionindex');
const workRoutes = require('./routes/workindex');

const whiteList = [process.env.ORIGIN1, process.env.ORIGIN2];

// middlewares

app.use(cors({
    origin: function(origin, callback) {
        if(!origin || whiteList.includes(origin)) {
            return callback(null, origin);
        }
        return callback("Cors Error Origin: " + origin + " Unauthorized");
    },
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(methodOverride('_method'));


// static files
app.use('/images', express.static(path.join(__dirname, 'images')));

// routes
app.use('/users', usersRoutes);
app.use('/photos', photosRoutes);
app.use('/collections', collectionRoutes);
app.use('/works', workRoutes);

//global error handler

// start server
//const PORT = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
//const server = app.listen(PORT, function () {
//    console.log('hhttp://shikhman.org.s3-website-us-east-1.amazonaws.com:' + PORT);
//});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("http://localhost:" + PORT));
