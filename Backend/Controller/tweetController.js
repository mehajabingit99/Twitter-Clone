//import Tweet.js
const Tweet = require('../Models/Tweet');
const User = require('../Models/User');

//logic for create tweets
const createTweet = async (req, res) => {
  try {
    const { content, id } = req.body;
    //no content
    if (!content || !id) {
      return res.status(404).json({
        message: 'All fields are required for tweet',
        success: false
      })
    };
    //users id
    const user = await User.findById(id).select("-password");
    //create a new tweet
    const newTweet = new Tweet({
      content,
      tweetedBy: req.user._id,
      userDetails:user
    });

    //save the tweet to the database
    const saveTweet = await newTweet.save();
    res.status(200).json({
      message: "Tweet created successfully",
      saveTweet
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error })
  }
}

//get tweet by id
const getTweetById = async (req, res) => {
  try {
    const id = req.params.id;

    // Fetch the loggedInUser
    const loggedInUser = await User.findById(id);
    console.log('loggedInUser:', loggedInUser);

    // Fetch tweets by the loggedInUser
    const loggedInUserTweets = await Tweet.find({ tweetedBy: id });
    console.log('loggedInUserTweets:', loggedInUserTweets);

    // Fetch tweets by users the loggedInUser is following
    const followingUserTweets = await Promise.all(loggedInUser.following.map(async (otherUserId) => {
      const tweets = await Tweet.find({ tweetedBy: otherUserId });
      console.log(`Tweets by user ${otherUserId}:`, tweets);
      return tweets;
    }));

    // Combine all tweets
    const tweets = loggedInUserTweets.concat(...followingUserTweets);

    return res.status(200).json({ tweets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
}


//like or dislike tweet by id
const likeorDislike = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const tweetId = req.params.id;

    //check if the tweet exist
    const tweet = await Tweet.findById(tweetId);

    //if no tweet
    if (!tweet) {
      return res.status(404).json({ error: 'Tweet not found' });
    }

    // like the tweet
    if (tweet.like.includes(loggedInUserId)) {
      //dislike
      await Tweet.findByIdAndUpdate(tweetId, { $pull: { like: loggedInUserId } });
      return res.status(200).json({
        message: "User disliked your tweet."
      })
    } 
    else {      
      //like
      await Tweet.findByIdAndUpdate(tweetId, { $push: { like: loggedInUserId } });
      return res.status(200).json({
        message: "User liked your tweet."
      })
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

//reply to tweet by id
const replyToTweetById = async (req, res) => {
  try {
    const { content } = req.body;
    //no content
    if (!content) {
      return res.status(404).json({
        message: 'field must be required for tweet',
        success: false
      })
    }
    //create a new tweet
    const newTweet = new Tweet({
      content,
      tweetedBy: req.user._id
    });

    //save the tweet to the database
    const saveTweet = await newTweet.save();
    res.status(200).json(saveTweet);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error })
  }
}

//get all tweets
const getAllTweets = async (req, res) => {
  try {
    const id = req.params.id;

    // Fetch the loggedInUser
    const loggedInUser = await User.findById(id);
    console.log('loggedInUser:', loggedInUser);

    // Fetch tweets by the loggedInUser
    const loggedInUserTweets = await Tweet.find({ tweetedBy: id });
    console.log('loggedInUserTweets:', loggedInUserTweets);

    // Fetch tweets by users the loggedInUser is following
    const followingUserTweets = await Promise.all(loggedInUser.following.map(async (otherUserId) => {
      const tweets = await Tweet.find({ tweetedBy: otherUserId });
      console.log(`Tweets by user ${otherUserId}:`, tweets);
      return tweets;
    }));

    // Combine all tweets
    const tweets = loggedInUserTweets.concat(...followingUserTweets);

    return res.status(200).json({ tweets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

//delete a tweet
const deleteTweetById = async (req, res) => {
  try {
    const { id } = req.params;
    await Tweet.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Tweet deleted successfully",
      success: true
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

//retweet by id
const retweetById = async (req, res) => {
  try {
    const { content } = req.body;
    //no content
    if (!content) {
      return res.status(404).json({
        message: 'field must be required for tweet',
        success: false
      })
    }
    //create a new tweet
    const newTweet = new Tweet({
      content,
      tweetedBy: req.user._id
    });

    //save the tweet to the database
    const saveTweet = await newTweet.save();
    res.status(200).json(saveTweet);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

//export all api's
module.exports = {
  createTweet,
  getTweetById,
  likeorDislike,  
  replyToTweetById,
  getAllTweets,
  deleteTweetById,
  retweetById
}