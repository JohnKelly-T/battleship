import { Player } from "./player.js";
import { Ship } from "./ship.js";

export class PlayerAI extends Player {
  constructor() {
    super();
    this.moveQueue = [];
    this.shipHits = [];
    this.shipOrientation = null;
    this.currentShipTarget = null;
  }

  getRandomMove(enemyGameboard) {
    let randomX = Math.floor(Math.random() * 10);
    let randomY = Math.floor(Math.random() * 10);

    while (enemyGameboard.receivedAttacks[randomY][randomX] !== null) {
      randomX = Math.floor(Math.random() * 10);
      randomY = Math.floor(Math.random() * 10);
    }

    // if move hits, add adjacent cells to move queue
    if (enemyGameboard.board[randomY][randomX] instanceof Ship) {
      this.currentShipTarget = enemyGameboard.board[randomY][randomX];
      this.addNextMoves(randomX, randomY, enemyGameboard);
      this.shipHits.push([randomX, randomY]);
    }

    return [randomX, randomY];
  }

  addNextMoves(x, y, enemyGameboard) {

    // if ship orientation is not known yet
    if (this.shipOrientation === null) {
      // changes to x and y to check adjacent squares
      let deltas = [[-1, 0], [+1, 0], [0, -1], [0, +1]];
  
      // check if valid moves
      for (let delta of deltas) {
        let newX = x + delta[0];
        let newY = y + delta[1];
  
        if (
          newX >= 0 
          && newX < 10
          && newY >= 0
          && newY < 10
          && enemyGameboard.receivedAttacks[newY][newX] === null
        ) {
          this.moveQueue.push([newX, newY]);
        }
      }
    } else { // ship orientation is known
      if (this.shipOrientation === 'horizontal') {
        let shipY = this.shipHits[0][1];
        // get min and max X
        let minX = Infinity;
        let maxX = -Infinity;

        for (let hit of this.shipHits) {
          if (hit[0] < minX) {
            minX = hit[0];
          }

          if (hit[0] > maxX) {
            maxX = hit[0];
          }
        }

        // add the left of current hits if valid
        if (
          (minX - 1) >= 0
          && enemyGameboard.receivedAttacks[shipY][minX - 1] === null
          && !this.inMoveQueue(minX - 1, shipY)
        ) {
          this.moveQueue.push([minX - 1, shipY])
        }

        // add the right of current hits if valid
        if (
          (maxX + 1) < 10
          && enemyGameboard.receivedAttacks[shipY][maxX + 1] === null
          && !this.inMoveQueue(maxX + 1, shipY)
        ) {
          this.moveQueue.push([maxX + 1, shipY])
        }

      } else if (this.shipOrientation === 'vertical') {
        let shipX = this.shipHits[0][0];
        // get min and max Y
        let minY = Infinity;
        let maxY = -Infinity;

        for (let hit of this.shipHits) {
          if (hit[1] < minY) {
            minY = hit[1];
          }

          if (hit[1] > maxY) {
            maxY = hit[1];
          }
        }

        // add the top of current hits if valid
        if (
          (minY - 1) >= 0
          && enemyGameboard.receivedAttacks[minY - 1][shipX] === null
          && !this.inMoveQueue(shipX, minY - 1)
        ) {
          this.moveQueue.push([shipX, minY - 1]);
        }

        // add the bottom of current hits if valid
        if (
          (maxY + 1) < 10
          && enemyGameboard.receivedAttacks[maxY + 1][shipX] === null
          && !this.inMoveQueue(shipX, maxY + 1)
        ) {
          this.moveQueue.push([shipX, maxY + 1]);
        }
      }
    }
  }

  inMoveQueue(x, y) {
    let inQueue = false;

    for (let move of this.moveQueue) {
      if (
        move[0] === x
        && move[1] === y
      ) {
        inQueue = true;
      }
    }

    return inQueue;
  }

  getNextMove(enemyGameboard) {
    // if current ship target is sunk, reset all target variables then get random move
    if (this.currentShipTarget !== null 
      && this.currentShipTarget.isSunk() 
    ) {
      this.moveQueue = [];
      this.shipHits = [];
      this.shipOrientation = null;
      this.currentShipTarget = null;
    }

    if (this.moveQueue.length === 0) {
      return this.getRandomMove(enemyGameboard);
    }

    let nextMove = this.moveQueue.shift();

    // check if next move in queue is a hit
    if (enemyGameboard.board[nextMove[1]][nextMove[0]] instanceof Ship) { 
      this.shipHits.push([nextMove[0], nextMove[1]]);

      if (this.shipOrientation === null) {
        this.shipOrientation = this.getOrientation();
        // prune moves in queue not in orientation
        this.pruneQueue();
      }
      
      this.addNextMoves(nextMove[0], nextMove[1], enemyGameboard);
    }


    return nextMove;
  }

  pruneQueue() {
    let newQueue = [];

    if (this.shipOrientation === 'vertical') {
      for (let move of this.moveQueue) {
        if (move[0] === this.shipHits[0][0]) {
          newQueue.push(move);
        }
      }
    } else if (this.shipOrientation === 'horizontal') {
      for (let move of this.moveQueue) {
        if (move[1] === this.shipHits[0][1]) {
          newQueue.push(move);
        }
      }
    }

    this.moveQueue = newQueue;
  }

  getOrientation() {
    if (this.shipHits[0][0] === this.shipHits[1][0]) {
      return 'vertical';
    } else if (this.shipHits[0][1] === this.shipHits[1][1]) {
      return 'horizontal';
    }
  }
}