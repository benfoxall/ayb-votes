// *******************
// file server on 3000

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    bodyParser = require('body-parser'),
    fs = require('fs');

// serve static files
app.use(express.static(__dirname));
server.listen(3000);

console.log("file server - http://localhost:3000");



var Twit = require('twit')

var T = new Twit({
    consumer_key:         'TWITTER_CONSUMER_KEY'
  , consumer_secret:      'TWITTER_CONSUMER_SECRET'
  , access_token:         'TWITTER_ACCESS_TOKEN'
  , access_token_secret:  'TWITTER_ACCESS_TOKEN_SECRET'
})


var urlencodedParser = bodyParser.urlencoded({ extended: true })

app.post('/twitter_handles', urlencodedParser, function(req,res){

	console.log(req.body)

	var handles = req.param('handles');

	if(!handles){
		return res.send({error:"no handles"})
	} else {

		// attempt to clean up the handles a bit
		var tre = /^@?(\w){1,15}$/;

		var hs = handles
		.map(function(h){
			return h.replace('@', '').trim()
		})
		.filter(function(h){
			return h.match(tre);
		})

		T.post('users/lookup', { screen_name: hs.join(','), include_entities: 'false' }, 
			function(err, data, response) {
			  if(err) res.send({error:err})
			  else res.send(data)
		})
	}

})

/*
GRRRRRRRRR
app.post('/twitter_friendships', urlencodedParser, function(req,res){

	console.log(req.body)

	var handles = req.param('handles');

	if(!handles){
		return res.send({error:"no handles"})
	} else {

		// attempt to clean up the handles a bit
		var tre = /^@?(\w){1,15}$/;

		var hs = handles
		.map(function(h){
			return h.replace('@', '').trim()
		})
		.filter(function(h){
			return h.match(tre);
		})

		T.post('friendships/lookup', { screen_name: hs.join(',') }, 
			function(err, data, response) {
			  if(err) res.send({error:err})
			  else res.send(data)
		})
	}

})
*/