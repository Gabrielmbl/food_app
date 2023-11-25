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
Users.create = function (user, result) 
{
    //encrypt password
    bcrypt.hash(user.password, saltRounds, function(err, hash) 
    {
        // Store hash in your password DB.
        user.password=hash;
        dbConn.query("INSERT INTO users SET ?", user, function (err, res) 
        {
            if (err) 
            {
                console.log("errors: ", err);
                result(err, null);
            }
            else 
            {
                console.log(res.insertId);
                result(null, res.insertId);
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


// Users.place_oder = function(userid, menuid, result) {
//     // Check if user has 
//     dbConn.query("select * from plan_histories where userid = ? and start_date <= CURDATE() and end_date >= CURDATE() order by end_date desc limit 1", [userid], function (err, meal_check_result) {
//         if (err) {
//             console.log("errors: ", err);
//             result(null, err);
//         }
//         else {
//             if (meal_check_result > 0) {
//                 const mealid = meal_check_result[0]['mealid']
//                 const num_meals_sql = "select * from meal_plans where mealid = ?";
//                 dbConn.query(num_meals_sql, [mealid], function(err, num_meals_result){
//                     if (err) {
//                         console.log("Error fetching number of meals: ", err);
//                         result(null, err);
//                     }
//                     else{
//                         if (num_meals_result.length > 0) {
//                             const num_meals = parseInt(num_meals_result[0]['num_meals_day']);
//                             result(null, num_meals);
//                         }
//                         else {
//                             console.log("No meals found for mealid: ", mealid);
                            
//                         }
//                     }
//                 })
//             }
            
//         }
//     });

//     dbConn.query("DELETE FROM users WHERE userid = ?", [userid], function (err, res) {
//         if (err) {
//             console.log("errors: ", err);
//             result(null, err);
//         }
//         else {
//             result(null, res);
//         }
//     });

    
// }