import { renderGamePage } from "../pages/game-page";
import { Player } from "./player";
import { Game } from "./game";

export class DomController {
  constructor() {
    this.player1 = new Player();
    this.player2 = new Player();

    this.player1.placeShipsRandomly();
    this.player2.placeShipsRandomly();

    this.game = new Game(this.player1, this.player2);
  }

  loadGamePage() {
    let gamepage = renderGamePage(this.game);
    let body = document.querySelector('body');
    body.appendChild(gamepage);
  }
}
