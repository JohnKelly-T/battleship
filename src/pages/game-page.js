import { Ship } from "../modules/ship";
import { renderPlayer1Board } from "../modules/render-gameboard";
import { renderPlayer2Board } from "../modules/render-gameboard";

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

  let player1Gameboard = renderPlayer1Board(game);

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
  player2Container.classList.add('player2-container');

  let player2Gameboard = renderPlayer2Board(game);

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