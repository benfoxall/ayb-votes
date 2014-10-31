/*
  Prior live - switch to localstorage
*/

(function(){

var pubnub, 
    self, // uuid of this client
    channel_public = 'ayb-public',
    channel_votes  = 'ayb-votes';

localStorage.setItem('uuid',
  self = localStorage.getItem('uuid') || PUBNUB.uuid()
)


pubnub = PUBNUB.init({
  publish_key   : 'PUBNUB_PUB_KEY',
  subscribe_key : 'PUBNUB_SUB_KEY',
  uuid          : self
})

pubnub.subscribe({
  channel  : channel_public,
  message  : handle_messages,
  backfill : true,
  connect  : function(){
    document.getElementsByTagName('html')[0].className = 'connected';
  }
  // state    : {some:'state', rnd: Math.random()}
})


// should leave this in?
setInterval(function(){pubnub.publish({channel:'partyping',message:{m:Math.random()}})},12000)



var timeout;

function handle_messages(message){
  if(message.section){
    // console.log(message.section)
    var sections = document.getElementsByClassName('section');
    for (var i = sections.length - 1; i >= 0; i--) {
      if(sections[i].id == message.section){
        sections[i].classList.add('on');
      } else {
        sections[i].classList.remove('on');
      }
    }

    // handle twitter vis (only connects once slide is shown)
    // unless there is a start in the *next* few moments (from backfill)
    if(message.section == 'twitterVis'){
      clearTimeout(timeout)
      timeout = setTimeout(startVis, 500)
    }
    if(message.section == 'start'){
      clearTimeout(timeout)
    }
  } else {
    console.log("unhandled message", message)
  }

  // if(message.action == 'show-twitter'){
  //   document.getElementById('tw-form').style.display = 'block';

  // } else if(message.action == 'hide-votes'){
  //   document.getElementById('vote').style.display = 'none';
    
  // } else {
  //   console.log("unhandled message", message)
  // }
}


// debounce button, with visual feedback
var voteButton = document.getElementById('vote'),
    voteClass = voteButton.className,
    ready     = true,
    timer;

bean.on(voteButton, 'click', function(){
  clearTimeout(timer);
  timer = setTimeout(function(){
    ready = true;
    voteButton.className = voteClass;
  }, 2000);

  if(ready){
    voteButton.className = voteClass + ' active'
    ready = false;

    // do stuff

    pubnub.publish({
      channel: channel_votes,
      message: {
        action:'vote',
        id:self
      }
    })
  }
}, false)



/// Twitter Form

var form = document.getElementById('tw-form'),
    input = document.getElementById('tw-input'),
    handle = document.getElementById('tw-handle');


bean.on(form, 'submit', function(e){
  e.preventDefault();

  if(input.value){

    var v = (input.value.indexOf(0) === '@' ? '' : '@') + input.value;

    pubnub.publish({
      channel: channel_votes,
      message: {
        action:'twitter',
        id:self,
        handle:v
      }
    })

    form.style.display = 'none';
    handle.style.display = 'block';
    handle.innerText = v

  }

})



// Twitter Vis

var started;
function startVis(){
  if(started) return;

  var ayb = new Firebase("https://your-firebase.firebaseio.com/");

  var w = window.innerWidth, h = window.innerHeight;

  var avatars = d3.select("#twitterVis").append("div")
      .attr('class', 'avatars')
      .style("width", w + 'px')
      .style("height", h + 'px')
      .selectAll('.avatar');


  var vis = d3.select("#twitterVis").append("svg")
        .attr("width", w)
        .attr("height", h);


  var link = vis.selectAll("line").data([]);


  // var defs = vis.append("svg:defs");

  var force = d3.layout.force()
      .nodes([])
      .links([])
      .linkDistance(w/10)
      .gravity(0.02)
      .size([w, h]);

    //force.linkDistance(w/10).start().gravity(0.02)

  var prefix = "-webkit-transform" in document.body.style ? "-webkit-"
      : "-moz-transform" in document.body.style ? "-moz-"
      : "";

  force.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
    avatars
      .style(prefix+"transform", function(d) { return "translate3d(" + d.x + "px," + d.y + "px,0px)"; });
  });



  // cache users for adding new ones
  var d3cache = {};

  ayb.child('users').on('value', function (snapshot) {

    var nodes = [];
    snapshot.forEach(function(d){
      var u = d.val();
      nodes.push((d3cache[u.handle] = d3cache[u.handle] || u))
    })

          avatars = avatars.data(nodes)

          avatars
            .enter()
              .append('a')
              .attr('class', 'avatar')
              .attr('href', function(d){ return 'https://twitter.com/' + d.handle})

    avatars
      .exit()
        .remove();

    avatars
      .style({
        'background-color': function(d){return '#' + d.twitter_bg},
        'background-image': function(d){return 'url(' + d.twitter_image + ')'}
      })

    force.nodes(nodes).start();

  }, function (errorObject) {
    console.log('The read failed: ' + errorObject.code);
  });


  //child_added
  ayb.child('links').on('value', function (snapshot) {
    var value = snapshot.val();
    // console.log(value)

    var links = [];

    for(var p in value){
      if(value.hasOwnProperty(p)){
        var parts = p.split(' '),

        a = d3cache[parts[0]],
        b = d3cache[parts[1]];

        if(a && b)
          links.push({
            source: a, 
            target: b
          })
      }
    }

    link = link
          .data(links);

    link
      .enter().append("line");

    link
      .exit().remove();

    force.links(links).start()



  })

}





Waves.displayEffect();








})();


