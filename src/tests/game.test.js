import { Game } from "../modules/game.js";
import { Player } from "../modules/player.js";

describe('Game class', () => {
  let game;
  let player1;
  let player2;

  beforeEach(() => {
    player1 = new Player();
    player2 = new Player();

    player1.placeShipsRandomly();
    player2.placeShipsRandomly();

    game = new Game(player1, player2);
  });

  describe('toggle turn method', () => {
    test('swaps current turn player and enemy', () => {
      expect(
        game.turnPlayer
      ).toMatchObject(game.player1);

      game.toggleTurn();

      expect(
        game.turnPlayer
      ).toMatchObject(game.player2);
    })
  })

  describe('make move method', () => {
    test('makes move on correct player', () => {
      let xMove = 1;
      let yMove = 2;

      // player 1 makes move on player 2
      game.makeMove(xMove, yMove);

      expect(
        player2.gameboard.receivedAttacks[yMove][xMove]
      ).not.toBeNull();

      xMove = 4;
      yMove = 5;


      // player 2 makes move on player 1
      game.makeMove(xMove, yMove);

      expect(
        player1.gameboard.receivedAttacks[yMove][xMove]
      ).not.toBeNull();

    });
  });
});
