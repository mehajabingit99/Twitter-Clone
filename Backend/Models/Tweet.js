//import mongoose
const mongoose = require('mongoose');

//create schema
const Schema = mongoose.Schema;

//create objects inside schema
const tweetSchema = new Schema(
    {
        content:{
            type:String,
            required:true
        },
        tweetedBy:{
            type: Schema.Types.ObjectId,
            ref: 'User',  //extended:true            
        },
        like:[{
            type:Schema.Types.ObjectId,
            ref: 'User'
        }],
        retweetBy:[{
            type:Schema.Types.ObjectId,
            ref: 'User'
        }],
        image:{
            type:String
        },
        replies:[{
            type: Schema.Types.ObjectId,
            ref: 'Tweet',
        }],
        userDetails:{
            type:Array,
            default:[]
        }
    },{timestamps:true});

    //create model
    const Tweet = mongoose.model('tweetModel',tweetSchema);

    //export schema
    module.exports = Tweet;