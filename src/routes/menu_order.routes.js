const express = require('express')
const router = express.Router()
const menuController = require('../controllers/menu_order.controller');

router.get('/:menu_orderID', menuController.viewByUserId);

module.exports = router
