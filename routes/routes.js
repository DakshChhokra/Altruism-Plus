const db = require('../models/database.js');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

const saltRounds = 10; // constant needed for bcrypt hash

var getRecommended = function(req, res) {
	var charityName = req.session.user;
	console.log(charityName);
	getRecommendedHelper(charityName, res);
};

async function getRecommendedHelper(charityName, res) {
	console.log(charityName);
	var charityObject = await getCharity(charityName);

	var allDonorsWhichMatchPref = await donorPref(charityObject.need);
	allDonorsWhichMatchPref.filter((item, index) => allDonorsWhichMatchPref.indexOf(item) === index);

	var allDonorsWhichMatchLocation = await donorLocation(charityObject.location);
	allDonorsWhichMatchLocation.filter((item, index) => allDonorsWhichMatchLocation.indexOf(item) === index);

	if (allDonorsWhichMatchLocation.length > allDonorsWhichMatchPref.length) {
		var perfectMatch = allDonorsWhichMatchPref.slice();
		allDonorsWhichMatchLocation.filter((value) => -1 !== allDonorsWhichMatchLocation.indexOf(value));
	} else {
		var perfectMatch = allDonorsWhichMatchLocation.slice();
		perfectMatch.filter((value) => -1 !== allDonorsWhichMatchPref.indexOf(value));
	}

	res.render('reccCharities.ejs', {
		input: {
			donorsPerfect: perfectMatch,
			donorsPreference: allDonorsWhichMatchPref,
			donorsLocation: allDonorsWhichMatchLocation
		}
	});
}

function donorLocation(charitylocation) {
	return db.DonorModel.find({ location: charitylocation }).exec();
}
function donorPref(charitypref) {
	return db.DonorModel.find({ preferredCategory: charitypref }).exec();
}

var getHome = function(req, res) {
	// initiateDB();
	// otherFunctionToTestDB();
	// moreTestingCrapInThisProductionWorthApplication();
	res.render('otherHome.ejs');
};

async function otherFunctionToTestDB() {
	var getDaksh = await getCharity('daksh');
	var t1 = {
		from: 'Jules Saladana',
		to: 'daksh',
		resource: '10Blankets',
		timeStamp: new Date().toISOString()
	};

	var t2 = {
		from: 'Jules Saladana',
		to: 'daksh',
		resource: '3Pants',
		timeStamp: new Date().toISOString()
	};
	getDaksh.transactionHistory.push(t1);
	getDaksh.transactionHistory.push(t2);
	var stat = await getDaksh.save();
	console.log('sneaky ops done');
}

async function moreTestingCrapInThisProductionWorthApplication() {
	const resource = new db.ResourceModel({
		name: '20DumbPhones',
		count: 20,
		category: 'Electronics',
		description: '20 Non Smart Phones',
		status: 'Offered',
		photo: '',
		promoted: true
	});
	var resourceConf = resource.save();

	const resourceDuo = new db.ResourceModel({
		name: '1GoldBar',
		count: 1,
		category: 'Valuabled',
		description: '1 Gold Bar which completely pure, and totally not a scam. Believe me.',
		status: 'Claimed',
		photo: '',
		promoted: false
	});
	var resourceDuoConf = resourceDuo.save();
}
var postRequestTransactionHistoryCharity = function(req, res) {
	var charityName = req.body.charityName;
	printCharities(charityName, res);
};

var postRequestTransactionHistoryDonor = function(req, res) {
	var donorName = req.body.donorName;
	printDonor(donorName, res);
};

var postAllDonorsAndCharities = function(req, res) {
	getAllCharitiesAndDonors(res);
};

var getTransactionHistoryFromAll = function(req, res) {
	if (req.query.type == 'charity') {
		printCharities(req.query.charityName, res);
	} else {
		printDonor(req.query.donorName, res);
	}
};

var getAdminView = function(req, res) {
	res.render('adminView.ejs');
};
var postAdminViewProcessing = function(req, res) {
	if (req.body.email == sampleEmail && req.body.password == samplePassword) {
		if (req.body.TypeOfData == 'Charities') {
			db.CharityModel.findOne({ name: req.body.inputData }, (err, document) => {
				if (err) return console.log(err);
				document.remove();
				res.send(`Record with name ${req.body.inputData} is found and has been deleted`);
			});
		} else if (req.body.TypeOfData == 'Donors') {
			db.DonorModel.findOne({ name: req.body.inputData }, (err, document) => {
				if (err) return console.log(err);
				document.remove();
				res.send(`Record with name ${req.body.inputData} is found and has been deleted`);
			});
		} else if (req.body.TypeOfData == 'Resources') {
			db.ResourceModel.findOne({ name: req.body.inputData }, (err, document) => {
				if (err) return console.log(err);
				document.remove();
				res.send(`Record with name ${req.body.inputData} is found and has been deleted`);
			});
		} else {
			res.send('Sorry, Transactions cannot be altered.');
		}
	} else {
		res.send('Sorry! Incorrect Credentials. Please go back and try again');
	}
};

function getAllCharities() {
	return db.CharityModel.find().exec();
}

function getAllDonors() {
	return db.DonorModel.find().exec();
}

function getCharity(charityName) {
	return db.CharityModel.findOne({ name: charityName }).exec();
}
function getDonor(donorName) {
	return db.DonorModel.findOne({ name: donorName }).exec();
}

function transactionForCharity(charityName) {
	return db.TransactionModel.find({ to: charityName }).exec();
}

function transactionForDonor(donorName) {
	return db.TransactionModel.find({ from: donorName }).exec();
}

function updateTransactionHistoryForCharity(charityID, transactionID) {
	db.CharityModel
		.findByIdAndUpdate(charityID, { $push: { transactionHistory: transactionID } }, { new: true })
		.exec();
}

function updateTransactionHistoryForDonor(donorID, transactionID) {
	db.DonorModel.findByIdAndUpdate(donorID, { $push: { transactionHistory: transactionID } }, { new: true }).exec();
}

async function printCharities(charityName, res) {
	var charityObject = await getCharity(charityName);
	// var transactionHistory = await transactionForCharity(charityObject.name);
	res.render('singleCharityView.ejs', {
		input: { name: charityObject.name, transactionHistory: charityObject.transactionHistory }
	});
}

async function printDonor(donorName, res) {
	var donorObject = await getDonor(donorName);
	// var transactionHistory = await transactionForDonor(donorObject.name);
	res.render('singleDonorView.ejs', {
		input: { name: donorObject.name, transactionHistory: donorObject.transactionHistory }
	});
}

async function getAllCharitiesAndDonors(res) {
	var allCharities = await getAllCharities();
	var allDonors = await getAllDonors();
	res.render('allCharitiesAndDonors.ejs', { input: { charities: allCharities, donors: allDonors } });
}

async function initiateDB() {
	var transaction1 = {
		from: 'Joe Schmoe',
		to: 'McCharity Charity',
		resource: '10Blankets',
		timeStamp: new Date().toISOString()
	};
	var transaction2 = {
		from: 'Joe Schmoe',
		to: 'McCharity Charity',
		resource: '3Pants',
		timeStamp: new Date().toISOString()
	};
	var transaction3 = {
		from: 'Jules Saladana',
		to: 'Damn',
		resource: '3Pants',
		timeStamp: new Date().toISOString()
	};
	var transaction4 = {
		from: 'Jules Saladana',
		to: 'Damn',
		resource: '10Blankets',
		timeStamp: new Date().toISOString()
	};

	const charityOne = new db.CharityModel({
		name: 'McCharity Charity',
		password: '1231231l31.madso12-o31=20o31',
		need: 'Blankets',
		location: 'Gibraltar',
		description: 'itts 2010. rage comics are back bby',
		photo: '',
		transactionHistory: [ transaction1, transaction2 ],
		preferredDonors: []
	});
	var c1 = await charityOne.save();

	const charityTwo = new db.CharityModel({
		name: 'Damn',
		password: '1231231l31.madso12-o31=20o31',
		need: 'Food',
		location: 'Midway Islands',
		description: 'nah, there is no description',
		photo: '',
		transactionHistory: [ transaction3, transaction4 ],
		preferredDonors: []
	});

	var c2 = await charityTwo.save();

	const donorOne = new db.DonorModel({
		name: 'Joe Schmoe',
		password: '7821391b92jklsa',
		location: 'Philadelphia',
		preferredCategory: 'Blankets',
		transactionHistory: [ transaction1, transaction2 ],
		photo: '',
		description: 'Sells furniture',
		friends: [],
		preferredCharities: []
	});

	var d1 = donorOne.save();

	const donorTwo = new db.DonorModel({
		name: 'Jules Saladana',
		password: '7821391b92jklsa',
		location: 'New York',
		preferredCategory: 'Blankets',
		transactionHistory: [ transaction3, transaction4 ],
		photo: '',
		description: 'Fixes electronics',
		friends: [],
		preferredCharities: []
	});

	var d2 = donorTwo.save();

	const resourceOne = new db.ResourceModel({
		name: '10Blankets',
		count: 10,
		category: 'Essentials',
		description: 'Non threadbare blankets',
		status: 'Delivered',
		photo: '',
		promoted: false
	});
	var r1 = resourceOne.save();

	const resourceTwo = new db.ResourceModel({
		name: '3Pants',
		count: 3,
		category: 'Clothing',
		description: 'Denim Pants',
		status: 'Claimed',
		photo: '',
		promoted: true
	});
	var r2 = resourceTwo.save();
}

var getLogin = function(req, res) {
	req.session.user = null;
	var errString = req.query.error;
	res.render('login.ejs', { loginError: errString });
};

var getSignup = function(req, res) {
	req.session.user = null;
	var errString = req.query.error;
	res.render('signup.ejs', { signupError: errString });
};

var createAccount = function(req, res) {
	var name = req.body.username;
	var password = req.body.password;
	var need = req.body.need;
	var location = req.body.location;
	var description = req.body.description;

	req.session.user = name;
	if (!name || !password || name === '' || password === '') {
		// throw error if any field is blank
		var signUpErr = encodeURIComponent('One or more fields left blank.');
		res.redirect('/signup/?error=' + signUpErr);
	}

	db.userLookup(name, function(data1, err) {
		if (err) {
			var signUpErr = encodeURIComponent('Error signing up. Please try again.');
			res.redirect('/signup/?error=' + signUpErr);
		} else if (data1) {
			// user already exists in database
			var uExists = encodeURIComponent('Username ' + data1.name + ' already exists.');
			res.redirect('/signup/?error=' + uExists);
		} else {
			bcrypt.hash(password, saltRounds, function(err, hash) {
				if (err) {
					var signUpErr = encodeURIComponent('Error hashing password');
					res.redirect('/signup/?error=' + signUpErr);
				} else {
					db.userPut(name, hash, need, location, description);
					//res.session.user = name; // to allow current use to enter homepage
					req.session.user = name;
					res.render('landingPage.ejs');
				}
			});
		}
	});
	//var errString = req.query.error;
	//res.render('home', {signupError: errString});
};

var clear = function(req, res) {
	db.userClear();
	res.render('home.ejs');
};

var checkLogin = function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	if (!username || !password || username === '' || password === '') {
		// if any fields are blank, give an error
		var errString = encodeURIComponent('One or more fields are blank.');
		res.redirect('/?error=' + errString);
	} else {
		db.userLookup(username, function(data, err) {
			if (err) {
				var errString = encodeURIComponent('Error while logging in. Please try again.');
				res.redirect('/?error=' + errString);
			} else if (!data) {
				var incorrectUorP = encodeURIComponent('Username or password incorrect.');
				res.redirect('/?error=' + incorrectUorP);
			} else {
				console.log(data.password);
				bcrypt.compare(password, data.password, function(err, result) {
					if (err) {
						var errStr = encodeURIComponent('Error finding password in database. Please try again.');
						res.redirect('/?error=' + errStr);
					} else if (data && result) {
						// match password hash to one stored in database
						req.session.user = username;
						//res.redirect("/homepage");
						res.render('landingPage.ejs');
					} else {
						// incorrect username or password
						var incorrectUorP = encodeURIComponent('Username or password incorrect.');
						res.redirect('/?error=' + incorrectUorP);
					}
				});
			}
		});
	}
};

var createEvent = function(req, res) {
	var eventName = req.body.eventName;
	var eventOwner = req.session.user;
	//console.log(eventOwner);
	var eventNeed = req.body.eventNeed;
	var eventLocation = req.body.eventLocation;
	var eventDescription = req.body.eventDescription;
	if (!eventName || !eventDescription || eventName === '' || eventDescription === '') {
		// throw error if any field is blank
		var signUpErr = encodeURIComponent('One or more fields left blank.');
		// res.redirect('/signup/?error=' + signUpErr);
		res.redirect('/homeAfterFormSubmission');
		return;
	}

	db.eventLookup(eventName, function(data1, err) {
		if (err) {
			var signUpErr = encodeURIComponent('Error Creating Event. Please try again.');
			res.redirect('/signup/?error=' + signUpErr);
		} else if (data1) {
			// event already exists in database
			var evExists = encodeURIComponent('Event name ' + data1.name + ' already exists.');
			// res.redirect('/signup/?error=' + evExists);
			res.redirect('/homeAfterFormSubmission');
		} else {
			db.eventPut(eventName, eventOwner, eventNeed, eventLocation, eventDescription, function() {
				res.redirect('/homeAfterFormSubmission');
			});
		}
	});
};

var eventsPage = function(req, res) {
	res.redirect('/homeAfterFormSubmission');
};

var sendNotification = function(req, res) {
	var string = req.body.info;
	var array = string.split('*');
	var requester = array[0];
	var eventName = array[1];
	var eventOwner = array[2];
	console.log(string);
	db.addNotification(eventOwner, requester, eventName, function() {
		res.redirect('/homeAfterFormSubmission');
	});
};

var getPrefAndInfo = function(req, res) {
	res.render('updatePrefs.ejs', { input: req.session.user });
};
var postPrefAndInfo = function(req, res) {
	console.log(req.body);
	postPrefAndInfoHelper(req, res);
};

async function postPrefAndInfoHelper(req, res) {
	let charityObj = await db.CharityModel.findOne({ name: req.session.user });
	if (req.body.need.length > 0) {
		charityObj.need = req.body.need;
	}
	if (req.body.description.length > 0) {
		charityObj.description = req.body.description;
	}
	if (req.body.location.length > 0) {
		charityObj.location = req.body.location;
	}
	var co = await charityObj.save();
	res.render('landingPage.ejs');
}

var getdonationStatus = function(req, res) {
	getdonationStatusHelper(req, res);
};

async function getdonationStatusHelper(req, res) {
	var charityObject = await getCharity(req.session.user);
	var transactionHistoryList = charityObject.transactionHistory;
	var listOfResources = [];
	for (let index = 0; index < transactionHistoryList.length; index++) {
		var resourceBound = await getResource(transactionHistoryList[index].resource);
		listOfResources.push(resourceBound);
	}
	res.render('donationStatus.ejs', { input: { resources: listOfResources } });
}

var postMarkDonationAsRecieved = function(req, res) {
	console.log('req.body.result', req.body.result);
	postMarkDonationAsRecievedHelper(req, res);
};

async function postMarkDonationAsRecievedHelper(req, res) {
	var resource = await getResource(req.body.result);
	console.log('resource', resource);
	resource.status = 'Delivered';
	var afterUpdate = await resource.save();
	res.render('landingPage.ejs');
}

function getResource(resourceName) {
	return db.ResourceModel.findOne({ name: resourceName }).exec();
}

var confirmNotification = function(req, res) {
	var string = req.body.result;
	var array = string.split('*');
	var eventName = array[0];
	var result = array[1];
	var requesterName = array[2];

	console.log(string);

	db.removeNotification(req.session.user, requesterName, eventName, result, function() {
		if (result == 'yes') {
			db.addBeneficiary(requesterName, eventName, function() {
				res.redirect('/homeAfterFormSubmission');
			});
		} else {
			res.redirect('/homeAfterFormSubmission');
		}
	});
};

var homeAfterFormSubmission = function(req, res) {
	db.getEventModel().find().then((docs) => {
		db.userLookup(req.session.user, function(userObj, err) {
			res.render('home.ejs', {
				input: {
					events: docs,
					user: req.session.user,
					requestedHist: userObj.requestedHistory,
					notifications: userObj.notificationHistory
				}
			});
		});
	});
};

var getAllCharities = function(req, res) {
	getAllCharitiesHelper(res);
};

async function getAllCharitiesHelper(res) {
	var list = await allCharities();
	res.json({ list: list });
}
function allCharities() {
	return db.CharityModel.find().exec();
}

var addDonor = function(req, res) {
	addDonorHelper(req, res);
};

async function addDonorHelper(req, res) {
	var AD = new db.DonorModel({
		name: req.body.name,
		password: req.body.password
	});
	var fuckKD = AD.save((err, doc) => {
		if (err) {
			console.log('ERROR!', err);
			res.send({ status: 'FAILED' });
		}
	});

	res.send({ status: 'SUCCESFUL' });
}

var getAllDonorsPath = function(req, res) {
	getAllDonorsHelper(req, res);
};

async function getAllDonorsHelper(req, res) {
	var allBigDs = await getAllDonorsMongoose();
	res.json({ input: allBigDs });
}

function getAllDonorsMongoose() {
	return db.DonorModel.find().exec();
}

var getRemoveDonor = function(req, res) {
	getRemoveDonorHelper(req, res);
};
async function getRemoveDonorHelper(req, res) {
	console.log(req.query.name);
	const some = await db.DonorModel.deleteOne({ name: req.query.name }, (err, doc) => {
		if (err) {
			res.json({ status: 'shit failed yo' });
		}
		res.json({ status: 'shit worked my dude' });
	});
}

var getallDonorsLink = function(req, res) {
	getallDonorsHelper(res);
};

async function getallDonorsHelper(res) {
	var allDonors = await getAllDonors();
	res.json(allDonors);
}

var addImageForRoutes = function(req, res) {
	addImageHelper(req, res);
};

async function addImageHelper(req, res) {
	db.updatePhoto(req.body.name, req.body.photo);
}

var getViewAllDonations = function(req, res) {
	getAllResources(req, res);
};

async function getAllResources(req, res) {
	var allResources = await getAllResourcesThree();
	// res.send(allResources);
	res.render('allDonations.ejs', { input: { allAvailableResources: allResources } });
}

function getAllResourcesThree() {
	return db.ResourceModel.find({ $or: [ { status: 'Offered' }, { status: 'Claimed' } ] }).exec();
}

var routes = {
	getHome: getHome,
	postRequestTransactionHistoryCharity: postRequestTransactionHistoryCharity,
	postRequestTransactionHistoryDonor: postRequestTransactionHistoryDonor,
	postAllDonorsAndCharities: postAllDonorsAndCharities,
	getTransactionHistoryFromAll: getTransactionHistoryFromAll,
	getAdminView: getAdminView,
	postAdminViewProcessing: postAdminViewProcessing,
	get_login: getLogin,
	get_signup: getSignup,
	create_account: createAccount,
	check_login: checkLogin,
	clear: clear,
	create_event: createEvent,
	events_page: eventsPage,
	send_notification: sendNotification,
	confirm_notification: confirmNotification,
	getRecommended: getRecommended,
	getPrefAndInfo: getPrefAndInfo,
	postPrefAndInfo: postPrefAndInfo,
	getdonationStatus: getdonationStatus,
	postMarkDonationAsRecieved: postMarkDonationAsRecieved,
	home_after_form_submission: homeAfterFormSubmission,
	getAllCharities: getAllCharities,
	addDonor: addDonor,
	getAllDonors: getAllDonorsPath,
	getRemoveDonor: getRemoveDonor,
	getallDonors: getallDonorsLink,
	addImage: addImageForRoutes,
	getViewAllDonations: getViewAllDonations
};

module.exports = routes;
