//need to take first token so that import jsonwebtoken
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
//import User.js model
const User = require('../Models/User')



//middleware for authentication
const authenticate = async(req,res,next)=>{
    try {
// Check the 'authorization' header for the token
        const authHeader = req.headers["authorization"];
        
        if (!authHeader) {
            return res.status(401).json({
                 message: "Please provide a token",
                 success:false
                })
        }
        
        //if header is available then extract token for the same.
        const token = authHeader.replace('Bearer ', "");
       
        if (!token) {
            return res.status(401).json({ 
                message: "Please provide a valid token",
                success:false
             })
        }
        
        //verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Find the user associated with the token
        const user = await User.findById(decoded._id , { password: 0 });
        
        if (!user) {
            return res.status(401).json({
                message: "User not found",
                success: false
            });
        }
        //store the user object in the request object
        req.user = user;         
        
        //proceed to next route handler
        next();
    } catch (error) {
        console.error("Error occured in authentication middleware", error)
        return res.status(401).json({ 
            message: "Unauthorized...",
            success:false
        });
    }
}
module.exports = authenticate; //export authenticate middleware