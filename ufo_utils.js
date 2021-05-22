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
    const wordsData = fs.readFileSync('./data/nouns.txt', 'utf8');
    return wordsData.split('\n');
  } catch (err) {
    console.error(err);
  }
};

const getRandomElement = (arrayToSelectFrom) => {
  const randomIndex = Math.floor(Math.random()*arrayToSelectFrom.length);
  return arrayToSelectFrom[randomIndex];
};

const mapLetterToIndex = (codeword) => {
  const codewordMap = new Map();
  for (let i = 0; i<codeword.length; i++) {
    const currentChar = codeword[i];
    if(!codewordMap.has(currentChar)) {
      codewordMap.set(currentChar, [i])
    } else {
      codewordMap.get(currentChar).push(i);
    }
  }
  return codewordMap;
};

const createPlaceholders = (codewordLength) => {
  return Array(codewordLength).fill('_');
};

const displayIncorrectGuesses = (incorrectGuesses) => {
  console.log('Incorrect Guesses:');
  if(incorrectGuesses.size === 0) {
    console.log('None');
  } else {
    console.log([...incorrectGuesses].join(' ').toUpperCase());
  }
};

const promptForLetterInput = (questionToUser, cbOnCharInput) => {
  rl.question(questionToUser, (input) => {
    if (input.length > 1){
      console.log('\nI cannot understand your input. Please enter a single letter.\n');
      promptForLetterInput(questionToUser, cbOnCharInput);
    } else if(!(/[a-zA-Z]/).test(input)) {
      console.log('\nPlease enter a letter only (a-Z).\n');
      promptForLetterInput(questionToUser, cbOnCharInput);
    } else {
      // this callback is only getting called if input is a single char.
      cbOnCharInput(input);
    }
  });
};

const closePrompt = () => {
  rl.close();
};

// Show a random encouraging message when the user guesses an incorrect letter.
const printEncouragment = (messages) => {
  const encouragment = getRandomElement(messages);
  console.log(encouragment + '\n');
};

const readMessagesFile = () => {
  const stringOfMessages = fs.readFileSync('./data/messages.txt', 'utf8');
  const messages = stringOfMessages.split('\n');
  return messages;
};


module.exports = {
  displayHeading,
  getRandomElement,
  mapLetterToIndex,
  createPlaceholders,
  displayIncorrectGuesses,
  promptForLetterInput,
  closePrompt,
  readNounsFile,
  printEncouragment,
  readMessagesFile,
};
