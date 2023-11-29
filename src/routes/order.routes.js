const express = require('express')
const router = express.Router()
const orderController = require('../controllers/order.controller');

router.get('/', orderController.findAll);

router.get('/:userid', orderController.searchByUserID); 

router.post('/create', orderController.create);

module.exports = router