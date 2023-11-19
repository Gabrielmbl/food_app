//plan history object create
var Plan_History = function (plan_history) 
{
    this.mealid = plan_history.mealid;
    this.userid = plan_history.userid;
    this.start_date = plan_history.start_date;
    this.end_date = plan_history.end_date;
    this.amount = plan_history.amount;
    this.payment_date = plan_history.payment_date;
};

Plan_History.create = function (plan_history, result) 
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

Plan_History.update = function (plan_history, result)
{
    console.log(plan_history)
    dbConn.query("Update plan_histories Set end_date = ?", [plan_history.end_date], 
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

Order.searchByUserID = function (userid, result) 
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