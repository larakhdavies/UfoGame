const chai = require('chai');

const { expect } = chai;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { UfoGame } = require('../ufo_game');
const util = require('../ufo_utils');

chai.use(sinonChai);

describe('getGuessAndVerifyMatch', () => {
  let testGame;
  beforeEach(() => {
    testGame = sinon.createStubInstance(UfoGame);
    testGame.codeword = 'good';
    testGame.incorrectGuesses = new Set();
    testGame.correctGuesses = new Set();
    testGame.codewordMap = new Map();
    testGame.codewordMap.set('g', [0]);
    testGame.codewordMap.set('o', [1, 2]);
    testGame.codewordMap.set('d', [3]);
  });

  it('should call correctGuess when char is in the word', () => {
    util.promptForLetterInput = (_, callback) => {
      callback('g');
    };
    testGame.correctGuess.returns();
    testGame.incorrectGuess.returns();
    testGame.getGuessAndVerifyMatch.restore();

    testGame.getGuessAndVerifyMatch();

    expect(testGame.correctGuess).to.have.been.called;
    expect(testGame.incorrectGuess).to.have.not.been.called;
  });

  it('should call incorrectGuess when char is NOT in the word', () => {
    util.promptForLetterInput = (_, callback) => {
      callback('b');
    };
    testGame.incorrectGuess.returns();
    testGame.correctGuess.returns();
    testGame.getGuessAndVerifyMatch.restore();

    testGame.getGuessAndVerifyMatch();

    expect(testGame.incorrectGuess).to.have.been.called;
    expect(testGame.correctGuess).to.have.not.been.called;
  });
});
