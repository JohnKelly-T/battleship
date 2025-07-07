import { renderGamePage } from "../pages/game-page";
import { renderStartPage } from "../pages/start-page";
import { renderPlayer1Board } from "./render-gameboard";
import { renderPlayer2Board } from "./render-gameboard";
import { renderStartBoard } from "./render-gameboard";
import { Player } from "./player";
import { PlayerAI } from "./player-ai";
import { Game } from "./game";
import { Gameboard } from "./gameboard";

import underwaterAmbience from "../assets/audio/underwater-ambience.mp3";
import sonarPing from "../assets/audio/sonar-ping.mp3";
import shiptHit from "../assets/audio/hit.mp3";
import shipExplosion from "../assets/audio/explosion.mp3";

export class DomController {
  constructor() {
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
    this.rotateShip = this.rotateShip.bind(this);
    this.randomize = this.randomize.bind(this);
    this.reset = this.reset.bind(this);
    this.start = this.start.bind(this);

    this.createNewGame();

    // for game sounds
    this.addAudio();
  }

  addAudio() {
    this.ambientSound = new Audio(underwaterAmbience);
    this.ambientSound.loop = true;
    this.ambientSound.volume = 0.1;

    this.ping = new Audio(sonarPing);
    this.ping.volume = 0.1;

    this.hit = new Audio(shiptHit);
    this.hit.volume = 0.1;

    this.explosion = new Audio(shipExplosion);
    this.explosion.volume = 0.3;
  }

  createNewGame() {
    this.player1 = new Player();
    this.player2 = new PlayerAI();

    this.game = new Game(this.player1, this.player2);
  }

  loadGamePage() {
    let gamepage = renderGamePage(this.game);
    let player2Container = gamepage.querySelector('.player2-container');
    let body = document.querySelector('body');
    let quitButton = gamepage.querySelector('.quit-button');

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

          // add animation and sounds
          if (this.player2.gameboard.receivedAttacks[targetY][targetX] === 'hit') {
            this.addHitAnimation('player2', targetX, targetY);
            
            if (this.game.player2.gameboard.board[targetY][targetX].isSunk()) {
              this.explosion.pause();
              this.explosion.currentTime = 0.5;
              this.explosion.play();
            } else {
              this.hit.pause();
              this.hit.currentTime = 0;
              this.hit.play();
            }

          } else if (this.player2.gameboard.receivedAttacks[targetY][targetX] === 'miss') {
            this.ping.pause();
            this.ping.currentTime = 0;
            this.ping.play();
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
            let [moveX, moveY] = this.player2.getNextMove(this.game.turnEnemy.gameboard);
            this.game.makeMove(moveX, moveY);

            // reload player1Gameboard
            let newPlayer1Board = renderPlayer1Board(this.game);
            player1Gameboard.replaceWith(newPlayer1Board);

            // add animation and sounds
            if (this.player1.gameboard.receivedAttacks[moveY][moveX] === 'hit') {
              this.addHitAnimation('player1', moveX, moveY);
              
              if (this.game.player1.gameboard.board[moveY][moveX].isSunk()) {
                this.explosion.pause();
                this.explosion.currentTime = 0.5;
                this.explosion.play();
              } else {
                this.hit.pause();
                this.hit.currentTime = 0;
                this.hit.play();
              }

            } else if (this.player1.gameboard.receivedAttacks[moveY][moveX] === 'miss') {
              this.ping.pause();
              this.ping.currentTime = 0;
              this.ping.play();
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
          }, 1000);
        }
      }
    });

    quitButton.addEventListener('click', (e) => {
      this.clearBody();
      // create new game
      this.createNewGame();
      // end ambient sounds
      this.ambientSound.pause();
      this.ambientSound.currentTime = 0;

      this.loadStartPage();
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
    let startPage = renderStartPage(this.game);

    body.appendChild(startPage);

    // add event listeners
    let boardContainer = startPage.querySelector('.board-container');
    let ships = document.querySelectorAll('.ship-placement-box > *');
    let randomizeButton = document.querySelector('.randomize-button');
    let resetButton = document.querySelector('.reset-button');
    let startButton = document.querySelector('.start-button');


    // mouse down event
    for (let ship of ships) {
      ship.addEventListener('mousedown', (e) => {
        this.isDragging = true;
        this.beingDragged = ship;

        this.startX = e.clientX;
        this.startY = e.clientY;

        this.beingDragged.style.cursor = 'grabbing';

        document.addEventListener('mousemove', this.dragStart);
        document.addEventListener('mouseup', this.dragEnd);
      });
    }

    // mouse down event on gameboard
    boardContainer.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('ship')) {
        this.isDragging = true;
        this.beingDragged = e.target;

        this.startX = e.clientX;
        this.startY = e.clientY;

        this.beingDragged.style.cursor = 'grabbing';

        document.addEventListener('mousemove', this.dragStart);
        document.addEventListener('mouseup', this.dragEnd);
      }
    });

    randomizeButton.addEventListener('click', this.randomize);
    resetButton.addEventListener('click', this.reset);
    startButton.addEventListener('click', this.start);
  }

  dragStart(e) {
    if (!this.isDragging) return;

    // for moving ship within gameboard
    if (this.beingDragged.classList.contains('ship')) {

      // get ship type
      let shipType = this.beingDragged.getAttribute('data-ship-type');
      let query = `.ship[data-ship-type=${shipType}]`;
      let shipParts = document.querySelectorAll(query);

      this.newX = e.clientX - this.startX;
      this.newY = e.clientY - this.startY;

      // move ship parts
      for (let ship of shipParts) {
        ship.style.setProperty('--offsetY', this.newY + 'px');
        ship.style.setProperty('--offsetX', this.newX + 'px');
      }

    } else {
      this.newX = e.clientX - this.startX;
      this.newY = e.clientY - this.startY;

      this.beingDragged.style.top = this.newY + 'px';
      this.beingDragged.style.left = this.newX + 'px';
    }

    
  }

  dragEnd(e) {
    this.isDragging = false;

    if (this.beingDragged.classList.contains('ship')) {
      let shipType = this.beingDragged.getAttribute('data-ship-type');
      let query = `.ship[data-ship-type=${shipType}]`;
      let shipParts = document.querySelectorAll(query);

      let rect = shipParts[0].getBoundingClientRect();
      let offsetY = shipParts[0].offsetHeight / 2;
      let offsetX = shipParts[0].offsetWidth / 2;

      shipParts[0].style.visibility = 'hidden'; // get element being hovered at by setting style to hidden
      let dropTarget = document.elementFromPoint(rect.left + offsetX, rect.top + offsetY); // using elementHeight / 2 to get the left center point of the element
      shipParts[0].style.visibility = 'visible';

      if (dropTarget !== null && dropTarget.classList.contains('square')) {
        // todo
        let shipObject = this.player1.gameboard.ships.find(ship => ship.type === shipType);
        let shipStartCoord = shipObject.startCoord;

        // remove ship from ships
        this.player1.gameboard.removeShip(shipType);

        // place ship (if not valid, place ship again using original values)
        let isPlaced = this.placeShip(
          dropTarget.getAttribute('data-x'),
          dropTarget.getAttribute('data-y'),
          shipType,
          this.beingDragged.getAttribute('data-orientation')
        );

        if (!isPlaced) {
          this.placeShip(
            shipStartCoord[0],
            shipStartCoord[1],
            shipType,
            this.beingDragged.getAttribute('data-orientation')
          );
        }

        // if mouse didn't move, register as click event to rotate ship
        if (this.startX === e.clientX && this.startY === e.clientY) {
          this.rotateShip(e);
        }
      } else {
        // return ships to position
        for (let ship of shipParts) {
          ship.style.setProperty('--offsetY', 0 + 'px');
          ship.style.setProperty('--offsetX', 0 + 'px');
        }
      }
    } else {
      let rect = this.beingDragged.getBoundingClientRect();
      let offsetY = this.beingDragged.querySelector('.square').offsetHeight / 2;
      let offsetX = this.beingDragged.querySelector('.square').offsetWidth / 2;

      this.beingDragged.style.visibility = 'hidden'; // get element being hovered at by setting style to hidden
      let dropTarget = document.elementFromPoint(rect.left + offsetX, rect.top + offsetY); // using elementHeight / 2 to get the left center point of the element
      this.beingDragged.style.visibility = 'visible';
      
      if (dropTarget !== null && dropTarget.classList.contains('square')) {
        // add ship to gameboard
        let isPlaced = this.placeShip(
          dropTarget.getAttribute('data-x'),
          dropTarget.getAttribute('data-y'),
          this.beingDragged.getAttribute('data-ship-type'),
          'horizontal'
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
    }

    document.removeEventListener('mousemove', this.dragStart);
    document.removeEventListener('mouseup', this.dragEnd);
  }

  rotateShip(e) {
    if (e.target.classList.contains('ship')) {
      // get ship coordinates
      let shipElement = e.target;
      let pivotX = Number(shipElement.getAttribute('data-x'));
      let pivotY = Number(shipElement.getAttribute('data-y'));

      let shipObject = this.player1.gameboard.board[pivotY][pivotX];
      let shipStartCoord = shipObject.startCoord;
      let shipOrientation = shipObject.orientation;

      // get offset of start coords from pivot element
      let offsetX = shipStartCoord[0] - pivotX;
      let offsetY = shipStartCoord[1] - pivotY;

      // rotate clockwise
      let newOffsetX = -offsetY;
      let newOffsetY = offsetX;

      let newShipX = pivotX + newOffsetX;
      let newShipY = pivotY + newOffsetY;

      // if ship is vertical, shift the anchor point to the left, if horizontal shift to top
      if (shipOrientation === 'vertical') {
        newShipX = newShipX - (shipObject.length - 1);
      }

      let newOrientation = shipOrientation === 'horizontal' ? 'vertical' : 'horizontal';

      // remove ship from ships
      this.player1.gameboard.removeShip(shipObject.type);

      // place ship 
      let isPlaced = this.placeShip(
        newShipX,
        newShipY,
        shipObject.type,
        newOrientation
      );

      // if not valid, rotate ship again clockwise until valid or back to original position
      while (!isPlaced) {
        offsetX = newShipX - pivotX;
        offsetY = newShipY - pivotY;

        // rotate clockwise
        newOffsetX = -offsetY;
        newOffsetY = offsetX;

        newShipX = pivotX + newOffsetX;
        newShipY = pivotY + newOffsetY;

        // swap orientations
        let temp = shipOrientation;
        shipOrientation = newOrientation;
        newOrientation = temp;

        // if ship is vertical, shift the anchor point to the left, if horizontal shift to top
        if (shipOrientation === 'vertical') {
          newShipX = newShipX - (shipObject.length - 1);
        }

        isPlaced = this.placeShip(
          newShipX,
          newShipY,
          shipObject.type,
          newOrientation
        );
      }

      console.log({pivotX, pivotY});
    }
  }

  placeShip(x, y, shipType, orientation) {
    let isPlaced = this.player1.gameboard.placeShip(shipType, Number(x), Number(y), orientation);

    if (isPlaced) {
      // rerender gameboard
      let gameboard = document.querySelector('.start-gameboard');

      gameboard.replaceWith(renderStartBoard(this.game));
      return true;
    } else {
      return false;
    }
  }

  randomize(e) {
    // clear board in case ships are placed
    this.player1.gameboard = new Gameboard();

    // place ships randomly 
    this.player1.placeShipsRandomly();

    // return all placement ships in box and hide
    let ships = document.querySelectorAll('.ship-placement-box > *');

    for (let ship of ships) {
      ship.style.top = 0 + 'px';
      ship.style.left = 0 + 'px';
      ship.style.visibility = 'hidden';
    }

    // rerender gameboard
    let gameboard = document.querySelector('.start-gameboard');
    gameboard.replaceWith(renderStartBoard(this.game));
  }

  reset(e) {
    // clear board
    this.player1.gameboard = new Gameboard();

    // return all placement ships in box
    let ships = document.querySelectorAll('.ship-placement-box > *');

    for (let ship of ships) {
      ship.style.top = 0 + 'px';
      ship.style.left = 0 + 'px';
      ship.style.visibility = 'visible';
    }

    // rerender gameboard
    let gameboard = document.querySelector('.start-gameboard');
    gameboard.replaceWith(renderStartBoard(this.game));
  }

  start(e) {
    // check if board is valid

    // board must have 5 ships
    if (this.game.player1.gameboard.ships.length === 5) {
      // place ships randomly for ai
      this.player2.placeShipsRandomly();

      // play ambient audio
      this.ambientSound.play();

      // switch to game page
      this.clearBody();
      this.loadGamePage();
    } 
  }

  clearBody() {
    let body = document.querySelector('body');
    body.innerHTML = '';
  }
}
