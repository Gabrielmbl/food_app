const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller');
const {verifyToken} = require("../middlewares/auth");

//get all users  
// router.get('/',verifyToken, userController.findAll);
router.get('/', userController.findAll);

//fetch all
router.get('/:id', userController.findById);

//login  
router.post("/", userController.login)

//login  
router.post('/create', userController.create)


// Update password
router.post('/change_password', userController.updatePassword);


// Updates the employee
router.put('/update', userController.update);

// Place order
router.put('/place_order', userController.place_order);



module.exports = router