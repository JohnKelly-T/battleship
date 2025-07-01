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

    let player1RemainingShips = gamepage.querySelector('.player1-remaining-ships');
    let player2RemainingShips = gamepage.querySelector('.player2-remaining-ships');

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

            newPlayer1Board.classList.add('not-turn');

            // enable board again
            player2Gameboard.classList.remove('disabled');
            player2Gameboard.classList.add('turn');
            player2Gameboard.classList.remove('not-turn');
          }, 800);
        }
      }

      // update remaining ships count
      player1RemainingShips.textContent =  this.player1.gameboard.remainingShips;
      player2RemainingShips.textContent =  this.player2.gameboard.remainingShips;
      

      console.log("Player1 remaining: ", this.player1.gameboard.remainingShips, " Player2 remaining: ", this.player2.gameboard.remainingShips);
    });
  }

}
