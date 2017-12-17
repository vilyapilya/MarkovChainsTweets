var express = require('express');
var Twitter = require('twitter');
var router = express.Router();

var client = new Twitter({
 consumer_key: 'QNOEf6TGC7GodQQ8gFnz7pi0O',
  consumer_secret: '5eteuuY6PCBKYEb2KOEPOeKd5UC9G1QCRx5E8l5KKlFgLpUpcW',
  access_token_key: '942127445359996934-qJmLD7ykBvaEuvvnszN5IQDRup4x24M',
  access_token_secret: 'Zc7948PeeQ5WS5PMqMwTinsHz2VlheWWADppOUWpIfYG7'
})

router.get('/index', function(req, res, next) {
  client.get('statuses/user_timeline', {screen_name: 'realDonaldTrump', count: 10000, tweet_mode: 'extended'}, function(error, tweet, response){
  if(error) throw error
  res.json(tweet);
 });
});

module.exports = router;