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

var charity = {
	name: String,
	need: [ String ],
	listOfResources: [ resource ],
	location: String,
	description: String,
	photo: String,
	transactionHistory: [ transaction ],
	preferredDonors: [ donor ]
};

var donor = {
	name: String,
	location: String,
	preferredCategory: String,
	transactionHistory: [ transaction ],
	photo: String,
	description: String,
	excessResources: [ resource ],
	friends: [ donor ],
	preferredCharities: [ charity ]
};

var resource = {
	name: String,
	category: String,
	description: String,
	status: String,
	photo: String,
	promoted: Boolean
};

var transaction = {
	from: String,
	to: String,
	resource: String
};

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

//Testing simple data
const sampleCharity = new CharityModel({
	name: 'McCharity Charity',
	need: [ 'Wood', 'Iron' ],
	listOfResources: [],
	location: 'Gibraltar',
	description: 'nah, there is no description',
	photo: '',
	transactionHistory: [],
	preferredDonors: []
});

sampleCharity.save();

//Routes

app.get('/', (req, res) => {
	res.render('allCharities');
});

app.post('/requestTransactionHistory', (req, res) => {
	var charityName = req.body.charityName;
	console.log(charityName);
	CharityModel.findOne({ name: charityName }, function(err, obj) {
		if (err) {
			console.error(err);
		}
		console.log(obj);
		console.log('Processing ' + obj.name);
		res.send('Processing ' + obj.name);
	});
});
