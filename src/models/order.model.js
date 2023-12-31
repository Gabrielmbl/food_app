var dbConn = require('../../config/db.config');

//order object create
var Order = function (order) 
{
    this.userid = order.userid;
    this.price = order.price;
    this.date = order.date;
};

Order.create = function (order, result) 
{
    dbConn.query("INSERT INTO orders (userid, price, date) VALUES(?, ?, NOW())", order, function (err, res) 
    {
        if (err) //Error
        {
            console.log("errors: ", err);
            result(err, null);
        }
        else 
        {
            console.log(res.insertId);
            result(null, res.insertId);
        }
    }
    )
};

Order.findAll = function (result) 
{
    debugger
    dbConn.query("Select * from orders", function (err, res) 
    {
        if (err) 
        {
            console.log("errors: ", err);
            result(null, err);
        }
        else 
        {
            result(null, res);
        }
    });
};

Order.searchByUserID = function (userid, result) 
{
    dbConn.query("SELECT * FROM orders where userid = ? ", [userid], function (err, res) 
    {
        if (err) 
        {
            console.log("errors: ", err);
            result(err, null);
        }
        else 
        {
            result(null, res);
        }
    });
};

module.exports = Order;