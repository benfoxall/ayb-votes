// listen to a firebase and populate links and highlights

var Firebase = require("firebase");
var tweets = require('tweets');

var ayb = new Firebase("https://your-firebase.firebaseio.com/");

ayb.authWithCustomToken("FIREBASE_AUTH_TOKEN", function(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Login Succeeded!");
  }
});


var stream = new tweets({
  consumer_key:        'TWITTER_CONSUMER_KEY',
  consumer_secret:     'TWITTER_CONSUMER_SECRET',
  access_token:        'TWITTER_ACCESS_TOKEN',
  access_token_secret: 'TWITTER_ACCESS_TOKEN_SECRET'
});




function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};



var users = [];
var screen_names = [];




var last;
var updateStream = debounce(function(){
	var tre = /^@?(\w){1,15}$/;
	if(users.length){
		var follow = users
					 .filter(function(str){
				 		return str.match(tre);
					 })
					 .slice(0,5000)
					 .join(',')

		if(last === follow)
			return console.log("not re-following ", last = follow);


		console.log("TWITTER, follow = " + follow);
		stream.filter({follow: follow});
	} else {

		if(last === ' ac') 
			return console.log("not re-following ", last = ' ac');

		console.log("TWITTER, track = adventureclub");
		stream.filter({track: 'adventureclub'});
	}

}, 2000) // this is more to avoid multiple updates from FB (which probably doesn't happen)



ayb.child('users').on('value', function (snapshot) {
	users = [];// = Object.keys(snapshot.val() || {});
	screen_names = []

	snapshot.forEach(function(d){
		var u = d.val();
		if(u.id_str) users.push(u.id_str)
		if(u.handle) screen_names.push(u.handle)
	})

	updateStream();

	// console.log(users.join(','))
})





stream.on('error',function(){
  console.log("tweets error", e);
})

stream.on('reconnect', function(reconnect){
  console.log("reconnect", reconnect)
  if(reconnect.type == 'rate-limit'){
    // do something to reduce your requests to the api
  }
});

stream.on('tweet', function(tweet){
	return;

console.log(tweet.user.screen_name, tweet.text);

  try{
  	var user = tweet.user.screen_name;

  	if(tracking(user)){
  		tweet.entities.user_mentions.forEach(function(mention){
  			var user2 = mention.screen_name;

  			if(tracking(user2)){
  				console.log("FOUND: ", user, user2);

				ayb
					.child('links')
					.child(user + ' ' + user2)
					.set(+ new Date)
  			}
  		})
  	}
  } catch (e){
  	console.log("lolwat", e)
  }

});


function tracking(screen_name){
	return screen_names.indexOf(screen_name) > -1
}


// DEV

function populate(){

	var u1 = randomUser(),
		u2 = randomUser();

	if(u1 && u2 && u1 !== u2){
		ayb
			.child('links')
			.child(u1 + ' ' + u2)
			.set(+ new Date)
	}

	setTimeout(populate, Math.random() * 10000)
}


// populate();

function randomUser(){
	return screen_names[
		Math.floor(Math.random()*screen_names.length)
	]
}