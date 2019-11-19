var async = require('async');
var bcrypt = require('bcrypt');
var db = require('../models/database.js');

const saltRounds = 10; // constant needed for bcrypt hash

var getLogin = function(req, res) {
    var errString = req.query.error;
    res.render('login.ejs', {loginError: errString});
};

var getSignup = function(req, res) {
    var errString = req.query.error;
    res.render('signup.ejs', {signupError: errString});
};

var createAccount = function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if (!username || !password || username === "" || password === "" ) { // throw error if any field is blank
        var signUpErr = encodeURIComponent("One or more fields left blank.");
        res.redirect("/signup/?error=" + signUpErr);
    }

    db.userLookup(username, function(data1, err) {
        if (err) {
            var signUpErr = encodeURIComponent("Error signing up. Please try again.");
            res.redirect("/signup/?error=" + signUpErr);
        } // user already exists in database
        else if (data1) {
            var uExists = encodeURIComponent("Username " + data1.name +" already exists.");
            res.redirect("/signup/?error=" +uExists);
        }
        else {
            bcrypt.hash(password, saltRounds, function(err, hash) {
                if (err) {
                    var signUpErr = encodeURIComponent("Error hashing password");
                    res.redirect("/signup/?error=" + signUpErr);
                }
                else {
                    db.userPut(username, hash, function(data, err) {
                        if (err) {
                            var signUpError = encodeURIComponent("Signup error. Please try again.");
                            res.redirect("/signup/?error=" +signUpError);
                        }
                        else {
                            res.session.user = username; // to allow current use to enter homepage
                            res.render('home.ejs');
                                                    //res.redirect("/homepage");
                        }
                    });
                }
            });
        }
      });

    //var errString = req.query.error;
    //res.render('home.ejs', {signupError: errString});
}

var clear = function (req, res) {
    db.userClear();
    res.render('home.ejs');
}

var checkLogin = function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if (!username || !password || username === "" || password === "") { // if any fields are blank, give an error
        var errString = encodeURIComponent("One or more fields are blank.");
        res.redirect('/?error=' + errString);
    }
    else {
        db.userLookup(username, function(data, err) {
            if (err) {
                var errString = encodeURIComponent("Error while logging in. Please try again.");
                res.redirect('/?error=' + errString);
            }
            else if (!data) {
                var incorrectUorP = encodeURIComponent("Username or password incorrect.");
                res.redirect('/?error=' + incorrectUorP);
            }
            else {
                console.log(data.password);
                bcrypt.compare(password, data.password, function(err, result) {
                    if (err) {
                        var errStr = encodeURIComponent("Error finding password in database. Please try again.");
                        res.redirect('/?error=' + errStr)
                    }
                    else if (data && result) { // match password hash to one stored in database
                        //req.session.user = username;
                        //res.redirect("/homepage");
                        res.render("home.ejs");
                    }
                    else { // incorrect username or password
                        var incorrectUorP = encodeURIComponent("Username or password incorrect.");
                        res.redirect('/?error=' + incorrectUorP);
                    }
                });
            }
        });
    }
}

var createEvent = function (req, res) {
    var eventName = req.body.eventName;
    var eventDescription = req.body.eventDescription;
    if (!eventName || !eventDescription || eventName === "" || eventDescription === "" ) { // throw error if any field is blank
        var signUpErr = encodeURIComponent("One or more fields left blank.");
        res.redirect("/signup/?error=" + signUpErr);
        return;
    }

    db.eventLookup(eventName, function(data1, err) {
        if (err) {
            var signUpErr = encodeURIComponent("Error Creating Event. Please try again.");
            res.redirect("/signup/?error=" + signUpErr);
        } // user already exists in database
        else if (data1) {
            var evExists = encodeURIComponent("Username " + data1.eventName +" already exists.");
            res.redirect("/signup/?error=" +evExists);
        }
        else {
            db.eventPut(eventName, eventDescription, function(data, err) {
                if (err) {
                    var signUpError = encodeURIComponent("Signup error. Please try again.");
                    res.redirect("/signup/?error=" + signUpError);
                }
                else {
                    res.render('home.ejs');
                }
            });
        }
      });
}




var routes = {
    get_login: getLogin,
    get_signup: getSignup,
    create_account: createAccount,
    check_login: checkLogin,
    clear: clear,
    create_event: createEvent,
}

module.exports = routes;
