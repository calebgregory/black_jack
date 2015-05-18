var API = "http://deckofcardsapi.com/api/",
  deckId,
  $newGame = $('input[name="new-game"]'),
  $hit = $('input[name=".hit"]'),
  $stand = $('input[name="stand"]');

$newGame.on("click", newGame());
$hit.on("click", hit());
$stand.on("click", stand());


function Player() {
  this.score = 0;
  this.hand = [];
}


function Dealer() {
  this.toString = function() { return 'DEALER'; };
  // Qualities unique to Dealer,
  // to be written here or perhaps elsewhere,
  // e.g. the requirement that Dealer must stand
  // after score of 16.
}


function Self() {
  this.toString = function() { return 'SELF'; };
  // Qualities unique to Self,
  // to be written here or perhaps elsewhere,
  // e.g. the requirement that Self
}


function game() {
  // Run game here
  // Print introduction to game
  // Wait for user input
  // Simulate the world
  // Render the results to the player
}


function newGame() {
  console.log("New Game works");
}

function hit() {
  console.log("Hit");
}

function stand() {
  console.log("Stand");
}

getJSON('http://deckofcardsapi.com/api/shuffle/?deck_count=6',
        function (d) {
          console.log(d);
        });


function getJSON(url, cb) {

  var JSONP_PROXY = 'https://jsonp.afeld.me/?url=';
  // THIS WILL ADD THE CROSS ORIGIN HEADERS

  var request     = new XMLHttpRequest();

  request.open('GET', JSONP_PROXY + url);

  request.onload  = function() {
    if (request.status >= 200 && request.status < 400) {
      cb(JSON.parse(request.responseText));
    }
  };

  request.send();
}
