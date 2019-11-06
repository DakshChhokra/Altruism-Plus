const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const mongooseConfig = { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true };

var mongoDBPort = process.env.MONGODB_URI || 'mongodb://localhost:27017/cis350';

mongoose.connect(mongoDBPort, mongooseConfig);
mongoose.set('useFindAndModify', false);

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var charitySchema = new Schema({
	name: String,
	need: [ String ],
	listOfResources: [ ObjectId ],
	location: String,
	description: String,
	photo: String,
	transactionHistory: [ ObjectId ],
	preferredDonors: [ ObjectId ]
});

var resourceSchema = new Schema({
	name: String,
	count: Number,
	category: String,
	description: String,
	status: String,
	photo: String,
	promoted: Boolean
});
var transactionSchema = new Schema({
	from: String,
	to: String,
	resource: String,
	timeStamp: String
});

var donorSchema = new Schema({
	name: String,
	location: String,
	preferredCategory: String,
	transactionHistory: [ ObjectId ],
	photo: String,
	description: String,
	excessResources: [ ObjectId ],
	friends: [ ObjectId ],
	preferredCharities: [ ObjectId ]
});

var CharityModel = mongoose.model('CharityModel', charitySchema);
var ResourceModel = mongoose.model('ResourceModel', resourceSchema);
var TransactionModel = mongoose.model('TransactionModel', transactionSchema);
var DonorModel = mongoose.model('DonorModel', donorSchema);

var port = process.env.PORT || 3000;
var server = app.listen(port, () => {
	console.log('Server started on port ' + port);
});

//Use Object Id - instead of
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

var charityOneId;
const charityOne = new CharityModel({
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
const charityTwo = new CharityModel({
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

const donorOne = new DonorModel({
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

const donorTwo = new DonorModel({
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
const resourceOne = new ResourceModel({
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
const resourceTwo = new ResourceModel({
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
const transactionOne = new TransactionModel({
	from: 'Joe Schmoe',
	to: 'McCharity Charity',
	resource: 'Blankets',
	timeStamp: new Date().toISOString()
});
transactionOne.save((err, obj) => {
	transactionOneId = obj.id;
});

var transactionTwoId;
const transactionTwo = new TransactionModel({
	from: 'Jules Saladana',
	to: 'McCharity Charity',
	resource: 'Blankets',
	timeStamp: new Date().toISOString()
});
transactionTwo.save((err, obj) => {
	transactionTwoId = obj.id;
});

var transactionThreeId;
const transactionThree = new TransactionModel({
	from: 'Joe Schmoe',
	to: 'McCharity Charity',
	resource: 'Pants',
	timeStamp: new Date().toISOString()
});
transactionThree.save((err, obj) => {
	transactionThreeId = obj.id;
});

var transactionFourId;
const transactionFour = new TransactionModel({
	from: 'Joe Schmoe',
	to: 'Damn',
	resource: 'Pants',
	timeStamp: new Date().toISOString()
});
transactionFour.save((err, obj) => {
	transactionFourId = obj.id;
});

var transactionFiveId;
const transactionFive = new TransactionModel({
	from: 'Jules Saladana',
	to: 'Damn',
	resource: 'Pants',
	timeStamp: new Date().toISOString()
});
transactionFive.save((err, obj) => {
	transactionFiveId = obj.id;
});

//Routes

app.get('/', (req, res) => {
	testingUpdates(res);
});

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
	res.render('home');
}

app.post('/requestTransactionHistoryCharity', (req, res) => {
	var charityName = req.body.charityName;
	printCharities(charityName, res);
});

async function printCharities(charityName, res) {
	var charityObject = await getCharity(charityName);
	var transactionHistory = await transactionForCharity(charityObject.name);
	res.render('singleCharityView', { input: { name: charityObject.name, transactionHistory: transactionHistory } });
}

app.post('/requestTransactionHistoryDonor', (req, res) => {
	var donorName = req.body.donorName;
	printDonor(donorName, res);
});

async function printDonor(donorName, res) {
	var donorObject = await getDonor(donorName);
	var transactionHistory = await transactionForDonor(donorObject.name);
	res.render('singleDonorView', { input: { name: donorObject.name, transactionHistory: transactionHistory } });
}

app.post('/allDonorsAndCharities', (req, res) => {
	getAllCharitiesAndDonors(res);
});

async function getAllCharitiesAndDonors(res) {
	var allCharities = await getAllCharities();
	var allDonors = await getAllDonors();
	res.render('allCharitiesAndDonors', { input: { charities: allCharities, donors: allDonors } });
}

app.get('/transactionHistoryFromAll', (req, res) => {
	if (req.query.type == 'charity') {
		printCharities(req.query.charityName, res);
	} else {
		printDonor(req.query.donorName, res);
	}
});

app.get('/adminView', (req, res) => {
	res.render('adminView');
});

app.post('/adminViewProcessing', (req, res) => {
	res.send(req.body);
});

function getAllCharities() {
	return CharityModel.find().exec();
}

function getAllDonors() {
	return DonorModel.find().exec();
}

function getCharity(charityName) {
	return CharityModel.findOne({ name: charityName }).exec();
}
function getDonor(donorName) {
	return DonorModel.findOne({ name: donorName }).exec();
}

function transactionForCharity(charityName) {
	return TransactionModel.find({ to: charityName }).exec();
}

function transactionForDonor(donorName) {
	return TransactionModel.find({ from: donorName }).exec();
}

function updateTransactionHistoryForCharity(charityID, transactionID) {
	CharityModel.findByIdAndUpdate(charityID, { $push: { transactionHistory: transactionID } }, { new: true }).exec();
}

function updateTransactionHistoryForDonor(donorID, transactionID) {
	DonorModel.findByIdAndUpdate(donorID, { $push: { transactionHistory: transactionID } }, { new: true }).exec();
}
