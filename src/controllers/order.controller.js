'use strict';
const Order = require('../models/order.model');
const User = require('../models/user.model');

exports.create = function (req, res) {
    if (req.body.constructor === Object && Object.keys(req.body).length == 0) {
        res.status(400).send({ errors: true, message: 'Please provide all required field' });
        return;
    }
    let data =
    {
        userid: req.body.userid,
        price: req.body.price,
        date: req.body.date
    };
    const order = new Order(data);

    Order.create(order, function (err) {
        if (err) {
            console.log(err);
            res.status(401).json({ errors: true, message: "An unknown error has occured" });
        }
        else {
            res.status(200).json({ errors: false, order: order, message: "Order added successfully!" });
        }
    });
};

exports.findAll = function (req, res) {
    Order.findAll(function (err, order) {
        if (err) {
            res.send(err);
        }

        res.status(200).json({ errors: false, data: order });
    });
};

exports.searchByUserID = function (req, res) {
    var userid = req.params.userid;
    Order.searchByUserID(userid, function (err, result) {
        if (err) {
            res.send(err);
        }

        res.status(200).json({ errors: false, data: result });
    });
};
