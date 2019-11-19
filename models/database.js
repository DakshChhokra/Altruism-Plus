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

exports.CharityModel = CharityModel;
exports.ResourceModel = ResourceModel;
exports.TransactionModel = TransactionModel;
exports.DonorModel = DonorModel;