//menu_order object create
var Menu_Order = function (menu_order) 
{
    this.orderid = menu_order.orderid;
    this.menuid = menu_order.menuid;
    this.userid = menu_order.userid;
    this.date = menu_order.date;
};

Menu_Order.create = function (menu_order, result) 
{
    dbConn.query("INSERT INTO menus_orders set ?", menu_order, function (err, res) 
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

Menu_Orders.findAll = function (result) 
{
    dbConn.query("Select * from menus_orders", function (err, res) 
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

Menu_Order.searchByUserID = function (userid, result) 
{
    dbConn.query("SELECT * FROM menus_orders where userid = ? ", [userid], function (err, res) 
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

module.exports = Menu_Order;