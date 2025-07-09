import { Player } from "./player.js";

export class Game {
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

  makeMove(x, y) {
    let moveSuccess = this.turnEnemy.gameboard.receiveAttack(x, y);

    if (moveSuccess) {
      this.toggleTurn();
    }

    return moveSuccess;
  }

  isOver() {
    if (
      this.player1.gameboard.areAllShipsSunk() ||
      this.player2.gameboard.areAllShipsSunk()
    ) {
      return true;
    }

    return false;
  }
}
