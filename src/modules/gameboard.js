import { Ship } from "./ship.js";

class Gameboard {
  constructor() {
    this.board = Array.from({ length: 10 }, () => Array(10).fill(null));
    this.ships = [];
    this.receivedAttacks = Array.from({ length: 10 }, () => Array(10).fill(null));
  }

  placeShip(shipType, startX, startY, orientation) {
    let ship;

    switch(shipType) {
      case 'carrier': 
        ship = new Ship(5);
        break;
      case 'battleship':
        ship = new Ship(4);
        break;
      case 'destroyer':
      case 'submarine':
        ship = new Ship(3);
        break;
      case 'patrolBoat':
        ship = new Ship(2);
        break;
    }

    let coords = [];

    for (let i = 0; i < ship.length; i++) {
      let x = startX;
      let y = startY;

      if (orientation === 'horizontal') {
        x = startX + i;
      } else {
        y = startY + i;
      }

      // check for collisions
      if (
        x < 0 
        || x >= this.board.length
        || y < 0
        || y >= this.board.length
        || this.board[y][x] !== null
      ) {
        return false;
      }

      // check for adjacent ships
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <=1; j++) {
          if (
            (x + i) >= 0
            && (y + j) >= 0
            && (x + i) < 10
            && (y + j) < 10
          ) {
            if (this.board[y + j][x + i] instanceof Ship) {
              return false;
            } 
          }
        }
      }
  
      coords.push([x, y]);
    }

    // if all checks pass place ship coords
    ship.place(startX, startY, orientation);
    this.ships.push(ship);

    for (let [x, y] of coords) {
      this.board[y][x] = ship; // store reference to ship object
    }

    return true;
  }

  receiveAttack(x, y) {
    if (this.receivedAttacks[y][x] !== null) {
      return false;
    }

    if (this.board[y][x] !== null) {
      this.board[y][x].hit();
      this.receivedAttacks[y][x] = 'hit';
    } else {
      this.receivedAttacks[y][x] = 'miss';
    }

    return true;
  }

  areAllShipsSunk() {
    for (let ship of this.ships) {
      if (!ship.isSunk()) {
        return false;
      }
    }

    return true;
  }
}

let gameboard = new Gameboard();

gameboard.placeShip('carrier', 0, 8, 'horizontal');

module.exports = { Gameboard };