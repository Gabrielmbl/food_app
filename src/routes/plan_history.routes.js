const express = require('express')
const router = express.Router()
const plan_historyController = require('../controllers/plan_history.controller');

router.get('/', plan_historyController.findAll);

router.get('/:id', plan_historyController.searchByUserID);

router.post('/create', plan_historyController.createPlan_History);

router.post('/:id', plan_historyController.end);

module.exports = router