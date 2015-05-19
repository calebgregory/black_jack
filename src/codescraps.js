/*
 *
// Code scraps:

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
 *
 */
