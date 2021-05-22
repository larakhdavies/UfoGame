//You must write two unit tests: a) one for when the user guesses a correct letter and b) one for when the user guesses an incorrect letter.

const chai = require('chai');
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const { UfoGame } = require('../ufo_game.js');
const util = require('../ufo_utils.js');

chai.use(sinonChai);

describe('promptUserInput', () => {
  let testGame;
  beforeEach(() => {
    testGame = sinon.createStubInstance(UfoGame);
    testGame.codeword = 'good';
    testGame.incorrectGuesses = [];
    testGame.codewordMap = new Map();
    testGame.codewordMap.set('g', [0]);
    testGame.codewordMap.set('o', [1, 2]);
    testGame.codewordMap.set('d', [3]);
  });

  it('should call correctGuess when char is in the word', () => {
    // mock irrelevant functions //overriding the promptForCharFunc funciton
    util.promptForCharInput = (_, callback) => {
      callback('g');
    };
    testGame.correctGuess.returns();
    testGame.incorrectGuess.returns();
    testGame.promptUserInput.restore();

    testGame.promptUserInput();

    expect(testGame.correctGuess).to.have.been.called;
    expect(testGame.incorrectGuess).to.have.not.been.called;
  });

  it('should call incorrectGuess when char is NOT in the word', () => {
    // mock irrelevant functions
    util.promptForCharInput = (_, callback) => {
      callback('b');
    };
    testGame.incorrectGuess.returns();
    testGame.correctGuess.returns();
    testGame.promptUserInput.restore();

    testGame.promptUserInput();

    expect(testGame.incorrectGuess).to.have.been.called;
    expect(testGame.correctGuess).to.have.not.been.called;
  });

});