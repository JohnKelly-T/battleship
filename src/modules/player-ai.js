import { Player } from "./player.js";

class PlayerAI extends Player {
  constructor() {
    super();
  }

  getRandomMove(enemyGameboard) {
    let randomX = Math.floor(Math.random() * 10);
    let randomY = Math.floor(Math.random() * 10);

    while (
      enemyGameboard.board[randomY][randomX] !== null
      && enemyGameboard.receivedAttacks[randomY][randomX] !== null
    ) {
      randomX = Math.floor(Math.random() * 10);
      randomY = Math.floor(Math.random() * 10);
    }

    return [randomX, randomY];
  }
}

module.exports = { PlayerAI };