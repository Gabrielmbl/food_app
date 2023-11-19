'use strict';
const Menu = require('../models/menus.model');

exports.viewByMeal = function (req, res) 
{
    const {meal}= req.body; //breakfast, lunch or dinner
    Menu.search(meal, function (err, food_menu) 
    {
        if (err)
        {
            console.log("errors: ", err);
            result(null, err);
        }

        res.status(200).json({errors: false, data:food_menu});
    });
};

exports.createMeal = function (req, res) 
{
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({ errors: true, message: 'Please provide all required field' });
        return;
    } 
    let data = 
    {
        name: req.body.name, 
        description: req.body.description, 
        price: req.body.price,  
    };
    const menu = new Menu(req.body);
    
    menu.create(menu, function (err, menuid) 
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
