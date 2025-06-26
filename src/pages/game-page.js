import { Ship } from "../modules/ship";

export function renderGamePage(game) {
  let gamepage = document.createElement('div');
  gamepage.classList.add('game-page-container');

  let titleContainer = document.createElement('div');
  titleContainer.classList.add('title-container');
  titleContainer.innerHTML = `
    <div class="logo"></div>
    <div class="title">Battleship</div>
  `;

  let gameContainer = document.createElement('div');
  gameContainer.classList.add('game-container');

  let player1Container = document.createElement('div');
  player1Container.classList.add('player-container');

  let player1Gameboard = document.createElement('div');
  player1Gameboard.classList.add('player1-gameboard');
  player1Gameboard.classList.add('gameboard');

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

      player1Gameboard.appendChild(square);
    } 
  }


  let player1Stats = document.createElement('div');
  player1Stats.classList.add('stats');
  player1Stats.innerHTML = `
    <div class="name">You</div>
    <div class="remaining-ships-label">
      Remaining ships:
      <div class="player1-remaining-ships remaining-ships">5</div>
    </div>
  `;

  
  let player2Container = document.createElement('div');
  player2Container.classList.add('player-container');

  let player2Gameboard = document.createElement('div');
  player2Gameboard.classList.add('player2-gameboard');
  player2Gameboard.classList.add('gameboard');

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

      player2Gameboard.appendChild(square);
    } 
  }

  let player2Stats = document.createElement('div');
  player2Stats.classList.add('stats');
  player2Stats.innerHTML = `
    <div class="name">AI</div>
    <div class="remaining-ships-label">
      Remaining ships:
      <div class="player2-remaining-ships remaining-ships">5</div>
    </div>
  `;


  player1Container.appendChild(player1Gameboard);
  player1Container.appendChild(player1Stats);

  player2Container.appendChild(player2Gameboard);
  player2Container.appendChild(player2Stats);


  gameContainer.appendChild(player1Container);
  gameContainer.appendChild(player2Container);

  let quitButton = document.createElement('button');
  quitButton.classList.add('quit-button');
  quitButton.textContent = 'quit';


  gamepage.appendChild(titleContainer);
  gamepage.appendChild(gameContainer);
  gamepage.appendChild(quitButton);

  return gamepage;
}