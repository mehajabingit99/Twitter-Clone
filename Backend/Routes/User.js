//use express in routes
const express = require('express');
const { getSingleUser, followUser, unfollowUser, editUser, getUsersAllTweets, uploadPicture } = require('../Controller/userController');

// Add Protected Routes
const authenticate = require('../Middleware/protectedRoute');

//create router which is in a express
const router = express.Router();

// *************** API ROUTES *************

//get a single user details
router.get('/getSingleUser/:id',authenticate,getSingleUser)

//follow user by id
router.post('/follow/:id',authenticate,followUser)

//unfollow user by id
router.post('/unfollow/:id',authenticate,unfollowUser)

//edit user
router.put('/editUser/:id',editUser)

//get all tweets of a specific user
router.post('/getAllTweets/:id/tweets',getUsersAllTweets)

//export user router
module.exports = router;
