import { Player } from "./player.js";

class Game {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.turnPlayer = player1;
    this.turnEnemy = player2;
  }

  toggleTurn() {
    let temp = this.turnPlayer;
    this.turnPlayer = this.turnEnemy;
    this.turnEnemy = temp;
  }


}

module.exports = { Game };
