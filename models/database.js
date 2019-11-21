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

var charitySchema = new Schema({
	name: String,
	password: String,
	need: String,
	location: String,
	description: String,
	photo: String,
	transactionHistory: [ ObjectId ],
	preferredDonors: [ ObjectId ]
});

var eventSchema = new Schema({
	name: String,
	owner: String,
	need: String,
	location: String,
	description: String,
	beneficiaries: [ String ]
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

var resourceSchema = new Schema({
	name: String,
	count: Number,
	category: String,
	description: String,
	status: String,
	photo: String,
	promoted: Boolean
});

var CharityModel = mongoose.model('CharityModel', charitySchema);
var EventModel = mongoose.model('EventModel', eventSchema);
var ResourceModel = mongoose.model('ResourceModel', resourceSchema);
var TransactionModel = mongoose.model('TransactionModel', transactionSchema);
var DonorModel = mongoose.model('DonorModel', donorSchema);

var user_put = function(username, hash, need, location, description, route_callback) {
	//console.log("Putting: " + username);
	const charityOne = new CharityModel({
		name: username,
		password: hash,
		need: need,
		location: location,
		description: description
	});
	charityOne.save();
	console.log('1 charity inserted');
};

var user_lookup = function(username, route_callback) {
	//console.log("Looking Up: " + username);
	CharityModel.findOne({ name: username }, function(err, res) {
		if (err) {
			route_callback(null, 'Lookup error: ' + err);
		} else {
			if (route_callback) {
				route_callback(res, null);
			}
		}
		console.log('document lookup');
	});
};

var user_clear = function() {
	db.collection('users').drop();
};

var event_put = function(eventName, owner, need, location, description, route_callback) {
	console.log('Putting: ' + eventName);
	const eventOne = new EventModel({
		name: eventName,
		owner: owner,
		need: need,
		location: location,
		description: description
	});
	eventOne.save();
	console.log('1 event inserted');
};

var event_lookup = function(eventName, route_callback) {
	console.log('Looking Up Event: ' + eventName);
	EventModel.findOne({ name: eventName }, function(err, res) {
		if (err) {
			route_callback(null, 'Lookup error: ' + err);
		} else {
			if (route_callback) {
				route_callback(res, null);
			}
		}
		console.log('event lookup');
	});
};

var event_return_all = function() {
	return EventModel.find().lean().exec();
};

var get_event_model = function() {
	return EventModel;
};

var database = {
	userPut: user_put,
	userClear: user_clear,
	userLookup: user_lookup,
	eventPut: event_put,
	eventLookup: event_lookup,
	eventReturnAll: event_return_all,
	getEventModel: get_event_model
};

module.exports = database;

exports.CharityModel = CharityModel;
exports.ResourceModel = ResourceModel;
exports.TransactionModel = TransactionModel;
exports.DonorModel = DonorModel;
