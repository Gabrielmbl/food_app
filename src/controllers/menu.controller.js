'use strict';
const Menu = require('../models/menu.model');

exports.findAll = function (req, res) 
{
    Menu.findAll(function (err, menu) 
    {
        if (err)
        {
            res.send(err);
        }

        res.status(200).json({errors: false, data:menu});
    });
};

exports.viewByMeal = function (req, res) 
{
    var meal = req.params.meal; //breakfast, lunch or dinner
    Menu.search(meal, function (err, menu) 
    {
        if (err)
        {
            console.log("errors: ", err);
            result(null, err);
        }

        res.status(200).json({errors: false, data:menu});
    });
};

exports.viewByID = function (req, res) 
{
    var id = req.params.id; 
    Menu.searchByID(id, function (err, menu) 
    {
        if (err)
        {
            console.log("errors: ", err);
            result(null, err);
        }

        res.status(200).json({errors: false, data:menu});
    });
};

exports.createMeal = function (req, res) 
{
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) 
    {
        res.status(400).send({ errors: true, message: 'Please provide all required field' });
        return;
    } 
    let data = 
    {
        name: req.body.name, 
        description: req.body.description, 
        price: req.body.price,  
        meal: req.body.meal
    };
    const menu = new Menu(data);
    
    Menu.create(menu, function (err, menuid) 
    {
        if (err)
        {
            console.log(err);
            res.status(401).json({ errors:true, message: "An unknown error has occured"});
        }
        else
        {
            res.status(200).json({ errors: false, id:menuid, menu: menu, message: "Menu added successfully!" });    
        }
    });
};
