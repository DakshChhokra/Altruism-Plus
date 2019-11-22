const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var routes = require('./routes/routes.js');
const session = require('express-session');

var port = process.env.PORT || 3000;
var server = app.listen(port, () => {
	console.log('Server started on port ' + port);
});

//Use Object Id - instead ofreq.session.user = null;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	session({
		secret: 'shhhhhhh',
		proxy: true,
		resave: true,
		saveUnintialized: true
	})
);

app.use(express.static(__dirname + '/public'));

//Daksh

app.get('/home', routes.getHome);

app.post('/requestTransactionHistoryCharity', routes.postRequestTransactionHistoryCharity);

app.post('/requestTransactionHistoryDonor', routes.postRequestTransactionHistoryDonor);

app.post('/allDonorsAndCharities', routes.postAllDonorsAndCharities);

app.get('/transactionHistoryFromAll', routes.getTransactionHistoryFromAll);

app.get('/adminView', routes.getAdminView);

app.post('/adminViewProcessing', routes.postAdminViewProcessing);

app.get('/getRecommended', routes.getRecommended);

app.get('/updatePrefAndInfo', routes.getPrefAndInfo);

app.post('/updatePrefAndInfo', routes.postPrefAndInfo);

app.get('/donationStatus', routes.getdonationStatus);

app.post('/markDonationAsRecieved', routes.postMarkDonationAsRecieved);

//Arthur

app.get('/', routes.get_login);

app.get('/signup', routes.get_signup);

app.get('/clear', routes.clear);

app.get('/homeAfterFormSubmission', routes.home_after_form_submission);

app.post('/createaccount', routes.create_account);

app.post('/checklogin', routes.check_login);

app.post('/createevent', routes.create_event);

app.post('/eventspage', routes.events_page);

app.post('/sendnotification', routes.send_notification);

app.post('/confirmnotification', routes.confirm_notification);
