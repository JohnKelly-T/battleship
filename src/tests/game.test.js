import { Game } from "../modules/game.js";
import { Player } from "../modules/player.js";

describe('Game class', () => {
  let game;

  beforeEach(() => {
    let player1 = new Player();
    let player2 = new Player();

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
});
