//import User.js model
const User = require('../Models/User')//userModel as User
const bcrypt = require('bcrypt')//hash password
const jwt = require('jsonwebtoken')//to generate token import jsonwebtoken
const dotenv = require('dotenv').config();//configuration .env file

// logic for registration
const register =async(req,res)=>{
    try{
        //get data from request body
        const {name,username,email,password}=req.body;

        //Basic validation 
        if(!name || !username || !email || !password){
            return res.status(400).json({
                message: "All fields are mandatory",
                success:false
            })
        }
        //check email field must be unique
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                message: "User with provided email is already registered",
                success:false
            })
        }
        //check username field must be unique
        user = await User.findOne({username});
        if(user){
            return res.status(400).json({
                message: "User with provided username is already registered",
                success:false
            })
        }
        //-----------------Main code going in a Database--------------//
        //password is in the hash form
        const hashPassword = await bcrypt.hash(password,10);
        //register with new user , create account
        const newUser = new User({
            name,
            email,
            username,
            password:hashPassword});

        const resp = await newUser.save();//store in database
        res.status(201).json({
            message : "User Registered successfully",
            success:true,
            resp
        })
        
        //--------------------------Main Code End ---------------------//
    }catch(error){
        res.status(500).json({
            message : "An error occured while registeration",error});
        console.log(error);
    }
}

// logic for login authentication
const login =async(req,res)=>{
    try{
        //read objects from requested body
       const {email,password}= req.body;
       //both fields are empty or one has data and one has not
       if(!email || !password){
           return res.status(400).json({
            message : "Email and Password is required...",
            success:false
        })
       }
   
       let user = await User.findOne({email});
       //if no user
       if(!user){
           return res.status(400).json({
            message : "Email not registered with us yet...",
            success:false
        })
       }
       //already registered then move to password
       const match = bcrypt.compare(password,user.password);
   
       //passing 3 values to generating a token
       const payload = {
           _id : user._id,
           name : user.name,
           email : user.email
       }
   
       //check comparison matched with our password and user password
       if(match){
           //when match is successful, generate a token based on 'id' but it get error so do with plain object i.e. email or 
           //use payload as it is created above
           const token = await jwt.sign(payload,process.env.JWT_SECRET);
           return res.status(200).json({
            message : "Logged in successfully",
            success:true,
            user,
            token
        })
       } 
       else{
           return res.status(400).json({
            message : "Email and password is Incorrect...",
            success:false
        })
       }
       }catch(error){
           console.log(error)
           return res.status(500).json({message: "Error Occured ..."})
       }
}

//logout
const activeTokens = {}; // Store active tokens here
const tokenBlacklist = new Set(); // Set to store blacklisted tokens

const logout = async (req, res) => {
    try {
        const { token } = req.body;

        // Check if token is in the active tokens
        if (!activeTokens[token]) {
            return res.status(400).json({
                message: "Token not found",
                success: false
            });
        }

        // Add token to blacklist
        tokenBlacklist.add(token);

        // Optionally, remove token from active tokens
        delete activeTokens[token];

        res.json({
            message: "User logged out successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "An error occurred during logout"
        });
    }
}

module.exports = {register,login,logout}