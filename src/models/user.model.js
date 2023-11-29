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
    let orderid;
    let food_price;
    dbConn.query("SELECT price FROM menus WHERE menuid = ?", [menuid], function (err, result) {
        if (err) {
            console.log("Error checking menu price: ", err);
            result(null, err);
        } else {
            food_price = result[0]['price'];
        }
    });
    // Check if user has meal plan
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
                        if (num_meals_result.length > 0) {
                            const num_meals = parseInt(num_meals_result[0]['num_meals_day']);

                            // Check if an order for the user on the same day exists
                            const sql3 = "SELECT * FROM orders WHERE userid = ? AND DATE(date) = CURDATE()";
                            dbConn.query(sql3, [userid], function (err, myresult3) {
                                if (err) {
                                    console.log("Error checking user's order today: ", err);
                                    result(null, err);
                                } else {
                                    // If there is an order on that day
                                    if (myresult3.length > 0) {
                                        // const orderid = myresult3[0]['orderid'];
                                        orderid = myresult3[0]['orderid'];
                                        console.log('Found an order made by this user today', orderid);

                                        // Check the amount of times the user has eaten today
                                        const num_times_sql = "SELECT count(*) as num_times FROM menus_orders WHERE userid = ? and orderid = ? and DATE(date) = CURDATE()";
                                        dbConn.query(num_times_sql, [userid, orderid], function (err, num_times_result) {
                                            if (err) {
                                                console.log("Error checking the number of times the person has eaten today: ", err);
                                                result(null, err);
                                            } else {
                                                const num_times = num_times_result[0]['num_times'];

                                                // Check if user has eaten less times than he is allowed, which would keep the order's price $0
                                                if (num_times < num_meals) {
                                                    const order_sql_update = "UPDATE orders SET price = 0 WHERE userid = ? AND DATE(date) = CURDATE()";
                                                    insertMenusOrders(orderid, menuid, userid, result);
                                                    dbConn.query(order_sql_update, [userid], function (err) {
                                                        if (err) {
                                                            console.log("Error updating existing order for today's price: ", err);
                                                            result(null, err);
                                                        } else {
                                                            //result(null, 'Order updated successfully');
                                                        }
                                                    });
                                                } else {
                                                    // In case the user has eaten more times than he is allowed today, add food price to order price
                                                    const order_sql_update = "UPDATE orders SET price = price + ? WHERE userid = ? AND DATE(date) = CURDATE()";
                                                    insertMenusOrders(orderid, menuid, userid, result);
                                                    dbConn.query(order_sql_update, [food_price, userid], function (err) {
                                                        if (err) {
                                                            console.log("Error updating existing order for today's price: ", err);
                                                            result(null, err);
                                                        } else {
                                                            //result(null, 'Order updated successfully');
                                                        }
                                                    });
                                                }
                                            }
                                        });

                                    } else {
                                        // No order found for the user today, create a new one
                                        const sql5 = "INSERT INTO orders (userid, price, date) VALUES(?, 0, NOW())";
                                        dbConn.query(sql5, [userid], function (err, result) {
                                            if (err) {
                                                console.log("Error adding order for today: ", err);
                                                result(null, err);
                                            } else {
                                                const get_order_by_userid_date = "SELECT * FROM orders where userid = ? and date(date) = CURDATE()";
                                                dbConn.query(get_order_by_userid_date, [userid], function (err, result) {
                                                    if (err) {
                                                        result(null, err);
                                                    }
                                                    else {
                                                        if (result.length > 0) {
                                                            orderid = result[0]['orderid'];
                                                            insertMenusOrders(orderid, menuid, userid, result);
                                                        }
                                                    }
                                                });
                                                console.log('No order found for the user, creating a new one')
                                            }
                                        })

                                    }
                                }
                            });
                        } else {
                            console.log("No meals left for mealid: ", mealid);
                            result(null, 0);
                        }
                    }
                });
            } else {
                console.log("User doesn't have a meal plan.");
                // Check if an order for the user on the same day exists
                const sql3 = "SELECT * FROM orders WHERE userid = ? AND DATE(date) = CURDATE()";
                dbConn.query(sql3, [userid], function (err, myresult3) {
                    if (err) {
                        console.log("Error checking user's order today: ", err);
                        result(null, err);
                    } else {
                        if (myresult3.length > 0) {
                            console.log('Found an order made by this user today');
                            // Update orderid here
                            orderid = myresult3[0]['orderid'];
                            const order_sql_update = "UPDATE orders SET price = price + ? WHERE userid = ? AND DATE(date) = CURDATE()";
                            insertMenusOrders(orderid, menuid, userid, result);
                            dbConn.query(order_sql_update, [food_price, userid], function (err) {
                                if (err) {
                                    console.log("Error updating existing order for today's price: ", err);
                                    result(null, err);
                                } else {
                                    //result(null, 'Order updated successfully');
                                }
                            });
                        } else {
                            console.log('Did not find an order made by this user today');
                            const sql6 = "INSERT INTO orders (userid, price, date) VALUES (?, ?, NOW())"
                            dbConn.query(sql6, [userid, food_price], function (err) {
                                if (err) {
                                    console.log("Error creating order for today: ", err);
                                    result(null, err);
                                } else {
                                    // result(null, 'Order created successfully');
                                }
                            });
                            const sql7 = "SELECT * FROM orders WHERE userid = ? AND DATE(date) = CURDATE()";
                            dbConn.query(sql7, [userid], function (err, myresult4) {
                                if (err) {
                                    console.log("Error checking order: ", err);
                                    result(null, err);
                                } else {
                                    if (myresult4.length > 0) {
                                        orderid = myresult4[0]['orderid'];
                                        insertMenusOrders(orderid, menuid, userid, result);
                                    }
                                }
                            });
                        }
                    }
                });


            }
        }
    });
};

function insertMenusOrders(orderid, menuid, userid, result) {
    const menus_orders = "INSERT INTO menus_orders (orderid, menuid, userid, date) VALUES (?, ?, ?, NOW())";
    dbConn.query(menus_orders, [orderid, menuid, userid], function (err) {
        if (err) {
            console.log("Error adding to menus_orders table: ", err);
            result(null, err);
        }
        else {
            result(null, 'menus_orders table updated successfully');
        }
    });
}

