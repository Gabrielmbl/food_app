const express = require('express')
const router = express.Router()
const menuController = require('../controllers/menu.controller');

router.get('/view_menu', menuController.findAll);

router.get('/:meal', menuController.viewByMeal); //get meals for breakfast, lunch or dinner

router.get('/:id', menuController.viewByID);

router.post('/create', menuController.createMeal);

module.exports = router