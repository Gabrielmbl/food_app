const express = require('express')
const router = express.Router()
const meal_planController = require('../controllers/meal_plan.controller');

router.get('/', meal_planController.findAll);

router.get('/', meal_planController.findById);

router.post('/', meal_planController.createMeal_plan);

router.post('/', meal_planController.updateMeal_plan);


module.exports = router