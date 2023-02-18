const express = require('express');
var cors = require('cors');
const app = express();
app.use(cors());
const router = express.Router();
const { TwitterApi } = require('twitter-api-v2');
const port = 3001;

const dotenv = require("dotenv")

dotenv.config()

const BearerToken = process.env.BEARER_TOKEN;



app.get('/api/tweet',async (req, res) => {
    const twitterClient = new TwitterApi(BearerToken);
    
    let tweetId = req.query.tweetId;
    
    const tweet = await twitterClient.v2.singleTweet(tweetId, {
              expansions: [
                'entities.mentions.username',
                'in_reply_to_user_id',
              ],
            });
    
    const axios = require('axios');
          
    // Make a GET request to the Twitter API to get the details of the tweet
    const tweetResponse = await axios.get(
      `https://api.twitter.com/1.1/statuses/show.json?id=${tweetId}`,
      {
        headers: {
          Authorization: `Bearer ${BearerToken}`
        }
      }
    );
    
          let mediaUrl
            // Extract the tweet details from the response
            const tweetr = await tweetResponse.data;
            if (tweetr.entities.media) {
              // loop through the media entities array
              tweetr.entities.media.forEach(mediaEntity => {
                // Extract the media url from the media entity
                 mediaUrl = mediaEntity.media_url_https;
              })
            }  
            const tweettext = tweet.data.text;
            const name = tweetr.user.name;
            const username = tweetr.user.screen_name;
            const profilepic =tweetr.user.profile_image_url_https;
            const date = tweetr.created_at;
            console.log(tweetr)
           
           

    res.json({ 
      username: username,
      tweettext: tweettext,
      date: date,
      profilepic: profilepic,
      name: name,
      pic: mediaUrl
    });
      
})

app.listen(port , ()=>{
    console.log(`Listening on port at http://localhost:${port}`)
})
module.exports = router;
