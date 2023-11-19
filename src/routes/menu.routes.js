const express = require('express')
const router = express.Router()
const menuController = require('../controllers/menu.controller');

router.get('/:meal', menuController.viewByMeal); //get meals for breakfast, lunch or dinner

router.post('/create_meal', menuController.createMeal)