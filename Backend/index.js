//import all required modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const cors = require('cors');

//configure DOT ENV
dotenv.config();
//server created
const app = express();
//middleware for JSON Parser - body-parser
app.use(express.json());

//Configure CORS
const corsOptions = {
    origin:"http://localhost:3000",// Allow requests from this origin
    credentials:true
}
app.use(cors(corsOptions));

//MongoDB connectivity
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('DB connected'))
.catch(err=>console.log("Error while connecting",err))

//server PORT no
const PORT = process.env.PORT || 5000;

// API's
//routing path for authentication
app.use('/api/auth',require('./Routes/Auth'));

//routes for user
app.use('/api/user',require('./Routes/User'));

//routes for tweet
app.use('/api/tweet',require('./Routes/Tweet'))

//server started
app.listen(PORT,()=>{
    console.log(`server started on PORT ${PORT}`);
})