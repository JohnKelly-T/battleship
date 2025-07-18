import { Ship } from "./ship.js";

export class Gameboard {
  constructor() {
    this.board = Array.from({ length: 10 }, () => Array(10).fill(null));
    this.ships = [];
    this.remainingShips = 5;
    this.receivedAttacks = Array.from({ length: 10 }, () => Array(10).fill(null));
  }

  placeShip(shipType, startX, startY, orientation) {
    let ship;

    switch (shipType) {
      case "carrier":
        ship = new Ship(5, shipType);
        break;
      case "battleship":
        ship = new Ship(4, shipType);
        break;
      case "destroyer":
      case "submarine":
        ship = new Ship(3, shipType);
        break;
      case "patrolBoat":
        ship = new Ship(2, shipType);
        break;
    }

    let coords = [];

    for (let i = 0; i < ship.length; i++) {
      let x = startX;
      let y = startY;

      if (orientation === "horizontal") {
        x = startX + i;
      } else {
        y = startY + i;
      }

      // check for collisions
      if (
        x < 0 ||
        x >= this.board.length ||
        y < 0 ||
        y >= this.board.length ||
        this.board[y][x] !== null
      ) {
        return false;
      }

      // check for adjacent ships
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (x + i >= 0 && y + j >= 0 && x + i < 10 && y + j < 10) {
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
    // convert x and y to integer
    x = Number(x);
    y = Number(y);

    if (this.receivedAttacks[y][x] !== null) {
      return false;
    }

    if (this.board[y][x] instanceof Ship) {
      let ship = this.board[y][x];
      ship.hit();
      this.receivedAttacks[y][x] = "hit";

      if (ship.isSunk()) {
        this.remainingShips -= 1;
      }

      // label corners of hit to be empty
      if (x - 1 >= 0) {
        if (y - 1 >= 0) {
          if (this.receivedAttacks[y - 1][x - 1] === null) {
            this.receivedAttacks[y - 1][x - 1] = "empty";
          }
        }

        if (y + 1 < 10) {
          if (this.receivedAttacks[y + 1][x - 1] === null) {
            this.receivedAttacks[y + 1][x - 1] = "empty";
          }
        }
      }

      if (x + 1 < 10) {
        if (y - 1 >= 0) {
          if (this.receivedAttacks[y - 1][x + 1] === null) {
            this.receivedAttacks[y - 1][x + 1] = "empty";
          }
        }

        if (y + 1 < 10) {
          if (this.receivedAttacks[y + 1][x + 1] === null) {
            this.receivedAttacks[y + 1][x + 1] = "empty";
          }
        }
      }

      // if ship is sunk, mark last squares empty
      if (ship.isSunk()) {
        let startX = ship.startCoord[0];
        let startY = ship.startCoord[1];

        if (ship.orientation === "horizontal") {
          let endX = ship.startCoord[0] + ship.length - 1;
          if (
            startX - 1 >= 0 &&
            this.receivedAttacks[startY][startX - 1] === null
          ) {
            this.receivedAttacks[startY][startX - 1] = "empty";
          }

          if (
            endX + 1 < 10 &&
            this.receivedAttacks[startY][endX + 1] === null
          ) {
            this.receivedAttacks[startY][endX + 1] = "empty";
          }
        } else {
          let endY = ship.startCoord[1] + ship.length - 1;

          if (
            startY - 1 >= 0 &&
            this.receivedAttacks[startY - 1][startX] === null
          ) {
            this.receivedAttacks[startY - 1][startX] = "empty";
          }

          if (
            endY + 1 < 10 &&
            this.receivedAttacks[endY + 1][startX] === null
          ) {
            this.receivedAttacks[endY + 1][startX] = "empty";
          }
        }
      }
    } else {
      this.receivedAttacks[y][x] = "miss";
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

  removeShip(type) {
    this.ships = this.ships.filter((ship) => ship.type !== type);

    // remove ship from board
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (
          this.board[i][j] instanceof Ship &&
          this.board[i][j].type === type
        ) {
          this.board[i][j] = null;
        }
      }
    }
  }
}
