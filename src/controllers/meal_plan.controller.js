'use strict';
const Meal_plan = require('../models/meal_plan.model');

exports.findAll = function (req, res)
{
    Meal_plan.findAll(function (err, meal_plans)
    {
        if (err)
        {
            res.send(err);
        }

        res.status(200).json({errors: false, data:meal_plans});
    });
};

exports.createMeal_plan = function (req, res) {

    if (req.body.constructor === Object && Object.keys(req.body).length === 0)
    {
        res.status(400).send({ errors: true, message: 'Please provide all required field' });
        return;
    }

    let data =
    {
        pname: req.body.pname,
        status: req.body.status,
        num_meals_day: req.body.num_meals_day,
        price: req.body.price,
        description: req.body.description
    };
    const meal_plans = new Meal_plan(data);

    Meal_plan.create(meal_plans, function (err, mealid)
    {
        if (err){
            console.log(err);
            res.status(401).json({ errors:true, message: "An unknown error has occured"});
        }else{

            res.status(200).json({ errors: false, id:mealid, meal_plan: meal_plans, message: "Meal Plan added successfully!" });
        }
    });
};

exports.findById = function (req, res) {
    var id=req.params.id
    Meal_plan.findById(id, function (err, meal_plans) {

        if (err)
            res.send(err);

        res.status(200).json({errors: false, data:meal_plans});
    });
};

exports.updateMeal_Plan = function (req, res) {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({ errors: true, message: 'Please provide all required field' });
    } else {
        var meal_plans = new Meal_plan(req.body)
        meal_Plan.update(meal_plans, function (err, meal_plans) {
            if (err)
                res.send(err);
            res.json({ errors: false, message: 'Meal plans successfully updated' });
        });
    }
};