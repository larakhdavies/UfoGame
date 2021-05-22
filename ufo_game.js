const readlineSync = require('readline-sync');
const util = require('./ufo_utils.js');
const { displayUfo } = require('./ufo_display.js');
const bonus = require('./bonus.js');

class UfoGame {
  codeword = '';
  codewordMap = new Map();
  incorrectGuesses = [];
  correctGuesses = [];
  placeholders = [];

  constructor() {
    this.arrayOfWords = util.readNounsFile();
    this.arrayOfMessages = bonus.readMessagesFile();
  };

  initGame() {
    this.resetState();
    util.displayHeading();
    this.codeword = util.getRandomElement(this.arrayOfWords);
    this.codewordMap = util.mapCodeword(this.codeword);
    this.placeholders = util.createPlaceholders(this.codeword.length);
    console.log(this.codeword);
    this.nextGuess();
  };

  resetState() {
    this.codeword = '';
    this.codewordMap = new Map();
    this.incorrectGuesses = [];
    this.correctGuesses = [];
    this.placeholders = [];
  };

  promptUserInput() {
    util.promptForCharInput('Please enter your guess: ', (charInput) => {
        const char = charInput.toLowerCase();
        if(this.incorrectGuesses.indexOf(char) > -1 || this.correctGuesses.indexOf(char) > -1){
          console.log('\nYou can only guess that letter once, please try again.\n');
          this.promptUserInput();
        } else if(this.codewordMap.has(char)) {
          const indexesOfChar = this.codewordMap.get(char);
          this.correctGuess(char, indexesOfChar);
        } else {
          this.incorrectGuess(char);
        }
    });
  };

  playAgainPrompt() {
    util.promptForCharInput('\nWould you like to play again (Y/N)? ', (answer) => {
      if(answer === 'Y' || answer === 'y'){
        this.initGame();
      } else {
        console.log('Goodbye!')
        util.closePrompt();
      }
  });
  };

  correctGuess(char, indexesOfChar) {
    this.correctGuesses.push(char);
    if(indexesOfChar.length === 1) {
      this.placeholders[indexesOfChar[0]] = char.toUpperCase();
    } else {
      for(let i = 0; i < indexesOfChar.length; i++) {
        let currIndexOfChar = indexesOfChar[i];
        this.placeholders[currIndexOfChar] = char.toUpperCase();
      }
    }
    console.log(placeholders.join(' '));
    console.log('\nCorrect! You\'re closer to cracking the codeword.');
    this.nextGuess();
  };

  incorrectGuess(char) {
    this.incorrectGuesses.push(char);
    console.log('\nIncorrect! The tractor beam pulls the person in further.\n');
    bonus.printEncouragment(this.arrayOfMessages);
    this.nextGuess();
  };

  nextGuess() {
    displayUfo(this.incorrectGuesses.length);
    util.displayIncorrectGuesses(this.incorrectGuesses);
    console.log(`
Codeword:
${this.placeholders.join(' ')}
`);
    //check if won
    let guessSoFar = this.placeholders.join('');
    if(guessSoFar.toLowerCase() === this.codeword.toLowerCase()) {
      this.gameWon();
      return;
    }
    //check is gameover
    if(this.incorrectGuesses.length >= 6) {
      this.gameOver();
      return;
    }
    this.promptUserInput();
  };

  gameOver() {
    console.log('OH NO! You lost!');
    this.playAgainPrompt();
  };

  gameWon() {
    console.log(`Correct! You saved the person and earned a medal of honor!\nThe codeword is: ${this.codeword.toUpperCase()}.`);
    this.playAgainPrompt();
  };

}

module.exports = { UfoGame };