const express = require('express')
const app = express()

app.get('api/hello', function(req, res) {
	res.json({message: "hello world"});
})

const port = process.env.PORT || 3001;
app.listen(port, function() {
	console.log("server listening on port" + port)
})


var twit = require('twitter'),
		client = new twit({
			consumer_key: 'QNOEf6TGC7GodQQ8gFnz7pi0O',
			consumer_secret: '5eteuuY6PCBKYEb2KOEPOeKd5UC9G1QCRx5E8l5KKlFgLpUpcW',
			access_token_key: '942127445359996934-qJmLD7ykBvaEuvvnszN5IQDRup4x24M',
			access_token_secret: 'Zc7948PeeQ5WS5PMqMwTinsHz2VlheWWADppOUWpIfYG7'
		});
		
var count = 0, 
		util = require('util');

var path = 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=FoxNews&count=2';
client.get(path, function(er, tw, res) {
	if(er) throw er;
	console.log(tw);
	console.log(res);
});