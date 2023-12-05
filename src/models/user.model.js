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
    bcrypt.hash(user.password, saltRounds, function (err, hash) {
        // Store hash in your password DB.
        user.password = hash;
        dbConn.query("INSERT INTO users set ?", user, function (err, res) {
            if (err) {
                console.log("errors: ", err);
                result(err, null);
            }
            else {
                console.log(res.insertId);
                result(null, res.insertId);
            }
        });
    });
};

Users.login = function (userid, password, result) {
    var sql = "Select * from users where userid = ? ";
    console.log(userid);
    dbConn.query(sql, userid, function (err, res) {
        if (err) {
            console.log("errors: ", err);
            result(err, null);
        }
        else {

            if (res.length == 0) { result(err, null); } //invalid id
            else {
                bcrypt.compare(password, res[0].password, function (err, result_) {

                    if (result_ == true) {
                        // password is valid
                        result(null, res[0]);
                    } else {
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

    bcrypt.hash(password, saltRounds, function (err, hash) {
        // Store hash in your password DB.

        dbConn.query("UPDATE users SET password=? WHERE userid = ?", [hash, userid], function (err, res) {
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


Users.place_order = function (userid, menuid, result) {
    return new Promise((resolve, reject) => {
        // Check if user has a meal plan
        dbConn.query("select * from plan_histories where userid = ? and start_date <= CURDATE() and end_date >= CURDATE() order by end_date desc limit 1", [userid], function (err, meal_check_result) {
            if (err) {
                console.log("Error checking meal plan: ", err);
                result(null, err);
            } else {
                // If the user has an ACTIVE meal plan
                if (meal_check_result.length > 0) {
                    const mealid = meal_check_result[0]['mealid'];
                    const num_meals_sql = "select * from meal_plans where mealid = ?";
                    dbConn.query(num_meals_sql, [mealid], function (err, num_meals_result) {
                        if (err) {
                            console.log("Error fetching number of meals: ", err);
                            result(null, err);
                        } else {
                            // Checking the user's meal plan

                            const num_meals = parseInt(num_meals_result[0]['num_meals_day']);

                            // Check amount of times the user has eaten today
                            checkSwipesAmount(userid)
                                .then(num_swipes_today => {
                                    console.log("Number of swipes today:", num_swipes_today);
                                    // Create an order (if the user has used all their swipes, add $10 to order price)
                                    if (num_swipes_today < num_meals) {
                                        createOrder(userid, 0, function (err, result) {
                                            if (err) {
                                                console.error("Error occurred:", err);
                                            } else {
                                                console.log("Order created:", result);
                                                // Get the recently created order id
                                                getRecentlyCreatedOrderId(userid)
                                                    .then(recently_created_orderid => {
                                                        // Use recently_created_orderid here
                                                        console.log("Recently created order ID:", recently_created_orderid);

                                                        // Populate the menus_orders table
                                                        // Iterate through each menu ID and call insertMenusOrders
                                                        if (menuid.length === 1) {
                                                            insertMenusOrders(recently_created_orderid, menuid[0], userid, function (err, result) {
                                                                if (err) {
                                                                    console.error("Error occurred:", err);
                                                                } else {
                                                                    console.log("Result:", result);
                                                                    // Handle result if needed
                                                                }
                                                            });
                                                        } else {
                                                            menuid.forEach(id => {
                                                                insertMenusOrders(recently_created_orderid, id, userid, function (err, result) {
                                                                    if (err) {
                                                                        console.error("Error occurred:", err);
                                                                    } else {
                                                                        console.log("Result:", result);
                                                                        // Handle result if needed
                                                                    }
                                                                });
                                                            });
                                                        }
                                                    })
                                                    .catch(err => {
                                                        // Handle error
                                                        console.error("Error occurred:", err);
                                                    });
                                            }
                                        });
                                    } else {
                                        createOrder(userid, 10, function (err, result) {
                                            if (err) {
                                                console.error("Error occurred:", err);
                                            } else {
                                                console.log("Order created:", result);
                                                // Get the recently created order id
                                                getRecentlyCreatedOrderId(userid)
                                                    .then(recently_created_orderid => {
                                                        // Use recently_created_orderid here
                                                        console.log("Recently created order ID:", recently_created_orderid);

                                                        // Populate the menus_orders table
                                                        // Iterate through each menu ID and call insertMenusOrders
                                                        if (menuid.length === 1) {
                                                            insertMenusOrders(recently_created_orderid, menuid[0], userid, function (err, result) {
                                                                if (err) {
                                                                    console.error("Error occurred:", err);
                                                                } else {
                                                                    console.log("Result:", result);
                                                                    // Handle result if needed
                                                                }
                                                            });
                                                        } else {
                                                            menuid.forEach(id => {
                                                                insertMenusOrders(recently_created_orderid, id, userid, function (err, result) {
                                                                    if (err) {
                                                                        console.error("Error occurred:", err);
                                                                    } else {
                                                                        console.log("Result:", result);
                                                                        // Handle result if needed
                                                                    }
                                                                });
                                                            });
                                                        }
                                                    })
                                                    .catch(err => {
                                                        // Handle error
                                                        console.error("Error occurred:", err);
                                                    });
                                            }
                                        });
                                    }
                                    resolve();
                                })
                                .catch(err => {
                                    console.error("Error occurred:", err);
                                    // Handle error if needed
                                    reject(err);
                                });

                        }
                    });
                } else { // If user doesn't have a meal plan

                    // Each order will be $10
                    createOrder(userid, 10, function (err, result) {
                        if (err) {
                            console.error("Error occurred:", err);
                        } else {
                            console.log("Order created:", result);
                            // Handle result if needed
                            // Get the recently created order id
                            getRecentlyCreatedOrderId(userid)
                                .then(recently_created_orderid => {
                                    // Use recently_created_orderid here
                                    console.log("Recently created order ID:", recently_created_orderid);

                                    // Populate the menus_orders table
                                    // Iterate through each menu ID and call insertMenusOrders
                                    if (menuid.length === 1) {
                                        insertMenusOrders(recently_created_orderid, menuid[0], userid, function (err, result) {
                                            if (err) {
                                                console.error("Error occurred:", err);
                                            } else {
                                                console.log("Result:", result);
                                                // Handle result if needed
                                            }
                                        });
                                    } else {
                                        menuid.forEach(id => {
                                            insertMenusOrders(recently_created_orderid, id, userid, function (err, result) {
                                                if (err) {
                                                    console.error("Error occurred:", err);
                                                } else {
                                                    console.log("Result:", result);
                                                    // Handle result if needed
                                                }
                                            });
                                        });
                                    }
                                    resolve();
                                })
                                .catch(err => {
                                    // Handle error
                                    console.error("Error occurred:", err);
                                    reject(err);
                                });

                        }
                    });
                }
            }
        });
    });
}


function getRecentlyCreatedOrderId(userid) {
    return new Promise((resolve, reject) => {
        const get_recent_order_query = "SELECT * FROM orders WHERE userid = ? AND DATE(date) = CURDATE() ORDER BY date DESC LIMIT 1";
        dbConn.query(get_recent_order_query, [userid], function (err, orderid_result) {
            if (err) {
                console.log("Error checking the recently created order ID: ", err);
                reject(err);
            } else {
                const orderid = orderid_result[0]['orderid'];
                resolve(orderid);
            }
        });
    });
}

function createOrder(userid, price, callback) {
    const sql5 = "INSERT INTO orders (userid, price, date) VALUES(?, ?, NOW())";
    dbConn.query(sql5, [userid, price], function (err, result) {
        if (err) {
            console.log("Error adding order for today: ", err);
            callback(err, null);
        } else {
            console.log('Creating a new order');
            callback(null, result);
        }
    });
}



function checkSwipesAmount(userid) {
    return new Promise((resolve, reject) => {
        const check_swipes_amount_query = "SELECT count(*) as num_times FROM orders WHERE userid = ? and DATE(date) = CURDATE()";

        dbConn.query(check_swipes_amount_query, [userid], function (err, num_times_result) {
            if (err) {
                console.log("Error checking the number of times the person has eaten today: ", err);
                reject(err);
            } else {
                const num_times = num_times_result[0]['num_times'];
                resolve(num_times);
            }
        });
    });
}

function insertMenusOrders(orderid, menuid, userid, result) {
    const menus_orders = "INSERT INTO menus_orders (orderid, menuid, userid, date) VALUES (?, ?, ?, NOW())";
    dbConn.query(menus_orders, [orderid, menuid, userid], function (err, res) {
        if (err) {
            console.log("Error adding to menus_orders table: ", err);
            if (result && typeof result === 'function') {
                result(err, null);
            }
        }
        else {
            if (result && typeof result === 'function') {
                result(null, 'menus_orders table updated successfully');
            }
        }
    });
}


