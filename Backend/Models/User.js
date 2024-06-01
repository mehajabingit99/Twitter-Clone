//import mongoose
const mongoose = require('mongoose');

//create schema
// const Schema = mongoose.Schema;

//create objects inside schema
const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        username:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        profilePicture:{
            type:String
        },
        location:{
            type:String
        },
        dateOfBirth:{
            type:Date        
        },
        followers:[{
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', // Reference to the User model
              }
        }],
        following:[{
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', // Reference to the User model
              }
        }]

    },{timestamps:true});

//create model to interact with the User collection in the database
//userModel acts as an interface that allows you to perform various operations on the User collection i.e.CRUD user documents
const User = mongoose.model('userModel',userSchema);

//export
module.exports = User;