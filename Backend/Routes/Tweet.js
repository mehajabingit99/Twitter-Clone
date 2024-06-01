//use express in routes
const express = require('express');
const { 
    createTweet,
    getTweetById, 
    likeorDislike, 
    replyToTweetById, 
    getAllTweets, 
    retweetById, 
    deleteTweetById
} = require('../Controller/tweetController');

// Add Protected Routes
const authenticate = require('../Middleware/protectedRoute');

//create router which is in a express
const router = express.Router();

// *************** API ROUTES *************

//  post/create new tweet 
router.post('/createNewTweet',authenticate,createTweet);

//  get/read tweet by Id
router.get('/getTweetById/:id',authenticate,getTweetById);

//  like and dislike tweet by id
router.put('/like/:id',authenticate,likeorDislike);

//  unlike tweet by id
// router.put('/dislike/:id',authenticate,dislikeTweetById);

//  reply tweet by id
router.post('/reply/:id',authenticate,replyToTweetById);

//  get/read all tweets
router.get('/getAllTweets',authenticate,getAllTweets);

//  get/read all tweets by id
// router.get('getAllTweets/:id',authenticate,getAllTweetsByUserId);

//delete tweet by id
router.delete('/delete/:id',authenticate,deleteTweetById);

//  post/create retweet by id
router.post('/retweet/:id',authenticate,retweetById);

//export user router
module.exports = router;
