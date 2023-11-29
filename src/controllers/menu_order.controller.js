'use strict';
const Menu = require('../models/menu_order.model');

exports.viewByUserID = function (req, res) 
{
    var id = req.params.id; 
    Menu_Order.searchByUserID(id, function (err, menu_order) 
    {
        if (err)
        {
            console.log("errors: ", err);
            result(null, err);
        }

        res.status(200).json({errors: false, data:menu_order});
    });
};