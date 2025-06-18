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
    if (this.board[y][x] !== null) {
      this.board[y][x].hit();
      this.receivedAttacks[y][x] = 'hit';
    } else {
      this.receivedAttacks[y][x] = 'miss';
    }
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