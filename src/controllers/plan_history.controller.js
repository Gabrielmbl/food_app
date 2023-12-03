'use strict';
const Plan_History = require('../models/plan_history.model');

exports.createPlan_History = function (req, res) {

    if (req.body.constructor === Object && Object.keys(req.body).length === 0)
    {
        res.status(400).send({ errors: true, message: 'Please provide all required field' });
        return;
    }

    let data =
    {
        mealid: req.body.mealid,
        userid: req.body.userid
    };
    const plan_history = new Plan_History(data);

    Plan_History.createPlan_History(plan_history, function (err, planHistoryID)
    {
        if (err){
            console.log(err);
            res.status(401).json({ errors:true, message: "An unknown error has occured"});
        }else{

            res.status(200).json({ errors: false, id:planHistoryID, plan_history: plan_history, message: "Plan History added successfully!" });
        }
    });
};

exports.end = function (req, res) 
{
    var id=req.params.id

    Plan_History.end(id, function (err, plan_history) 
    {
        if (err)
            res.send(err);

        res.json({ errors: false, message: 'Plan History successfully ended' });
    });
};

exports.findAll = function (req, res)
{
    Plan_History.findAll(function (err, plan_history)
    {
        if (err)
        {
            res.send(err);
        }

        res.status(200).json({errors: false, data:plan_history});
    });
};

exports.searchByUserID = function (req, res) 
{
    var id=req.params.id

    Plan_History.searchByUserID(id, function (err, plan_history) 
    {
        if (err)
            res.send(err);

        res.status(200).json({errors: false, data:plan_history});
    });
};