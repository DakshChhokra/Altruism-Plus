const models = require('../models/database.js'); 
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

var getHome = function (req, res) {
    // initiateDB();
    // testingUpdates(res);
    res.render('home');
};

var postRequestTransactionHistoryCharity = function (req, res) {
    var charityName = req.body.charityName;
	printCharities(charityName, res);
};

var postRequestTransactionHistoryDonor = function (req, res) {
    var donorName = req.body.donorName;
	printDonor(donorName, res);
};

var postAllDonorsAndCharities = function (req, res) {
    getAllCharitiesAndDonors(res);
};

var getTransactionHistoryFromAll = function (req, res) {
    if (req.query.type == 'charity') {
		printCharities(req.query.charityName, res);
	} else {
		printDonor(req.query.donorName, res);
	}
};

var getAdminView = function (req, res) {
    res.render('adminView');
};
var postAdminViewProcessing = function (req, res) {
    if (req.body.email == sampleEmail && req.body.password == samplePassword) {
		if (req.body.TypeOfData == 'Charities') {
			models.CharityModel.findOne({ name: req.body.inputData }, (err, document) => {
				if (err) return console.log(err);
				document.remove();
				res.send(`Record with name ${req.body.inputData} is found and has been deleted`);
			});
		} else if (req.body.TypeOfData == 'Donors') {
			models.DonorModel.findOne({ name: req.body.inputData }, (err, document) => {
				if (err) return console.log(err);
				document.remove();
				res.send(`Record with name ${req.body.inputData} is found and has been deleted`);
			});
		} else if (req.body.TypeOfData == 'Resources') {
			models.ResourceModel.findOne({ name: req.body.inputData }, (err, document) => {
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
}

function getAllCharities() {
	return models.CharityModel.find().exec();
}

function getAllDonors() {
	return models.DonorModel.find().exec();
}

function getCharity(charityName) {
	return models.CharityModel.findOne({ name: charityName }).exec();
}
function getDonor(donorName) {
	return models.DonorModel.findOne({ name: donorName }).exec();
}

function transactionForCharity(charityName) {
	return models.TransactionModel.find({ to: charityName }).exec();
}

function transactionForDonor(donorName) {
	return models.TransactionModel.find({ from: donorName }).exec();
}

function updateTransactionHistoryForCharity(charityID, transactionID) {
	models.CharityModel.findByIdAndUpdate(charityID, { $push: { transactionHistory: transactionID } }, { new: true }).exec();
}

function updateTransactionHistoryForDonor(donorID, transactionID) {
	models.DonorModel.findByIdAndUpdate(donorID, { $push: { transactionHistory: transactionID } }, { new: true }).exec();
}

async function testingUpdates(res) {
	var up1 = await updateTransactionHistoryForCharity(charityOneId, transactionOneId);
	var up2 = await updateTransactionHistoryForCharity(charityOneId, transactionTwoId);
	var up3 = await updateTransactionHistoryForCharity(charityOneId, transactionThreeId);
	var up4 = await updateTransactionHistoryForCharity(charityTwoId, transactionFourId);
	var up5 = await updateTransactionHistoryForCharity(charityTwoId, transactionFiveId);

	var down1 = await updateTransactionHistoryForDonor(donorOneId, transactionOneId);
	var down2 = await updateTransactionHistoryForDonor(donorTwoId, transactionTwoId);
	var down3 = await updateTransactionHistoryForDonor(donorOneId, transactionThreeId);
	var down4 = await updateTransactionHistoryForDonor(donorOneId, transactionFourId);
	var down5 = await updateTransactionHistoryForDonor(donorTwoId, transactionFiveId);
	// res.render('home');
}

async function printCharities(charityName, res) {
	var charityObject = await getCharity(charityName);
	var transactionHistory = await transactionForCharity(charityObject.name);
	res.render('singleCharityView', { input: { name: charityObject.name, transactionHistory: transactionHistory } });
}

async function printDonor(donorName, res) {
	var donorObject = await getDonor(donorName);
	var transactionHistory = await transactionForDonor(donorObject.name);
	res.render('singleDonorView', { input: { name: donorObject.name, transactionHistory: transactionHistory } });
}

async function getAllCharitiesAndDonors(res) {
	var allCharities = await getAllCharities();
	var allDonors = await getAllDonors();
	res.render('allCharitiesAndDonors', { input: { charities: allCharities, donors: allDonors } });
}

function initiateDB() {
	var charityOneId;
	const charityOne = new models.CharityModel({
		name: 'McCharity Charity',
		need: [ 'Wood', 'Iron' ],
		listOfResources: [],
		location: 'Gibraltar',
		description: 'nah, there is no description',
		photo: '',
		transactionHistory: [],
		preferredDonors: []
	});
	charityOne.save((err, object) => {
		charityOneId = object.id;
	});

	var charityTwoId;
	const charityTwo = new models.CharityModel({
		name: 'Damn',
		need: [ 'Blanket', 'Food' ],
		listOfResources: [],
		location: 'Midway Islands',
		description: 'nah, there is no description',
		photo: '',
		transactionHistory: [],
		preferredDonors: []
	});
	charityTwo.save((err, obj) => {
		charityTwoId = obj.id;
	});

	const donorOne = new models.DonorModel({
		name: 'Joe Schmoe',
		location: 'Philadelphia',
		preferredCategory: 'Furniture',
		transactionHistory: [],
		photo: '',
		description: 'Sells furniture',
		excessResources: [],
		friends: [],
		preferredCharities: []
	});

	var donorOneId;
	donorOne.save((err, obj) => {
		donorOneId = obj.id;
	});

	const donorTwo = new models.DonorModel({
		name: 'Jules Saladana',
		location: 'New York',
		preferredCategory: 'Electronics',
		transactionHistory: [],
		photo: '',
		description: 'Fixes electronics',
		excessResources: [],
		friends: [],
		preferredCharities: []
	});

	var donorTwoId;
	donorTwo.save((err, obj) => {
		donorTwoId = obj._id;
	});

	var resourceOneId;
	const resourceOne = new models.ResourceModel({
		name: 'Blankets',
		count: 10,
		category: 'Essentials',
		description: 'Non threadbare blankets',
		status: 'Delivered',
		photo: '',
		promoted: false
	});
	resourceOne.save((err, obj) => {
		resourceOneId = obj.id;
	});

	var resourceTwoId;
	const resourceTwo = new models.ResourceModel({
		name: 'Pants',
		count: 3,
		category: 'Clothing',
		description: 'Denim Pants',
		status: 'Promised',
		photo: '',
		promoted: true
	});
	resourceTwo.save((err, obj) => {
		resourceTwoId = obj.id;
	});

	var transactionOneId;
	const transactionOne = new models.TransactionModel({
		from: 'Joe Schmoe',
		to: 'McCharity Charity',
		resource: 'Blankets',
		timeStamp: new Date().toISOString()
	});
	transactionOne.save((err, obj) => {
		transactionOneId = obj.id;
	});

	var transactionTwoId;
	const transactionTwo = new models.TransactionModel({
		from: 'Jules Saladana',
		to: 'McCharity Charity',
		resource: 'Blankets',
		timeStamp: new Date().toISOString()
	});
	transactionTwo.save((err, obj) => {
		transactionTwoId = obj.id;
	});

	var transactionThreeId;
	const transactionThree = new models.TransactionModel({
		from: 'Joe Schmoe',
		to: 'McCharity Charity',
		resource: 'Pants',
		timeStamp: new Date().toISOString()
	});
	transactionThree.save((err, obj) => {
		transactionThreeId = obj.id;
	});

	var transactionFourId;
	const transactionFour = new models.TransactionModel({
		from: 'Joe Schmoe',
		to: 'Damn',
		resource: 'Pants',
		timeStamp: new Date().toISOString()
	});
	transactionFour.save((err, obj) => {
		transactionFourId = obj.id;
	});

	var transactionFiveId;
	const transactionFive = new models.TransactionModel({
		from: 'Jules Saladana',
		to: 'Damn',
		resource: 'Pants',
		timeStamp: new Date().toISOString()
	});
	transactionFive.save((err, obj) => {
		transactionFiveId = obj.id;
	});
}


var routes = {
    getHome: getHome,
    postRequestTransactionHistoryCharity: postRequestTransactionHistoryCharity,
    postRequestTransactionHistoryDonor: postRequestTransactionHistoryDonor,
    postAllDonorsAndCharities: postAllDonorsAndCharities,
    getTransactionHistoryFromAll: getTransactionHistoryFromAll,
    getAdminView: getAdminView,
    postAdminViewProcessing: postAdminViewProcessing,
}

module.exports = routes;
