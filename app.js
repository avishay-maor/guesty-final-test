/**
 * Created by avishaymaor on 04/07/2017.
 */
const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    Listing = require('./api/models/guestyModel'),
    bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/guesty');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


const routes = require('./api/routes/guestyRouet');
routes(app);


app.listen(port);

console.log('API server started on: ' + port);