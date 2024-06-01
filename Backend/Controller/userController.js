//import User.js
const User = require('../Models/User')
//import mongoose
const mongoose = require('mongoose');


//get a single user details
const getSingleUser = async (req, res) => {
  try {
    const id = req.params.id;
    //excluding password field
    const user = await User.findById(id).select("-password");
    return res.status(200).json({
      user,
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

//follow user
const followUser = async (req, res) => {
  try {
    const loggedInUserId = new mongoose.Types.ObjectId(req.body.id);
    const userId = new mongoose.Types.ObjectId(req.params.id);

    const loggedInUser = await User.findById(loggedInUserId);
    const user = await User.findById(userId);

    //to follow someone check their id is exist or not
    if (!user.followers.includes(loggedInUserId)) {
      //push loggedInUserId in users followers array
      await user.updateOne({ $push: { followers: loggedInUserId } });
      //update loggedInUser's following array by passing user's id
      await loggedInUser.updateOne({ $push: { following: userId } });
    } else {
      return res.status(400).json({
        message: `User already followed to ${user.name}`
      })
    }
    return res.status(200).json({
      message: `${loggedInUser.name} just follow to ${user.name}`,
      success: true
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

//unfollow user
const unfollowUser = async (req, res) => {
  try {
    const loggedInUserId = new mongoose.Types.ObjectId(req.body.id);
    const userId = new mongoose.Types.ObjectId(req.params.id);

    const loggedInUser = await User.findById(loggedInUserId);
    const user = await User.findById(userId);

    // Check if loggedInUser and user exist
    if (!loggedInUser || !user) {
      return res.status(404).json({
        message: 'User not found',
        success: false
      });
    }

    // Check if the user is in the loggedInUser's following list
    if (loggedInUser.following.includes(userId)) {
      // Pull loggedInUserId from the user's followers array
      await user.updateOne({ $pull: { followers: loggedInUserId } });
      // Pull userId from the loggedInUser's following array
      await loggedInUser.updateOne({ $pull: { following: userId } });
    } else {
      return res.status(400).json({
        message: `User has not followed yet`,
        success: false
      });
    }
    return res.status(200).json({
      message: `${loggedInUser.name} unfollowed ${user.name}`,
      success: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


//edit user profile
const editUser = async (req, res) => {
  try {
    const userIdToUpdate = req.params.id;
    const loggedInUserId = req.user._id;

    // Check if the logged-in user is trying to edit their own details
    if (loggedInUserId.toString() !== userIdToUpdate) {
      return res.status(403).json({ error: 'You are not authorized to edit this user' });
    }

    // Only allow name, date of birth, and location to be updated
    const { name, dateOfBirth, location } = req.body;

    // Validate required fields
    if (!name || !dateOfBirth || !location) {
      return res.status(400).json({ error: 'Name, date of birth, and location are required' });
    }
    // Find the user to update
    const userToUpdate = await User.findById(userIdToUpdate);

    // Check if the user exists
    if (!userToUpdate) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user details
    userToUpdate.name = name;
    userToUpdate.dateOfBirth = dateOfBirth;
    userToUpdate.location = location;

    // Save the updated user details in the database
    await userToUpdate.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

//get all tweets of a specific user
const getUsersAllTweets = async (req, res) => {
  try {
    const userId = req.params.id;
    const loggedInUserId = req.user._id;

    // Check if the logged-in user is trying to fetch tweets of their own or someone else
    if (loggedInUserId.toString() !== userId) {
      return res.status(403).json({ error: 'You are not authorized to fetch tweets of this user' });
    }

    // Find all tweets by the specified user
    const tweets = await Tweet.find({ tweetedBy: userId }).populate('tweetedBy');

    res.json({ tweets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


module.exports = {
  getSingleUser,
  followUser,
  unfollowUser,
  editUser,
  getUsersAllTweets,
  
}