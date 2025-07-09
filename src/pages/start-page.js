import { renderStartBoard } from "../modules/render-gameboard";

export function renderStartPage(game) {
  let startPage = document.createElement("div");
  startPage.classList.add("start-page-container");

  let startMenuContainer = document.createElement("div");
  startMenuContainer.classList.add("start-menu-container");

  let boardContainer = document.createElement("div");
  boardContainer.classList.add("board-container");

  let clickToRotate = document.createElement("div");
  clickToRotate.classList.add("click-to-rotate");
  clickToRotate.textContent = "Click ship to rotate it";

  let startGameboard = renderStartBoard(game);

  let optionsContainer = document.createElement("div");
  optionsContainer.classList.add("options-container");

  let randomizeButton = document.createElement("button");
  randomizeButton.classList.add("randomize-button");
  randomizeButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path fill="currentColor" d="M10.998 1.58a2 2 0 0 1 2.004 0l7.5 4.342a2 2 0 0 1 .998 1.731v8.694a2 2 0 0 1-.998 1.73l-7.5 4.343a2 2 0 0 1-2.004 0l-7.5-4.342a2 2 0 0 1-.998-1.731V7.653a2 2 0 0 1 .998-1.73zM4.5 7.653v.005l6.502 3.764A2 2 0 0 1 12 13.153v7.536l7.5-4.342V7.653L12 3.311zM6.132 12.3c0-.552-.388-1.224-.866-1.5s-.866-.052-.866.5s.388 1.224.866 1.5s.866.052.866-.5m2.597 6.498c.478.276.866.053.866-.5c0-.552-.388-1.224-.866-1.5s-.866-.052-.866.5s.388 1.224.866 1.5M5.266 16.8c.478.276.866.052.866-.5s-.388-1.224-.866-1.5s-.866-.052-.866.5s.388 1.224.866 1.5m3.463-2c.478.277.866.053.865-.5c0-.552-.387-1.223-.866-1.5c-.478-.276-.866-.052-.866.5c0 .553.388 1.224.867 1.5M14.898 8c.478-.276.478-.724 0-1s-1.254-.276-1.732 0c-.479.276-.479.724 0 1c.478.276 1.254.276 1.732 0m-4.8-1c.478.276.478.724 0 1s-1.254.276-1.732 0s-.478-.724 0-1s1.254-.276 1.732 0m5.897 8.35c.598-.346 1.083-1.185 1.083-1.875s-.485-.97-1.082-.625s-1.083 1.184-1.083 1.875c0 .69.485.97 1.082.625" />
    </svg>
    randomize
  `;

  let resetButton = document.createElement("button");
  resetButton.classList.add("reset-button");
  resetButton.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
	<path fill="none" stroke="currentColor" d="M2.489 3.011V5.99h3m-1.825 5.396a5.5 5.5 0 1 0-.857-5.203" stroke-width="1.5" />
</svg>
    reset
  `;

  optionsContainer.appendChild(randomizeButton);
  optionsContainer.appendChild(resetButton);

  // append board container children
  boardContainer.appendChild(clickToRotate);
  boardContainer.appendChild(startGameboard);
  boardContainer.appendChild(optionsContainer);

  // start menu

  let startMenu = document.createElement("div");
  startMenu.classList.add("start-menu");

  let startTitleContainer = document.createElement("div");
  startTitleContainer.classList.add("start-title-container");

  startTitleContainer.innerHTML = `
    <div class="logo">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 7.75A4.25 4.25 0 1 0 16.25 12a.75.75 0 0 1 1.5 0a5.75 5.75 0 1 1-3.45-5.271a.75.75 0 0 1-.6 1.374A4.2 4.2 0 0 0 12 7.75" opacity="0.5" />
        <path fill="currentColor" d="M12 4.75a7.25 7.25 0 0 0-1.233 14.396a1.498 1.498 0 0 1 2.466 0A7.25 7.25 0 0 0 19.25 12a.75.75 0 0 1 1.5 0a8.75 8.75 0 0 1-7.396 8.646a1.5 1.5 0 0 1-2.708 0a8.75 8.75 0 1 1 4.636-16.76a.75.75 0 1 1-.563 1.39A7.2 7.2 0 0 0 12 4.75" />
        <path fill="currentColor" d="M14 12a2 2 0 1 1-1.219-1.842L17.97 4.97a.75.75 0 1 1 1.06 1.06l-5.188 5.189c.102.24.158.504.158.781m-7 1.5a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3" />
      </svg>
    </div>
    <div class="title">Battleship</div>
  `;

  let shipPlacementContainer = document.createElement("div");
  shipPlacementContainer.classList.add("ship-placement-container");

  let placeYourShips = document.createElement("div");
  placeYourShips.classList.add("place-your-ships");
  placeYourShips.textContent = "Place your ships!";

  let shipPlacementBox = document.createElement("div");
  shipPlacementBox.classList.add("ship-placement-box");

  // create ships
  let carrier = document.createElement("div");
  carrier.classList.add("carrier");
  carrier.setAttribute("data-ship-type", "carrier");

  for (let i = 0; i < 5; i++) {
    let square = document.createElement("div");
    square.classList.add("square");

    let ship = document.createElement("div");
    ship.classList.add("ship");

    square.appendChild(ship);

    carrier.appendChild(square);
  }

  let battleship = document.createElement("div");
  battleship.classList.add("battleship");
  battleship.setAttribute("data-ship-type", "battleship");

  for (let i = 0; i < 4; i++) {
    let square = document.createElement("div");
    square.classList.add("square");

    let ship = document.createElement("div");
    ship.classList.add("ship");

    square.appendChild(ship);

    battleship.appendChild(square);
  }

  let destroyer = document.createElement("div");
  destroyer.classList.add("destroyer");
  destroyer.setAttribute("data-ship-type", "destroyer");

  for (let i = 0; i < 3; i++) {
    let square = document.createElement("div");
    square.classList.add("square");

    let ship = document.createElement("div");
    ship.classList.add("ship");

    square.appendChild(ship);

    destroyer.appendChild(square);
  }

  let patrolBoat = document.createElement("div");
  patrolBoat.classList.add("patrol-boat");
  patrolBoat.setAttribute("data-ship-type", "patrolBoat");

  for (let i = 0; i < 2; i++) {
    let square = document.createElement("div");
    square.classList.add("square");

    let ship = document.createElement("div");
    ship.classList.add("ship");

    square.appendChild(ship);

    patrolBoat.appendChild(square);
  }

  let submarine = document.createElement("div");
  submarine.classList.add("submarine");
  submarine.setAttribute("data-ship-type", "submarine");

  for (let i = 0; i < 3; i++) {
    let square = document.createElement("div");
    square.classList.add("square");

    let ship = document.createElement("div");
    ship.classList.add("ship");

    square.appendChild(ship);

    submarine.appendChild(square);
  }

  // add ships to box
  shipPlacementBox.appendChild(carrier);
  shipPlacementBox.appendChild(battleship);
  shipPlacementBox.appendChild(patrolBoat);
  shipPlacementBox.appendChild(destroyer);
  shipPlacementBox.appendChild(submarine);

  shipPlacementContainer.appendChild(placeYourShips);
  shipPlacementContainer.appendChild(shipPlacementBox);

  let startButton = document.createElement("button");
  startButton.classList.add("start-button");
  startButton.textContent = "start";

  // append startMenu Container children
  startMenu.appendChild(startTitleContainer);
  startMenu.appendChild(shipPlacementContainer);
  startMenu.appendChild(startButton);

  let attributionContainer = document.createElement("div");
  attributionContainer.classList.add("attribution-container");

  attributionContainer.innerHTML = `
    <div class="credit">
      &copy; 2025 - Designed and Developed by 
      <a href="https://github.com/JohnKelly-T">
        John Kelly
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            color="currentColor"
          >
            <path d="M10 20.568c-3.429 1.157-6.286 0-8-3.568" />
            <path
              d="M10 22v-3.242c0-.598.184-1.118.48-1.588c.204-.322.064-.78-.303-.88C7.134 15.452 5 14.107 5 9.645c0-1.16.38-2.25 1.048-3.2c.166-.236.25-.354.27-.46c.02-.108-.015-.247-.085-.527c-.283-1.136-.264-2.343.16-3.43c0 0 .877-.287 2.874.96c.456.285.684.428.885.46s.469-.035 1.005-.169A9.5 9.5 0 0 1 13.5 3a9.6 9.6 0 0 1 2.343.28c.536.134.805.2 1.006.169c.2-.032.428-.175.884-.46c1.997-1.247 2.874-.96 2.874-.96c.424 1.087.443 2.294.16 3.43c-.07.28-.104.42-.084.526s.103.225.269.461c.668.95 1.048 2.04 1.048 3.2c0 4.462-2.134 5.807-5.177 6.643c-.367.101-.507.559-.303.88c.296.47.48.99.48 1.589V22"
            />
          </g>
        </svg>
      </a>
    </div>
  `;

  startMenuContainer.appendChild(boardContainer);
  startMenuContainer.appendChild(startMenu);

  startPage.appendChild(startMenuContainer);
  startPage.appendChild(attributionContainer);

  return startPage;
}
