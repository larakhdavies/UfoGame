const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const displayHeading = () => {
  console.log(`
UFO: The Game
Instructions: save us from alien abduction by guessing letters in the codeword.
`)
};

const readNounsFile = () => {
  try {
    const wordsData = fs.readFileSync('./ufo_game/data/nouns.txt', 'utf8');
    return arrayOfWords = wordsData.split('\n');
  } catch (err) {
    console.error(err);
  }
};

const getRandomElement = (arrayToSelectFrom) => {
  const randomIndex = Math.floor(Math.random()*arrayToSelectFrom.length);
  const randomElement = arrayToSelectFrom[randomIndex];
  return randomElement;
};

const mapCodeword = (codeword) => {
  let codewordMap = new Map();
  for (let i = 0; i<codeword.length; i++){
    let currentChar = codeword[i];
    if(!codewordMap.has(currentChar)){
      codewordMap.set(currentChar, [i])
    } else {
      //points to the array in heap and updates it
      codewordMap.get(currentChar).push(i);
    }
  }
  return codewordMap;
};

const createPlaceholders = (codewordLength) => {
  let dash = '_';
  placeholders = Array(codewordLength).fill(dash);
  return placeholders;
};

const displayIncorrectGuesses = (incorrectGuesses) => {
  console.log('Incorrect Guesses:');
  if(incorrectGuesses.length === 0) {
    console.log('None');
  } else if(incorrectGuesses.length === 1) {
    console.log(incorrectGuesses[0].toUpperCase());
  } else if (incorrectGuesses.length > 1) {
    console.log(incorrectGuesses.join(' ').toUpperCase());
  }
};

const promptForCharInput = (questionToUser, cbOnCharInput) => {
  rl.question(questionToUser, (input) => {
    if (input.length > 1){
      console.log('\nI cannot understand your input. Please enter a single letter.\n');
      promptForCharInput(questionToUser, cbOnCharInput);
    } else {
      // this callback is only getting called if input is a single char.
      cbOnCharInput(input);
    }
  });
};

const closePrompt = () => {
  rl.close();
};

module.exports = {
  displayHeading,
  getRandomElement,
  mapCodeword,
  createPlaceholders,
  displayIncorrectGuesses,
  promptForCharInput,
  closePrompt,
  readNounsFile,
};
