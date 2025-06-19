import { Gameboard } from "./gameboard.js";

class Player {
  constructor() {
    this.board = new Gameboard();
  }
}

module.exports = { Player };