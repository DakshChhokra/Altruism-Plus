const mongo = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'
var db;
mongo.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
  if (err) {
    console.error(err);
    return;
  }
  db = client.db('350Project');
});

var user_put = function(username, hash, route_callback) {
  console.log("Putting: " + username);
  var userObj = { name: username, password: hash};
    db.collection("users").insertOne(userObj, function(err, res) {
      if (err) {
        route_callback(null, "Lookup error: " +err);
      } else {
        if (route_callback) {
          console.log(route_callback);
          route_callback(res, null);
        }

      }
      console.log("1 document inserted");
    });
}

var user_lookup = function(username, route_callback) {
  console.log("Looking Up: " + username);
  db.collection("users").findOne({name: username}, function(err, res) {
      if (err) {
        route_callback(null, "Lookup error: " +err);
      } else {
        if (route_callback) {
          console.log(res.name);
          console.log(res.password);
          route_callback(res, null);
        }
      }
      console.log("document lookup");
    });
}


var user_clear = function() {
    db.collection("users").drop();
}

var database = {
  userPut: user_put,
  userClear: user_clear,
  userLookup: user_lookup,
};

module.exports = database;
