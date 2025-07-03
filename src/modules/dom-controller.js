import { renderGamePage } from "../pages/game-page";
import { renderStartPage } from "../pages/start-page";
import { renderPlayer1Board } from "./render-gameboard";
import { renderPlayer2Board } from "./render-gameboard";
import { renderStartBoard } from "./render-gameboard";
import { Player } from "./player";
import { PlayerAI } from "./player-ai";
import { Game } from "./game";

export class DomController {
  constructor() {
    this.player1 = new Player();
    this.player2 = new PlayerAI();

    // variables for drag event
    this.isDragging = false;
    this.startX;
    this.startY;
    this.newX;
    this.newY;
    this.beingDragged;

    // bind methods
    this.dragStart = this.dragStart.bind(this);
    this.dragEnd = this.dragEnd.bind(this);

    // this.player1.placeShipsRandomly();
    // this.player2.placeShipsRandomly();

    this.game = new Game(this.player1, this.player2);
  }

  loadGamePage() {
    let gamepage = renderGamePage(this.game);
    let player2Container = gamepage.querySelector('.player2-container');
    let body = document.querySelector('body');

    let player1RemainingShips = gamepage.querySelector('.player1-remaining-ships');
    let player2RemainingShips = gamepage.querySelector('.player2-remaining-ships');

    body.appendChild(gamepage);

    player2Container.addEventListener('click', (e) => {
      if (e.target.classList.contains('square')) {
        // return if square is disabled
        if (e.target.classList.contains('disabled')) {
          return;
        }

        let targetX = e.target.getAttribute('data-x');
        let targetY = e.target.getAttribute('data-y');

        // perform attack on player2 board
        if (this.game.makeMove(targetX, targetY)) {
          // reload player2Gameboard
          let player2Gameboard = document.querySelector('.player2-gameboard');
          let newPlayer2Board = renderPlayer2Board(this.game);
          player2Gameboard.replaceWith(newPlayer2Board);
          player2Gameboard = newPlayer2Board;

          // add animation if hit
          if (this.player2.gameboard.receivedAttacks[targetY][targetX] === 'hit') {
            this.addHitAnimation('player2', targetX, targetY);
          }

          // update remaining ships count
          player1RemainingShips.textContent =  this.player1.gameboard.remainingShips;
          player2RemainingShips.textContent =  this.player2.gameboard.remainingShips;

          // check if game over
          if (this.game.isOver()) {
            this.showGameOver();
            return;
          }

          // temporarily disable board and remove turn
          player2Gameboard.classList.add('disabled');
          player2Gameboard.classList.remove('turn');
          player2Gameboard.classList.add('not-turn');

          let player1Gameboard = document.querySelector('.player1-gameboard');
          player1Gameboard.classList.add('turn');
          player1Gameboard.classList.remove('not-turn');
          
          setTimeout(() => {
            // make AI player move
            let [moveX, moveY] = this.player2.getRandomMove(this.game.turnEnemy.gameboard);
            this.game.makeMove(moveX, moveY);

            // reload player1Gameboard
            let newPlayer1Board = renderPlayer1Board(this.game);
            player1Gameboard.replaceWith(newPlayer1Board);

            // add animation if hit
            if (this.player1.gameboard.receivedAttacks[moveY][moveX] === 'hit') {
              this.addHitAnimation('player1', moveX, moveY);
            }

            newPlayer1Board.classList.add('not-turn');

            // update remaining ships count
            player1RemainingShips.textContent =  this.player1.gameboard.remainingShips;
            player2RemainingShips.textContent =  this.player2.gameboard.remainingShips;

            // check if game over
            if (this.game.isOver()) {
              this.showGameOver();
              return;
            }

            // enable board again
            player2Gameboard.classList.remove('disabled');
            player2Gameboard.classList.add('turn');
            player2Gameboard.classList.remove('not-turn');
          }, 800);
        }
      }
    });
  }

  addHitAnimation(player, targetX, targetY) {

    let query = `.${player}-gameboard .square[data-x="${targetX}"][data-y="${targetY}"] .mark`
    let hitMark = document.querySelector(query);
    hitMark.classList.add('hit-wave');

    // if ship is sunk add explosion animation

    let hitShip;

    if (player === 'player1') {
      hitShip = this.game.player1.gameboard.board[targetY][targetX];
    } else {
      hitShip = this.game.player2.gameboard.board[targetY][targetX];
    }

    if (hitShip.isSunk()) {
      let startCoord = hitShip.startCoord;

      for (let i = 0; i < hitShip.length; i++) {
        let shipX = startCoord[0];
        let shipY = startCoord[1];

        if (hitShip.orientation === 'horizontal') {
          shipX += i;
        } else {
          shipY += i;
        }

        let query = `.${player}-gameboard .square[data-x="${shipX}"][data-y="${shipY}"] .explosion`
        let explosionMark = document.querySelector(query);
        explosionMark.classList.add('explode-wave');

      }
    }
  }

  showGameOver() {
    // disable boards and remove turn styles

    let gameboards = document.querySelectorAll('.gameboard');

    gameboards.forEach((gameboard) => {
      gameboard.classList.add('disabled');
      gameboard.classList.remove('turn');
      gameboard.classList.remove('not-turn');
    })

    // get game winner
    let winner = this.player1.gameboard.areAllShipsSunk() ? 'player2' : 'player1';

    let winnerBoard;
    let winnerStats;

    if (winner === 'player1') {
      winnerBoard = document.querySelector('.player1-gameboard');
      winnerStats = document.querySelector('.player1-stats');
    } else if (winner === 'player2') {
      winnerBoard = document.querySelector('.player2-gameboard');
      winnerStats = document.querySelector('.player2-stats');
    }

    // apply winning styles
    winnerBoard.classList.add('winner-board');
    winnerStats.classList.add('winner-stats');

    // append winning crown
    let winnerName = winnerStats.querySelector('.name');
    let crown = document.createElement('div');
    crown.classList.add('crown');
    crown.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fill="none" stroke="#FFCC00" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 18h14M5 14h14l1-9l-4 3l-4-5l-4 5l-4-3z" />
      </svg>`;

    winnerName.appendChild(crown);
  }

  loadStartPage() {
    let body = document.querySelector('body');
    let startPage = renderStartPage();

    body.appendChild(startPage);

    // add event listeners
    let ships = document.querySelectorAll('.ship-placement-box > *');

    // mouse down event
    for (let ship of ships) {
      ship.addEventListener('mousedown', (e) => {
        console.log(ship.getAttribute('data-ship-type') + " is being clicked");
        this.isDragging = true;
        this.beingDragged = ship;

        this.startX = e.clientX;
        this.startY = e.clientY;

        this.beingDragged.style.cursor = 'grabbing';

        document.addEventListener('mousemove', this.dragStart);
        document.addEventListener('mouseup', this.dragEnd);
      });
    }
  }

  dragStart(e) {
    if (!this.isDragging) return;

    this.newX = e.clientX - this.startX;
    this.newY = e.clientY - this.startY;

    this.beingDragged.style.top = this.newY + 'px';
    this.beingDragged.style.left = this.newX + 'px';
  }

  dragEnd(e) {
    this.isDragging = false;

    let rect = this.beingDragged.getBoundingClientRect();
    let offsetY = this.beingDragged.querySelector('.square').offsetHeight / 2;
    let offsetX = this.beingDragged.querySelector('.square').offsetWidth / 2;

    this.beingDragged.style.visibility = 'hidden'; // get element being hovered at by setting style to hidden
    let dropTarget = document.elementFromPoint(rect.left + offsetX, rect.top + offsetY); // using elementHeight / 2 to get the left center point of the element
    this.beingDragged.style.visibility = 'visible';

    console.log('drop target: ', dropTarget);

     
    if (dropTarget.classList.contains('square')) {
      // add ship to gameboard
      let isPlaced = this.placeShip(
        dropTarget.getAttribute('data-x'),
        dropTarget.getAttribute('data-y'),
        this.beingDragged.getAttribute('data-ship-type')
      ) 

      if (isPlaced) {
        this.beingDragged.style.visibility = 'hidden';
      } 
    } else {
      this.beingDragged.style.visibility = 'visible';
    }

    // return element to original place
    this.beingDragged.style.top = 0;
    this.beingDragged.style.left = 0;

    this.beingDragged.style.cursor = 'grab';

    document.removeEventListener('mousemove', this.dragStart);
    document.removeEventListener('mouseup', this.dragEnd);
  }

  placeShip(x, y, shipType) {
    let shipLength = 0;

    switch (shipType) {
      case 'carrier':
        shipLength = 5;
        break;
      case 'battleship':
        shipLength = 4;
        break;
      case 'destroyer':
      case 'submarine':
        shipLength = 3;
        break;
      case 'patrolBoat':
        shipLength = 2;
        break;
    }

    let isPlaced = this.player1.gameboard.placeShip(shipType, Number(x), Number(y), 'horizontal');

    if (isPlaced) {
      // rerender gameboard
      let gameboard = document.querySelector('.start-gameboard');

      gameboard.replaceWith(renderStartBoard(this.game));
      return true;
    } else {
      return false;
    }
  }
}
