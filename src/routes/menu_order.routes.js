const express = require('express')
const router = express.Router()
const menuController = require('../controllers/menu_order.controller');

router.get('/:id', menuController.viewByUserID);

module.exports = router
