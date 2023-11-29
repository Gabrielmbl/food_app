const dbConn = require("../../config/db.config");
var Meal_plan = function(meal_plans){
    this.pname = meal_plans.pname
    this.status = meal_plans.status
    this.num_meals_day = meal_plans.num_meals_day
    this.price = meal_plans.price
    this.description = meal_plans.description
};

Meal_plan.create = function(meal_plans,result)
{
    dbConn.query("Insert into meal_plans set ?", meal_plans, function(err, res){
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
    })
}

Meal_plan.update = function (meal_plans, result) {
    console.log(user)
    dbConn.query("UPDATE meal_plans SET pname=?,status=?, num_meals_day=?, price=? WHERE mealid = ?", [meal_plans.pname, meal_plans.status, meal_plans.num_meals_day, meal_plans.price, meal_plans.mealid], function (err, res) {
        if (err) {
            console.log("errors: ", err);
            result(null, err);
        } else {
            result(null, res);
        }
    });
};

Meal_plan.findById = function (meal_plans, result) {
    dbConn.query("SELECT * FROM meal_plans where mealid= ? ", meal_plans, function (err, res) {
        if (err) {
            console.log("errors: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};



Meal_plan.findAll = function (result) {
    dbConn.query("Select * from meal_plans", function (err, res) {
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