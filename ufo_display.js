const ufo = require('./ufo_images');

const displayUfo = (numOfIncorrectGuesses) => {
  if (numOfIncorrectGuesses <= 6) {
    console.log(ufo[numOfIncorrectGuesses]);
  } else {
    console.log('game over');
  }
};

module.exports = { displayUfo };
