require('dotenv').config()
var express = require('express');
var Twitter = require('twitter');
var router = express.Router();
var TwitterTokenStrategy = require('passport-twitter-token');
var passport = require('passport')
var OAuth2 = require('OAuth').OAuth2; 
var https = require('https');
var oauth2 = new OAuth2(process.env.TWITTER_CONSUMER_KEY, process.env.TWITTER_CONSUMER_SECRET, 'https://api.twitter.com/', null, 'oauth2/token', null);

oauth2.getOAuthAccessToken('', {
    'grant_type': 'client_credentials'
}, function (e, access_token) {
     
    var getOp = function(op) {
      return ({
        hostname: 'api.twitter.com',
        path: `/1.1/statuses/user_timeline.json?screen_name=${op}&count=500000&tweet_mode=extended&exclude_replies=true&trim_user=true`,
        headers: {
            Authorization: 'Bearer ' + access_token
        }
      });
    }
      
    router.get('/v1/users/:username', function(req, res, next) {
      var username = req.params.username;
      
      https.get(getOp(username), function (result) {
        var buffer = '';
        result.setEncoding('utf8');
        result.on('data', function (data) {
            buffer += data;
        });
        result.on('end', function () {
            var tweets = JSON.parse(buffer);
            console.log(result.statusCode)
            console.log(result.statusCode !== 200)
            if(result.statusCode !== 200) {
              res.json({"error": "user does not exist"})
            } else if(tweets.length <= 0) {
              res.json({"error": "did not find any tweets"})
            } else {
              res.json(tweets)
            }
        });
      });
    });
});

module.exports = router;