const { UfoGame } = require('./ufo_game.js');

const main = () => {
  const newGame = new UfoGame();
  newGame.initGame();
};

main();