// A quick code for the generation of cards , which may become
// hilariously necessary if I don't figure this getJSON
// shit out due to lack of internet.

function Card(suit, value) {
  this.suit = suit;
  this.value = value;
}

function deck(numOfDecks) {
  var cards = [];
  var p = 0;
  for (var n = 0; n < numOfDecks; n++) {
    for (var i = 0 ; i < 4; i++) {
      var card = {};
      var s;
      switch (i) {
        case 0:
          s = "CLUBS";
          break;
        case 1:
          s = "DIAMONDS";
          break;
        case 2:
          s = "HEARTS";
          break;
        case 3:
          s = "SPADES";
          break;
      }
      card.suit = s;
      for (var j = 2; j < (2 + 13); j++) {
        var v;
        switch (j) {
          case 11:
            v = "JACK";
            break;
          case 12:
            v = "QUEEN";
            break;
          case 13:
            v = "KING";
            break;
          case 14:
            v = 'ACE';
            break;
          default:
            v = j;
        }
        card.value = v;
        cards[p] = new Card (s, v);
        p++;
      }
    }
  }
  return cards;
}
