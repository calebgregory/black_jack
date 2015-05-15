var API = "http://deckofcardsapi.com/api/",
  deckId,
  $newGame = $(".new-game"),
  $hit = $(".hit"),
  $stand = $(".stand"),
  dealerHand = [];
  playerHand = [];

$newGame.on("click", newGame);
$hit.on("click", hit);

getJSON('http://deckofcardsapi.com/api/shuffle/?deck_count=1', function (d) {
  console.log(d);
});

function getJSON(url, cb) {
  var JSONP_PROXY = 'https://jsonp.afeld.me/?url=';
  // THIS WILL ADD THE CROSS ORIGIN HEADERS

  var request = new XMLHttpRequest();

  request.open('GET', JSONP_PROXY + url);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      cb(JSON.parse(request.responseText));
    }
  };

  request.send();
}
