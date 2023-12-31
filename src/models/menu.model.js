var dbConn = require('../../config/db.config');

//menu object create
var Menu = function (menu) 
{
    this.name = menu.name;
    this.description = menu.description;
    this.price = menu.price;
    this.meal = menu.meal;
};

Menu.create = function (menu, result) 
{
    dbConn.query("INSERT INTO menus SET ?", menu, function (err, res) 
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

Menu.update = function (menu, result)
{
    console.log(menu)
    dbConn.query("Update menus Set name = ? , description = ?, price = ?", [menu.name, menu.description, menu.price], 
    function(err, res)
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
    })
};

Menu.findAll = function (result) 
{
    dbConn.query("Select * from menus", function (err, res) 
    {
        if (err) 
        {
            console.log("errors: ", err);
            result(null, err);
        }
        else 
        {
            console.log('menus : ', res);
            result(null, res);
        }
    });
};

Menu.search = function (meal, result) 
{
    dbConn.query("SELECT * FROM menus WHERE meal = ? ", meal, function (err, res) 
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

Menu.searchByID = function (id, result) 
{
    dbConn.query("SELECT * FROM menus WHERE menuid = ? ", id, function (err, res) 
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

Menu.delete = function (menuid, result) 
{
    dbConn.query("DELETE FROM menus WHERE menuid = ?", [menuid], function (err, res) 
    {
        if (err) {
            console.log("errors: ", err);
            result(null, err);
        }
        else {
            result(null, res);
        }
    });
};

module.exports = Menu;