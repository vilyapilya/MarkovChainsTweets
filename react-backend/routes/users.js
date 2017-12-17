var express = require('express');
var router = express.Router();
var Twitter = require('twitter');

// var client = new Twitter({
// 	consumer_key: 'QNOEf6TGC7GodQQ8gFnz7pi0O',
//   consumer_secret: '5eteuuY6PCBKYEb2KOEPOeKd5UC9G1QCRx5E8l5KKlFgLpUpcW',
//   access_token_key: '942127445359996934-qJmLD7ykBvaEuvvnszN5IQDRup4x24M',
//   access_token_secret: 'Zc7948PeeQ5WS5PMqMwTinsHz2VlheWWADppOUWpIfYG7'
// })
// var data = "";

// client.get('search/tweets', {q: 'node.js'})
// 	.then(function (tweet){
		
// 	});
	
var path = "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=FoxNews&count=2"

// client.get(path, function(error, tweet, response){
// 	console.log(error)
// 	console.log(tweet)
// 	res = tweet;
// });

/* GET users listing. */
router.get('/', function(req, res, next) {
 res.json([{
  	id: 1,
  	username: "samsepi0l"
  }, {
  	id: 2,
  	username: "D0loresH4ze"
  }]);

});

module.exports = router;