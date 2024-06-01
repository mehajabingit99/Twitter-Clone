//use express in routes
const express = require('express');
const { login, register, logout } = require('../Controller/authController');

//create router which is in a express
const router = express.Router();

//path or routes for registeration 
router.post('/register',register);

//path or routes for login
router.post('/login', login);

//path for logout
router.get('/logout', logout);

//export user router
module.exports = router;