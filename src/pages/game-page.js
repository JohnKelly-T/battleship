import { Ship } from "../modules/ship";
import { renderPlayer1Board } from "../modules/render-gameboard";
import { renderPlayer2Board } from "../modules/render-gameboard";

export function renderGamePage(game) {
  let gamepage = document.createElement("div");
  gamepage.classList.add("game-page-container");

  let titleContainer = document.createElement("div");
  titleContainer.classList.add("title-container");

  titleContainer.innerHTML = `
    <div class="logo">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 7.75A4.25 4.25 0 1 0 16.25 12a.75.75 0 0 1 1.5 0a5.75 5.75 0 1 1-3.45-5.271a.75.75 0 0 1-.6 1.374A4.2 4.2 0 0 0 12 7.75" opacity="0.5" />
        <path fill="currentColor" d="M12 4.75a7.25 7.25 0 0 0-1.233 14.396a1.498 1.498 0 0 1 2.466 0A7.25 7.25 0 0 0 19.25 12a.75.75 0 0 1 1.5 0a8.75 8.75 0 0 1-7.396 8.646a1.5 1.5 0 0 1-2.708 0a8.75 8.75 0 1 1 4.636-16.76a.75.75 0 1 1-.563 1.39A7.2 7.2 0 0 0 12 4.75" />
        <path fill="currentColor" d="M14 12a2 2 0 1 1-1.219-1.842L17.97 4.97a.75.75 0 1 1 1.06 1.06l-5.188 5.189c.102.24.158.504.158.781m-7 1.5a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3" />
      </svg>
    </div>
    <div class="title">Battleship</div>
  `;

  let gameContainer = document.createElement("div");
  gameContainer.classList.add("game-container");

  let player1Container = document.createElement("div");
  player1Container.classList.add("player-container");

  let player1Gameboard = renderPlayer1Board(game);

  let player1Stats = document.createElement("div");
  player1Stats.classList.add("stats");
  player1Stats.classList.add("player1-stats");

  player1Stats.innerHTML = `
    <div class="name">You</div>
    <div class="remaining-ships-label">
      Remaining ships:
      <div class="player1-remaining-ships remaining-ships">5</div>
    </div>
  `;

  let player2Container = document.createElement("div");
  player2Container.classList.add("player-container");
  player2Container.classList.add("player2-container");

  let player2Gameboard = renderPlayer2Board(game);

  let player2Stats = document.createElement("div");
  player2Stats.classList.add("stats");
  player2Stats.classList.add("player2-stats");
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

  let quitButton = document.createElement("button");
  quitButton.classList.add("quit-button");
  quitButton.textContent = "quit";

  let volumeButton = document.createElement("button");
  volumeButton.classList.add("volume-button");
  volumeButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path fill="currentColor" fill-rule="evenodd" d="M9.383 3.076A1 1 0 0 1 10 4v12a1 1 0 0 1-1.707.707L4.586 13H2a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h2.586l3.707-3.707a1 1 0 0 1 1.09-.217m5.274-.147a1 1 0 0 1 1.414 0A9.97 9.97 0 0 1 19 10a9.97 9.97 0 0 1-2.929 7.071a1 1 0 0 1-1.414-1.414A7.97 7.97 0 0 0 17 10a7.97 7.97 0 0 0-2.343-5.657a1 1 0 0 1 0-1.414m-2.829 2.828a1 1 0 0 1 1.415 0A5.98 5.98 0 0 1 15 10a5.98 5.98 0 0 1-1.757 4.243a1 1 0 0 1-1.415-1.415A3.98 3.98 0 0 0 13 10a3.98 3.98 0 0 0-1.172-2.828a1 1 0 0 1 0-1.415" clip-rule="evenodd" />
    </svg>
  `;

  gamepage.appendChild(titleContainer);
  gamepage.appendChild(gameContainer);
  gamepage.appendChild(quitButton);
  gamepage.appendChild(volumeButton);

  return gamepage;
}
