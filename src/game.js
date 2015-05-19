/*
 * What follows is a command line interface (CLI)
 * blackjack app.  But this is no ordinary blackjack
 * game.  In this blackjack game, there are Two types
 * of PLAYERS : the DEALER, and the SELF.
 *
 * A DEALER operates upon certain principles, which
 * have been defined to be deterministic, while the SELF,
 * With Whom you Indentify for the Duration of the Game,
 * operates with Personal Choice within certain
 * Constraints.
 *
 * More than a game, this app is a poem, philosophical
 * instigator, or meditation guide, something that built
 * itself from my efforts to learn to play the text
 * editor VIM, which has required me to Take One Step
 * At A Time.
 *
 * Throughout game play, there will be messages that
 * are transmitted 'from the machine' to the player.
 *
 * For example, if you lose three hands in a row, a
 * product of pure carelessness, the 'machine' tells
 * you to quit playing the game and go on a walk instead.
 * The way you can win the game is by typing 'quit' and
 * hitting 'enter'. Then the 'machine' congratulates you
 * for having won the game!
 *
 * The code is by no means finished. There are many game
 * features lacking. Future goals include, however,
 *
 *      - Multiple rounds of game play with a Score
 *      - ASCII art playing cards
 *          and
 *      - Animated game play, using the
 *          while (true)
 *          {
 *            processInput();
 *            update();
 *            render();
 *          }
 *        game loop paradigm.
 *
 * Other funny features could include betting - which
 * to code isn't that difficult, but philosophically
 * can be QUITE THE UNDERTAKING - and a high scores
 * bracket that lists all the times you've quit the game -
 * that is, 'won'.
 *
 * CALEB GREGORY, 18 MAY 2015
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


// A welcome message to the new Player.
// I considered some animated wisecracks, such as
//   #= What traits does a Player have?
//   #=   *~ A fresh car?
//   #=   *~ Substanital loads of cash?
//   #=   *~ Ability to emulate abusive father?
//   #= OH, not THAT kind of player!
// but will probably not include these particulary.
function welcome() {
  console.log([ '#=              ~ blackjack ~              =#',
                '#= Welcome to this game of cards, PLAYER!  =#',
                '#= You are here to enjoy the interaction   =#',
                '#= of your intentions and blind chance.    =#',
                '#=                                         =#',
                '#= In this game, there are two types of    =#',
                '#= players:                                =#',
                '#=                                         =#',
                '#=        DEALER      &       SELF.        =#',
                '#=                                         =#',
                '#= For the duration of this game, you      =#',
                '#= will identify as SELF.                  =#',
                '#=                                         =#',
                '#= To receive another card, enter \'hit\'.   =#',
                '#= To stick it out, enter \'stand\'.         =#',
                '#=                                         =#'
              ].join('\n').yellow);
}


// A prompt for the Self.
function prompt() {
  var arrow  = '> ',
      length = arrow.length;

  rl.setPrompt(arrow.grey, length);
  rl.prompt();
}


// Game functions


function gameSq() {


  // Some quick code for the generation of cards.
  // This has become hilariously necessary because
  // after an entire day spent trying to get my API to
  // connect to my app, it is still failing. ¯\_(ツ)_/¯

  // I am writing these particular cards this way to
  // imitate the format of the cards returned from the
  // API 'http://deckofcardsapi.com/api/'.
  // This was an API we were given in class to use for a
  // webgame. I wanted to do a command line app, and that
  // led me here.

  function ApiCard(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }

  function deck(numOfDecks) { // Blackjack often uses 6 decks

    var cards = [];
    var p = 0;

    for (var n = 0; n < numOfDecks; n++) {

      for (var i = 0 ; i < 4; i++) {

        var card = {};

        // Trying not to even look at any ifs
        card.suit =
          (i === 0) ? 'CLUBS'
        : (i === 1) ? 'DIAMONDS'
        : (i === 2) ? 'HEARTS'
                    : 'SPADES';

        for (var j = 2; j < (2 + 13); j++) {

          card.rank =
            (j === 11) ? 'JACK'
          : (j === 12) ? 'QUEEN'
          : (j === 13) ? 'KING'
          : (j === 14) ? 'ACE'
                       : j;

          cards[p] = new ApiCard (card.suit, card.rank);
          p++;
        }
      }
    }

    return cards;
  }


  // Constructor function for a Card. Adds methods like
  // toString and getValue. Written such as it is to
  // handle data from the aforementioned API.

  function Card(suit, rank) {
    this.suit     = getSuit(suit);
    this.rank     = getRank(rank);
    this.toString = function () {
      return (this.suit === '♦' || this.suit === '♥') ?
        [this.rank, this.suit].join('').red :
        [this.rank, this.suit].join('');
    };
    this.value = function() {
      return (this.rank === 'J'
           || this.rank === 'Q'
           || this.rank === 'K') ? 10
           : (this.rank === 'A') ? ace()
                                 : parseInt(this.rank);
    };
  }

  function getSuit(s) {
    return (s === 'CLUBS')    ? '♧'
         : (s === 'DIAMONDS') ? '♦'
         : (s === 'HEARTS')   ? '♥'
                              : '♤';
  }

  function getRank(r) {
    return (r === 'JACK')  ? 'J'
         : (r === 'QUEEN') ? 'Q'
         : (r === 'KING')  ? 'K'
         : (r === 'ACE')   ? 'A'
                           : r;
  }


  // Constructor function for the Dealer.  A dealer must
  // draw a card until they reach a round total of 16.

  function Dealer() {
    this.canMove  = function() { return this.total < 17; };
    this.move     = function() {
      if (this.canMove()) {
        var card = getCard();
        this.hand.push(card);
        this.total += card.value();
      }
    };
  }
  Dealer.prototype = new Player('DEALER');

  // Constructor function for the Self. The Self 'busts'
  // if their total is over 21. Adds method hit.
  // Features for the future include a property for
  // money pool, and if I choose to go this route,
  // betting methods bet(amt), split, doubleDown,
  // surrender, insurance, and push.

  function Self() {
    this.isAlive = function() { return this.total < 22; } ;
    this.hit     = function() {
      var card = getCard();
      this.total += card.value();
      this.hand.push(card);
    };
  }
  Self.prototype = new Player('SELF  ');


  // Constructor function for a Player. Adds method
  // toString.

  function Player(name) {
    this.total    = 0;
    this.hand     = [];
    this.name     = name;
    this.toString = function () {
      return [this.name, ': [', this.total, '] ',
        this.hand.join(' ')].join('');
    };
  }


  // Constructor function for the Game. Creates a game
  // with two players, the dealer and the self, and adds
  // methods deal and displayGame.
  // Features for the future include parameters round <num>,
  // a method that toggles the visibility of the dealer's
  // first card.

  function Game() {
    this.self        = new Self();
    this.dealer      = new Dealer();
    this.deal        = function() {
      for (var i = 0; i < 2; i++) {
        this.dealer.move();
        // hideDealerFirstCard();
        this.self.hit();
      }
    }
    this.displayGame = function() {
      console.log([this.dealer.toString(),
        this.self.toString() + '\n'].join('\n'));
    }
  }


  // Initialize the game.

  var game     = new Game();
      self     = game.self,
      dealer   = game.dealer,
      gamedeck = deck(6);


  // In need of a shuffle method, but here's a crude substitute.

  function getCard() {
    var card = gamedeck.splice(Math.floor(Math.random() * 52), 1)[0];
    return new Card(card.suit, card.rank);
  }

  // Ha ha : the following ace funciton has to be here
  // because as things currently stand, it needs game.self
  // to be defined prior to its declaration for it to work.
  //  . . . ¯\_(ツ)_/¯

  function ace() {
    // Toggles the value of Ace depending on Self's score
    return (game.self.total < 11) ? 11 : 1;
  }


  game.deal();

  (function gameloop() {

    console.log('alive:',self.isAlive()); //&#!$
    game.displayGame();

    if (self.isAlive()) {

      rl.question('hit or stand? \n', function(answer) {

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

      console.log('You lost.');
      rl.question('play again? y or n\n', function(answer) {

        switch(answer) {
          case 'y':
            gameSq();
            break;
          case 'n':
            quit();
            break;
          default:
            quit();
        }

      })

    }

    prompt();

  } ()); // The gameloop calls itself *~ Some Ouroboros action ~?
}


function quit() {
  console.log('#= ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ =#',
              '#=                                         =#',
              '#=      C O N G R A T U L A T I O N S      =#',
              '#=                                         =#',
              '#=         You have beat the game!         =#',
              '#=                                         =#',
              '#=     Now go enjoy a walk outside and     =#',
              '#=     feel as much as you can the         =#',
              '#=     passage of the outside air into     =#',
              '#=     your fleshy lungs.                  =#',
              '#=                                         =#',
              '#=                                         =#',
              '#= ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ =#'.rainbow);
  process.exit(0);
}


// Startup Sequence

welcome();

rl.question('#= To begin playing, type \'start\'.         =#\n'.yellow,
  function(answer) {
    (answer === 'start') ? gameSq()
    : function() {
      console.log('huh?');
      prompt();
    }
})
