/*
 * A command line interface Blackjack game.
 */

var readline = require('readline'),
    request  = require('request-json'),
    client   = request.createClient('http://localhost:8888/'),
    colors   = require('colors'), // npm install colors
    rl       = readline.createInterface(process.stdin,
                                        process.stdout,
                                        completer), // on line 18
    help     = [ '.help      ' + 'display this message.',
                 '.q[uit]    ' + 'exit console.'
               ].join('\n');

// Establishes which words we will enable a user to have
// upon pressing tab, and handles the generation of the
// returned value.

function completer(line) {
  var completions = '.help .exit .quit .q .hit .stand .start'.split(' ');
  var hits        = completions
                    .filter(function(c) {
    if (c.indexOf(line) === 0) {
      return c;
    }
  });
  return [hits && hits.length ? hits : completions, line];
}


function welcome() {
  console.log([ '#=              ~ blackjack ~             =#',
                '#= Welcome to this game of cards, PLAYER! =#',
                '#= You are here to enjoy the interaction  =#',
                '#= of your intentions and blind chance.   =#',
                '#=                                        =#',
                '#= In this game, there are two types of   =#',
                '#= players:                               =#',
                '#=                                        =#',
                '#=        DEALER      &       SELF.       =#',
                '#=                                        =#',
                '#= For the duration of this game, you     =#',
                '#= will identify as SELF.                 =#',
                '#=                                        =#',
                '#= To receive another card, enter \'hit\'.  =#',
                '#= To stick it out, enter \'stand\'.        =#'
              ].join('\n').yellow);
}


function prompt() {
  var arrow  = '> ',
      length = arrow.length;

  rl.setPrompt(arrow.grey, length);
  rl.prompt();
}


// Game functions


var game;


function gameSq() {


  // Some quick code for the generation of cards.
  // This has become hilariously necessary because
  // after an entire day spent trying to get my API to
  // connect to my app, it is still failing.
  function Card(suit, rank) {
    this.suit = suit;
    this.rank = rank;
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
          var r;
          switch (j) {
            case 11:
              r = "JACK";
              break;
            case 12:
              r = "QUEEN";
              break;
            case 13:
              r = "KING";
              break;
            case 14:
              r = 'ACE';
              break;
            default:
              r = j;
          }
          card.rank = r;
          cards[p] = new Card (s, r);
          p++;
        }
      }
    }
    return cards;
  }


  function GameCard(suit, rank) {
    this.suit     = getSuit(suit);
    this.rank     = getRank(rank);
    this.toString = function () {
                      return (this.suit === '♦' || this.suit === '♥') ?
                        [this.rank, this.suit].join('').red :
                        [this.rank, this.suit].join('') ;
                    };
    this.getValue = function() {
      return (  this.rank === 'J'
             || this.rank === 'Q'
             || this.rank === 'K' ) ? 10    :
              ( this.rank === 'A' ) ? ace() :
                                      parseInt(this.rank);
                    };
  }

  function getSuit(s) {
    switch (s) {
      case "CLUBS":
        return '♧';
      case "DIAMONDS":
        return '♦';
      case "HEARTS":
        return '♥';
      case "SPADES":
        return '♤';
    }
  }

  function getRank(r) {
    switch (r) {
      case 'JACK':
        return 'J';
      case 'QUEEN':
        return 'Q';
      case 'KING':
        return 'K';
      case 'ACE':
        return 'A';
      default:
        return r;
    }
  }


  function Player(name) {
    this.total    = 0;
    this.hand     = [];
    this.name     = name;
    this.toString = function () {
                      return '' + this.name +
                      ': [' + this.total + '] ' +
                      this.hand.join(' ');
                    };
  }

  function Dealer() {
    this.canMove  = function() {
                     return this.total < 17;
                   };
    this.move     = function() {
                      var card = getCard();
                      this.canMove() ? this.hand.push(card) : null;
                      this.total += card.getValue();
                    };
  }
  Dealer.prototype = new Player('DEALER');


  function Self() {
    this.isAlive = function() {
                     return this.total < 22;
                   };
    this.hit     = function() {
                     var card = getCard();
                     this.hand.push(card);
                     this.total += card.getValue();
                   };
  }
  Self.prototype = new Player('SELF  ');


  // Creates a game with two players, Dealer and Self,
  // and grabs the deckId.
  function Game() {
    // this.deckId = deckId();
    this.self        = new Self();
    this.dealer      = new Dealer();
    this.deal        = function() {
      for (var i = 0; i < 2; i++) {
        this.dealer.move();
        this.self.hit();
      }
    }
    this.displayGame = function() {
      console.log([this.dealer.toString(),
                  this.self.toString() + '\n'].join('\n'));
    }
  }


  game = new Game();

  var self = game.self;
  var dealer = game.dealer;

  // Ha ha : this has to be here because it needs
  // game.self to be defined for it to work . . .
  // ¯\_(ツ)_/¯
  function ace() {
    // Toggles the value of Ace depending on Self's score
    return (game.self.total < 11) ? 11 : 1; // I don't know if this works
  }

  var gamedeck = deck(6);

  function getCard() {
    var card = gamedeck.splice(Math.floor(Math.random() * 52), 1)[0];
    return new GameCard(card.suit, card.rank);
  }

  game.deal();

  (function gameloop() {
    console.log('alive:',self.isAlive()); //&#!$
    game.displayGame();
    if (self.isAlive()) {
      rl.question('hit or stand? \n', function(answer){
        switch (answer) {
          case 'hit':
            self.hit();
            dealer.move();
            gameloop();
            break;
          case 'stand':
            dealer.move();
            gameloop();
            break;
          case 'quit':
            quit();
        }
      })
    } else {
      console.log('You died.');
      quit();
    }
    prompt();
  } ());
}


function quit() {
  console.log('GOODBYE MESSAGE'.blue);
  process.exit(0);
}


// Game sequence:


welcome();

rl.question('#= To begin playing, type \'start\'.        =#\n'.yellow,
            function(answer) {
              (answer === 'start') ? gameSq() : function() {
                console.log('huh?');
                prompt();
              }
})


// Code scraps:
/*

  var API_URL   = 'http://deckofcardsapi.com/api/';
  var API_PROXY = 'https://jsonp.afeld.me/?url=';

  function deckId() {
    client.get(API_PROXY + API_URL + 'shuffle/?deck_count=6',
      function(error, response, body) {
        // check for error
        if (error) {
          return console.log('Error: ', error);
        }
        // check for right status code
        if (response.statusCode !== 200) {
          return console.log('Invalid status code returned:',
                             response.statusCode);
        }
        // all's well. send body.deck_id on its way.
        return body.deck_id;
      });
  }


  function getCard() {
    client.get(API_PROXY + API_URL + game.deckId + '/?count=1',
      function(error, response, body) {
       if (error) {
         return console.log('Error: error');
       }
       if (response.statusCode !== 200) {
         return console.log('Invalid status code returned:',
                            response.statusCode);
       }
       return new Card(body.cards[0].suit, body.cards[0].value);
       // NEED TO FIND OUT HOW TO MAKE THIS HAPPEN             });
      });
  }
*/

/*
function exec(command) {
  // Ignore blank commands
  if (command.length === 0) {
    prompt();
    return;
  }

  switch (command) {
    case 'hit':
      console.log('hit');
      prompt();
      break;
    case 'stay':
      console.log('stay');
      prompt();
      break;
    case 'start':
      gameSq();
      prompt();
      break;
    case 'deckid':
      deckId();
      break;
    case 'datatest':
      datatest();
      break;
    case 'quit':
      quit();
  }
}


// Set up
rl.on('line', function(cmd) {
  exec(cmd.trim());
}).on('close', function() {
  // only gets triggered by ^C or ^D
  console.log('GOODBYE MESSAGE'.blue);
  process.exit(0);
});
*/
