const dbConn = require("../../config/db.config");
//plan history object create
var Plan_History = function (plan_history) 
{
    var d = new Date();
    var date = new Date();
    var endDate = new Date(date.setMonth(date.getMonth() + 6));

    this.mealid = plan_history.mealid;
    this.userid = plan_history.userid;
    this.start_date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    this.end_date = endDate.toISOString().substring(0, 10);
    this.amount = plan_history.amount;
    this.payment_date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
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
    dbConn.query("Update plan_histories Set end_date = now() Where end_date Is null And userid = ?", [id], function(err, res)
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