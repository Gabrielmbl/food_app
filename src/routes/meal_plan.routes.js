const express = require('express')
const router = express.Router()
const meal_planController = require('../controllers/meal_plan.controller');

router.get('/:all', meal_planController.findAll);

router.get('/:id', meal_planController.findById);

router.post('/:create', meal_planController.createMeal_plan);

router.post('/:update', meal_planController.updateMeal_plan);


module.exports = router