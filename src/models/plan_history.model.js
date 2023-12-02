const dbConn = require("../../config/db.config");
//plan history object create
var Plan_History = function (plan_history) 
{
    const d = new Date();
    this.mealid = plan_history.mealid;
    this.userid = plan_history.userid;
    this.start_date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    this.amount = plan_history.amount;
};

Plan_History.createPlan_History = function (plan_history, result) 
{
    dbConn.query("INSERT INTO plan_histories set ?", plan_history, function (err, res) 
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

Plan_History.end = function (id, result)
{
    dbConn.query("Update plan_histories Set end_date = now() Where phid = ? ", [id], function(err, res)
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

Plan_History.findAll = function (result) 
{
    dbConn.query("Select * from plan_histories", function (err, res) 
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

Plan_History.searchByUserID = function (userid, result) 
{
    dbConn.query("SELECT * FROM plan_histories where userid = ? ", [userid], function (err, res) 
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

module.exports = Plan_History;