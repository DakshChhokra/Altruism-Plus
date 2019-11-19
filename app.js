const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sampleEmail = 'dakshc@seas.upenn.edu';
const samplePassword = 'password';
const models = require('./models/database.js'); 
var routes = require('./routes/routes.js');


var port = process.env.PORT || 3000;
var server = app.listen(port, () => {
	console.log('Server started on port ' + port);
});

//Use Object Id - instead of
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));



//Routes

app.get('/home', routes.getHome);



app.post('/requestTransactionHistoryCharity', routes.postRequestTransactionHistoryCharity);



app.post('/requestTransactionHistoryDonor', routes.postRequestTransactionHistoryDonor);


app.post('/allDonorsAndCharities', routes.postAllDonorsAndCharities);



app.get('/transactionHistoryFromAll', routes.getTransactionHistoryFromAll);

app.get('/adminView', routes.getAdminView);

app.post('/adminViewProcessing', routes.postAdminViewProcessing);


