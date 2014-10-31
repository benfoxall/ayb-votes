# ayb-votes

## WARNING

This is very **very** hacked together and delicate.  There are definitely ways to build this in a more robust and maintainable way, but those ways are not here.

## running

This is more for reference, but if you really want to run it - find/replace the following keys

for vote gathering:
* `PUBNUB_PUB_KEY` (`demo` should work)
* `PUBNUB_SUB_KEY` (`demo` should work)

for looking up twitter handles
* `TWITTER_CONSUMER_KEY`
* `TWITTER_CONSUMER_SECRET`
* `TWITTER_ACCESS_TOKEN`
* `TWITTER_ACCESS_TOKEN_SECRET`

for adding streaming data, and sharing with clients
* `FIREBASE_AUTH_TOKEN`
* `your-firebase.firebaseio.com`

---

you can also run some debug stuff without any keys,  launch the talk (see below) and click "dev script" to run through a list of steps.

Or manually: `text`, `add 20`, `vote 0.5`, `text d3`, `add 20`, `circles`, `vote 0.5`, {`hello`, `vote 0.2`}*, `timeline`, `labelled`, `bars`, `comparison`, `twitter`, `assign handles`, [here on, you need twitter keys], `request (50) handles`, `twitter followers step`,`twitter followers step`,`twitter followers step`, `twitter final`, [here on, you need firebase], `connectFB`, `connectFB Public`.



### The talk

```
npm install
node talk/app.js
```

http://localhost:3000


### Client
```
gulp
```

http://localhost:5000


### Tweet stream -> firebase

```
node talk/tweet-server.js
```