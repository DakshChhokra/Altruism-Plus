const mongoose = require('mongoose');
const mongooseConfig = { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true };

var mongoDBPort = process.env.MONGODB_URI || 'mongodb://localhost:350Project/cis350';

mongoose.connect(mongoDBPort, mongooseConfig);
mongoose.set('useFindAndModify', false);

var Schema = mongoose.Schema;

var charitySchema = new Schema({
	name: String,
	password: String,
	need: String,
	location: String,
	description: String,
	photo: String,
	notificationHistory: [ { eventName: String, requesterName: String } ],
	requestedHistory: [ String ],
	transactionHistory: [
		{
			from: String,
			to: String,
			resource: String,
			timeStamp: String
		}
	],
	preferredDonors: [ String ],
	donatedDollarAmount: Number
});

var eventSchema = new Schema({
	name: String,
	owner: String,
	need: String,
	location: String,
	description: String,
	beneficiaries: [ { beneficiaryName: String } ]
});

var resourceSchema = new Schema({
	name: String,
	count: Number,
	category: String,
	description: String,
	status: String, //Delivered, Offered, Claimed
	photo: String,
	promoted: Boolean,
	sender: String,
	reciever: String
});

var donorSchema = new Schema({
	name: String,
	password: String,
	location: String,
	preferredCategory: String,
	transactionHistory: [
		{
			from: String,
			to: String,
			resource: String,
			timeStamp: String
		}
	],
	photo: String,
	description: String,
	friends: [ String ],
	preferredCharities: [ String ],
	notificationHistory: [ { charityName: String, resourceName: String } ],
	monetaryTransactionHistory: [ [ String, String, Number ] ]
});

var CharityModel = mongoose.model('CharityModel', charitySchema);
var ResourceModel = mongoose.model('ResourceModel', resourceSchema);
var DonorModel = mongoose.model('DonorModel', donorSchema);
var EventModel = mongoose.model('EventModel', eventSchema);

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
	//console.log('1 charity inserted');
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
		//console.log('document lookup');
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
	eventOne.save((err, doc) => {
		if (doc) {
			route_callback();
		}
	});
	console.log('1 event inserted');
};

var event_lookup = function(eventName, route_callback) {
	//console.log('Looking Up Event: ' + eventName);
	EventModel.findOne({ name: eventName }, function(err, res) {
		if (err) {
			route_callback(null, 'Lookup error: ' + err);
		} else {
			if (route_callback) {
				route_callback(res, null);
			}
		}
	});
};

var get_event_model = function() {
	return EventModel;
};

var add_notification = function(eventOwner, requester, eventName, route_callback) {
	CharityModel.findOneAndUpdate(
		{ name: eventOwner },
		{ $push: { notificationHistory: { eventName: eventName, requesterName: requester } } },
		(err, doc) => {
			if (err) {
				console.error(err);
			}
		}
	);
	CharityModel.findOneAndUpdate({ name: requester }, { $push: { requestedHistory: eventName } }, (err, doc) => {
		if (err) {
			console.error(err);
		}
	});
	console.log('updated notifications for ' + eventOwner);
	route_callback();
};

var add_beneficiary = function(beneficiary, eventName, route_callback) {
	EventModel.findOneAndUpdate(
		{ name: eventName },
		{ $push: { beneficiaries: { beneficiaryName: beneficiary } } },
		(err, doc) => {
			if (err) {
				console.error(err);
			} else {
				route_callback();
			}
		}
	);
	console.log('updated beneficiaries for ' + eventName);
};

var remove_notification = function(eventOwner, requester, eventName, result, route_callback) {
	CharityModel.findOneAndUpdate(
		{ name: eventOwner },
		{ $pull: { notificationHistory: { eventName: eventName, requesterName: requester } } },
		(err, doc) => {
			if (err) {
				console.error(err);
			} else {
				route_callback();
			}
		}
	);

	/*
	CharityModel.findOneAndUpdate({ name: requester }, { $pull: { requestedHistory: eventName } }, (err, doc) => {
		if (err) {
			console.error(err);
		}
	});
*/
	console.log('pulled notifications for ' + eventOwner);
};

var update_photo = function(userName, updatePhoto, route_callback) {
	//console.log(updatePhoto);
	DonorModel.findOneAndUpdate({ name: userName }, { photo: updatePhoto }, (err, doc) => {
		if (err) {
			console.error(err);
		} else {
			if (route_callback) {
				route_callback();
			}
		}
	});
	console.log('updating photo for' + userName);
};

var database = {
	userPut: user_put,
	userClear: user_clear,
	userLookup: user_lookup,
	eventPut: event_put,
	eventLookup: event_lookup,
	getEventModel: get_event_model,
	addNotification: add_notification,
	removeNotification: remove_notification,
	addBeneficiary: add_beneficiary,
	updatePhoto: update_photo,
	CharityModel: CharityModel,
	DonorModel: DonorModel,
	ResourceModel: ResourceModel
};

module.exports = database;
