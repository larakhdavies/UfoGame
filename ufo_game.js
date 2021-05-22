const util = require('./ufo_utils.js');
const { displayUfo } = require('./ufo_display.js');

class UfoGame {
  codeword = '';
  codewordMap = new Map();
  incorrectGuesses = new Set();
  correctGuesses = new Set();
  placeholders = [];
  nouns = [];
  messages = [];

  constructor() {
    this.nouns = util.readNounsFile();
    this.messages = util.readMessagesFile();
  };

  initGame() {
    this.resetState();
    this.codeword = util.getRandomElement(this.nouns);
    this.codewordMap = util.mapLetterToIndex(this.codeword);
    this.placeholders = util.createPlaceholders(this.codeword.length);

    util.displayHeading();
    this.nextGuess();
  };

  resetState() {
    this.codeword = '';
    this.codewordMap = new Map();
    this.incorrectGuesses = new Set();
    this.correctGuesses = new Set();
    this.placeholders = [];
  };

  getGuessAndVerifyMatch() {
    util.promptForLetterInput('Please enter your guess: ', (charInput) => {
        const char = charInput.toLowerCase();
        if(this.incorrectGuesses.has(char) || this.correctGuesses.has(char)) {
          console.log('\nYou can only guess that letter once, please try again.\n');
          this.getGuessAndVerifyMatch();
        } else if(this.codewordMap.has(char)) {
          const indexesOfChar = this.codewordMap.get(char);
          this.correctGuess(char, indexesOfChar);
        } else {
          this.incorrectGuess(char);
        }
    });
  };

  playAgainPrompt() {
    util.promptForLetterInput('\nWould you like to play again (Y/N)? ', (answer) => {
      if(answer === 'Y' || answer === 'y'){
        this.initGame();
      } else {
        console.log('Goodbye!')
        util.closePrompt();
      }
  });
  };

  correctGuess(char, indexesOfChar) {
    this.correctGuesses.add(char);
    for(let i = 0; i < indexesOfChar.length; i++) {
      const currIndexOfChar = indexesOfChar[i];
      this.placeholders[currIndexOfChar] = char.toUpperCase();
    }

    console.log(this.placeholders.join(' '));
    console.log('\nCorrect! You\'re closer to cracking the codeword.');

    this.nextGuess();
  };

  incorrectGuess(char) {
    this.incorrectGuesses.add(char);
    console.log('\nIncorrect! The tractor beam pulls the person in further.\n');
    util.printEncouragment(this.messages);
    this.nextGuess();
  };

  nextGuess() {
    if(this.checkIfWon()) {
      this.gameWon();
      return;
    }

    displayUfo(this.incorrectGuesses.size);
    util.displayIncorrectGuesses(this.incorrectGuesses);
    console.log(`\nCodeword:\n${this.placeholders.join(' ')}\n`);

    if(this.checkIfGameOver()) {
      this.gameOver();
      return;
    }

    this.getGuessAndVerifyMatch();
  };

  checkIfWon() {
    const guessSoFar = this.placeholders.join('');
    if(guessSoFar.toLowerCase() === this.codeword.toLowerCase()) {
      return true;
    }
    return false;
  };

  checkIfGameOver() {
    if(this.incorrectGuesses.size >= 6) {
      return true;
    }
    return false;
  };

  gameOver() {
    console.log(
`OH NO! You ran out of guesses, game over.
The codeword is: ${this.codeword.toUpperCase()}.`);
    this.playAgainPrompt();
  };

  gameWon() {
    console.log(
`Correct! You saved the person and earned a medal of honor!
The codeword is: ${this.codeword.toUpperCase()}.`);
    this.playAgainPrompt();
  };

}

module.exports = { UfoGame };