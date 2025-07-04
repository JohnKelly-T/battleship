import { Ship } from "./ship";

export function renderPlayer1Board(game) { 

  let playerBoard = document.createElement('div');
  playerBoard.classList.add('player1-gameboard');
  playerBoard.classList.add('gameboard');

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      let square = document.createElement('div');
      square.classList.add('square');
      square.setAttribute('data-y', i);
      square.setAttribute('data-x', j);

      let squareItem = game.player1.gameboard.board[i][j];

      // add ship
      if (squareItem instanceof Ship) {
        let ship = document.createElement('div');
        ship.classList.add('ship');

        square.appendChild(ship);
      }

      // add marks
      let mark = game.player1.gameboard.receivedAttacks[i][j];
      let markElement = document.createElement('div');
      markElement.classList.add('mark');

      if (mark === 'miss') {
        markElement.classList.add('miss');
      } else if (mark === 'empty') {
        markElement.classList.add('empty');
      } else if (mark === 'hit') {
        // if ship is sunk, show explosion mark
        if (squareItem.isSunk()) {
          markElement.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="currentColor" d="m12 16.648l1.378-1.378h1.892v-1.892L16.648 12l-1.378-1.378V8.73h-1.892L12 7.352L10.622 8.73H8.73v1.892L7.352 12l1.378 1.378v1.892h1.892zm0 5.268L9.069 19H5v-4.069L2.085 12L5 9.069V5h4.069L12 2.085L14.931 5H19v4.069L21.916 12L19 14.931V19h-4.069z" />
            </svg>
          `;

          markElement.classList.add('explosion');
        } else {
          markElement.classList.add('hit');
        }
      }

      if (mark !== null) {
        square.appendChild(markElement);
      }

      playerBoard.appendChild(square);
    } 
  }

  return playerBoard;
}

export function renderPlayer2Board(game) { 

  let playerBoard = document.createElement('div');
  playerBoard.classList.add('player2-gameboard');
  playerBoard.classList.add('gameboard');
  playerBoard.classList.add('turn');

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      let square = document.createElement('div');
      square.classList.add('square');
      square.setAttribute('data-y', i);
      square.setAttribute('data-x', j);

      let squareItem = game.player2.gameboard.board[i][j];

      // add ship
      if (squareItem instanceof Ship && squareItem.isSunk()) {
        let ship = document.createElement('div');
        ship.classList.add('ship');

        square.appendChild(ship);
      }

      // add marks
      let mark = game.player2.gameboard.receivedAttacks[i][j];
      let markElement = document.createElement('div');
      markElement.classList.add('mark');

      if (mark === 'miss') {
        markElement.classList.add('miss');
      } else if (mark === 'empty') {
        markElement.classList.add('empty');
      } else if (mark === 'hit') {
        // if ship is sunk, show explosion mark
        if (squareItem.isSunk()) {
          markElement.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="currentColor" d="m12 16.648l1.378-1.378h1.892v-1.892L16.648 12l-1.378-1.378V8.73h-1.892L12 7.352L10.622 8.73H8.73v1.892L7.352 12l1.378 1.378v1.892h1.892zm0 5.268L9.069 19H5v-4.069L2.085 12L5 9.069V5h4.069L12 2.085L14.931 5H19v4.069L21.916 12L19 14.931V19h-4.069z" />
            </svg>
          `;

          markElement.classList.add('explosion');
        } else {
          markElement.classList.add('hit');
        }
      }

      if (mark !== null) {
        square.appendChild(markElement);
      }

      playerBoard.appendChild(square);
    } 
  }

  return playerBoard;
}

export function renderStartBoard(game) {

  let playerBoard = document.createElement('div');
  playerBoard.classList.add('start-gameboard');
  playerBoard.classList.add('gameboard');

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      let square = document.createElement('div');
      square.classList.add('square');
      square.setAttribute('data-y', i);
      square.setAttribute('data-x', j);

      let squareItem = game.player1.gameboard.board[i][j];

      // add ship
      if (squareItem instanceof Ship) {
        let ship = document.createElement('div');
        ship.classList.add('ship');
        ship.setAttribute('data-ship-type', squareItem.type);
        ship.setAttribute('data-y', i);
        ship.setAttribute('data-x', j);
        ship.setAttribute('data-orientation', squareItem.orientation);

        square.appendChild(ship);
      }

      playerBoard.appendChild(square);
    } 
  }

  return playerBoard;
}