import { Gameboard } from "./gameboard.js";

class Player {
  constructor() {
    this.board = new Gameboard();
  }

  placeShipsRandomly() {
    let ships = [
      'carrier', 
      'battleship',
      'destroyer',
      'submarine', 
      'patrolBoat'
    ]

    let orientations = ['vertical', 'horizontal'];

    for (let ship of ships) {
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      let orientation = orientations[Math.floor(Math.random() * 2)];

      // reroll coordinates if random value is invalid
      while (this.board.placeShip(ship, x, y, orientation) !== true) {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
        orientation = orientations[Math.floor(Math.random() * 2)];
      }
    }
  }
}

module.exports = { Player };