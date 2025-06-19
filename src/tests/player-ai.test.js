import { Player } from "../modules/player.js";
import { PlayerAI } from "../modules/player-ai.js";

describe('Player AI class', () => {
  describe('getRandomMove method', () => {
    let player = new Player();
    let playerAI = new PlayerAI();

    player.placeShipsRandomly();
    playerAI.placeShipsRandomly();

    let aiMove = playerAI.getRandomMove({ ...player.gameboard});

    test('returns an array containing two values', () => {
      expect(
        aiMove
      ).toHaveLength(2);
    })

    test('returns x and y coordinate within bounds', () => {
      for (let coord of aiMove) {
        expect(coord).toBeGreaterThanOrEqual(0);
        expect(coord).toBeLessThan(10);
      }
    })
  });
});