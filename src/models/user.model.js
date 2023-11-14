'use strict';
var dbConn = require('../../config/db.config');
const bcrypt = require('bcrypt');
const saltRounds = 10;

//User object create
var Users = function (user) {
    this.fname = user.fname;
    this.lname = user.lname;
    this.password = user.password;
};
Users.create = function (user, result) {

    //encrypt password
    bcrypt.hash(user.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        user.password=hash;
        dbConn.query("INSERT INTO users set ?", user, function (err, res) {
            if (err) {
                console.log("errors: ", err);
                result(err, null);
            }
            else {
                console.log(res.insertId);
                result(null, res.insertId);
                // result(null, user.email);
            }
        });
    });

    
};

Users.login = function (userid, password, result) {
    var sql="Select * from users where userid = ? ";
    dbConn.query(sql, userid, function (err, res) {
        if (err) {
            console.log("errors: ", err);
            result(err, null);
        }
        else {
            
            if(res.length==0){result(err, null); } //invalid id
            else{
             bcrypt.compare(password, res[0].password, function(err, result_) {
                 
                 if (result_==true) {
                     // password is valid
                     result(null, res[0]);
                 }else{
                     result(err, null);
                 }
                 });
             }   
         }
     });
};


Users.findById = function (userid, result) {
    dbConn.query("SELECT * FROM users where userid= ? ", userid, function (err, res) {
        if (err) {
            console.log("errors: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};



Users.findAll = function (result) {
    dbConn.query("Select * from users", function (err, res) {
        if (err) {
            console.log("errors: ", err);
            result(null, err);
        }
        else {
            console.log('users : ', res);
            result(null, res);
        }
    });
};


Users.update = function (user, result) {
    console.log(user)
    dbConn.query("UPDATE users SET fname=?,lname=? WHERE userid = ?", [user.fname, user.lname, user.userid], function (err, res) {
        if (err) {
            console.log("errors: ", err);
            result(null, err);
        } else {
            result(null, res);
        }
    });
};

Users.updatePwd = function (password, userid, result) {
    
    bcrypt.hash(password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        
        dbConn.query("UPDATE users SET password=? WHERE userid = ?", [hash,  userid], function (err, res) {
            if (err) {
                console.log("errors: ", err);
                result(null, err);
            } else {
                result(null, res);
            }
        });
      
    });
    
   
};

Users.delete = function (userid, result) {
    dbConn.query("DELETE FROM users WHERE userid = ?", [userid], function (err, res) {
        if (err) {
            console.log("errors: ", err);
            result(null, err);
        }
        else {
            result(null, res);
        }
    });
};
module.exports = Users;