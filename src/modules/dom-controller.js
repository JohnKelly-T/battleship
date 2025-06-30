import { renderGamePage } from "../pages/game-page";
import { renderPlayer1Board } from "./render-gameboard";
import { renderPlayer2Board } from "./render-gameboard";
import { Player } from "./player";
import { PlayerAI } from "./player-ai";
import { Game } from "./game";

export class DomController {
  constructor() {
    this.player1 = new Player();
    this.player2 = new PlayerAI();

    this.player1.placeShipsRandomly();
    this.player2.placeShipsRandomly();

    this.game = new Game(this.player1, this.player2);
  }

  loadGamePage() {
    let gamepage = renderGamePage(this.game);
    let player2Container = gamepage.querySelector('.player2-container');
    let body = document.querySelector('body');

    body.appendChild(gamepage);

    player2Container.addEventListener('click', (e) => {
      if (e.target.classList.contains('square')) {
        // return if square is disabled
        if (e.target.classList.contains('disabled')) {
          return;
        }


        // perform attack on player2 board
        if (
          this.game.makeMove(
            e.target.getAttribute('data-x'),
            e.target.getAttribute('data-y')
          )
        ) {
          // reload player2Gameboard
          let player2Gameboard = document.querySelector('.player2-gameboard');
          let newPlayer2Board = renderPlayer2Board(this.game);
          player2Gameboard.replaceWith(newPlayer2Board);
          player2Gameboard = newPlayer2Board;

          // temporarily disable board
          player2Gameboard.classList.add('disabled');
          
          setTimeout(() => {
            // make AI player move
            let [moveX, moveY] = this.player2.getRandomMove(this.game.turnEnemy.gameboard);
            this.game.makeMove(moveX, moveY);

            // reload player1Gameboard
            let player1Gameboard = document.querySelector('.player1-gameboard');
            player1Gameboard.replaceWith(renderPlayer1Board(this.game));

            // enable board again
            player2Gameboard.classList.remove('disabled');
          }, 500);
        }
      }
    });
  }
}
