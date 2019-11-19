const http = require('http');
var express = require('express');
var db = require('./models/database.js');
var routes = require('./routes/routes.js');
var bodyParser = require('body-parser');


var app = express();
const hostname = '127.0.0.1';
const port = 80;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', routes.get_login);
app.get('/signup', routes.get_signup);
app.get('/clear', routes.clear);
app.post('/createaccount', routes.create_account);
app.post('/checklogin', routes.check_login);
app.post('/createevent', routes.create_event);

server = app.listen(port);
console.log(`Server running at http://${hostname}:${port}/`);

