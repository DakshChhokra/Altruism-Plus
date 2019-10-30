const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const mongooseConfig = { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true };

var mongoDBPort = process.env.MONGODB_URI || 'mongodb://localhost:27017/cis350-first-iteration';

mongoose.connect(mongoDBPort, mongooseConfig);
mongoose.set('useFindAndModify', false);

var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

// var charity = {
// 	name: String,
// 	need: [ String ],
// 	listOfResources: [ resource ],
// 	location: String,
// 	description: String,
// 	photo: String,
// 	transactionHistory: [ transaction ],
// 	preferredDonors: [ donor ]
// };

// var donor = {
// 	name: String,
// 	location: String,
// 	preferredCategory: String,
// 	transactionHistory: [ transaction ],
// 	photo: String,
// 	description: String,
// 	excessResources: [ resource ],
// 	friends: [ donor ],
// 	preferredCharities: [ charity ]
// };

// var resource = {
// 	name: String,
// 	count: Number,
// 	category: String,
// 	description: String,
// 	status: String,
// 	photo: String,
// 	promoted: Boolean
// };

// var transaction = {
// 	from: String,
// 	to: String,
// 	resource: String
// };

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
	from: ObjectId,
	to: ObjectId,
	resource: ObjectId
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
//Testing simple data
const charityOne = new CharityModel({
	name: 'McCharity Charity',
	need: [ 'Wood', 'Iron' ],
	listOfResources: [],
	location: 'Gibraltar',
	description: 'nah, there is no description',
	photo: '',
	transactionHistory: [],
	preferredDonors: []
}).save((err, object) => {
	charityOneId = object._id;
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
}).save((err, obj) => {
	charityTwoId = obj._id;
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
	donorOneId = obj._id;
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

const resourceOne = new ResourceModel({
	name: 'Blankets',
	count: 10,
	category: 'Essentials',
	description: 'Non threadbare blankets',
	status: 'Delivered',
	photo: '',
	promoted: false
});
var resourceOneId;
resourceOne.save((err, obj) => {
	resourceOneId = obj._id;
});

const resourceTwo = new ResourceModel({
	name: 'Pants',
	count: 3,
	category: 'Clothing',
	description: 'Denim Pants',
	status: 'Promised',
	photo: '',
	promoted: true
});
var resourceTwoId;
resourceTwo.save((err, obj) => {
	resourceTwoId = obj._id;
});

const transactionOne = new TransactionModel({
	from: donorOneId,
	to: charityOneId,
	resource: resourceOneId
});
var transactionOneId;
transactionOne.save((err, obj) => {
	transactionOneId = obj._id;
});

const transactionTwo = new TransactionModel({
	from: donorTwoId,
	to: charityOneId,
	resource: resourceOneId
});
var transactionTwoId;
transactionTwo.save((err, obj) => {
	transactionTwoId = obj._id;
});

const transactionThree = new TransactionModel({
	from: donorOneId,
	to: charityOneId,
	resource: resourceTwoId
});
var transactionThreeId;
transactionThree.save((err, obj) => {
	transactionThreeId = obj._id;
});

//Routes

app.get('/', (req, res) => {
	console.error('transactionOneId', transactionOneId);
	console.error('transactionTwoId', transactionTwoId);
	console.error('transactionThreeId', transactionThreeId);

	console.error('charityOneId', charityOneId);
	CharityModel.findOneAndUpdate(
		{ _id: charityOneId },
		{ $push: { transactionHistory: transactionOneId } },
		(error, success) => {
			if (error) {
				console.log(error);
			} else {
				console.log(success);
			}
		}
	);

	CharityModel.findByIdAndUpdate(
		charityOneId,
		{ $push: { transactionHistory: transactionTwoId } },
		{ new: true },
		(err, result) => {
			if (err) {
				console.err('Error! ', err);
			}
		}
	);

	CharityModel.findByIdAndUpdate(
		charityOneId,
		{ $push: { transactionHistory: transactionThreeId } },
		{ new: true },
		(err, result) => {
			if (err) {
				console.err('Error! ', err);
			}
		}
	);
	res.render('allCharities');
});

app.post('/requestTransactionHistory', (req, res) => {
	var charityName = req.body.charityName;
	console.log(charityName);
	CharityModel.findOne({ name: charityName }, function(err, obj) {
		if (err) {
			console.error(err);
		}
		// console.log(obj);
		var arrayOfTransaction = getTransfersFromId(obj.transactionHistory);
		console.log('arrayOfTransaction', arrayOfTransaction);
		res.render('singleCharityView', { input: { name: obj.name, transactions: arrayOfTransaction } });
	});
});

function getTransfersFromId(arrayOfId) {
	var returnableArray = [];
	arrayOfId.forEach((el) => {
		TransactionModel.findById(el, (err, obj) => {
			if (err) {
				console.log('Error! ', err);
			}
			returnableArray.push(obj);
		});
	});
	return returnableArray;
}
