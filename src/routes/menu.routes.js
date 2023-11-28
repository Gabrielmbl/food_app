const express = require('express')
const router = express.Router()
const menuController = require('../controllers/menu.controller');

router.get('/', menuController.findAll);

router.get('/:meal', menuController.viewByMeal); //get meals for breakfast, lunch or dinner

router.post('/create', menuController.createMeal);

module.exports = router