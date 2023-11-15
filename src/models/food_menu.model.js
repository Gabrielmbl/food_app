//food_menu object create
var Menu = function (menu) 
{
    this.name = menu.name;
    this.description = menu.description;
    this.price = menu.price;
};

Menu.create = function (menu, result) 
{
    dbConn.query("INSERT INTO food_menus set ?", menu, function (err, res) {
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
    });
};