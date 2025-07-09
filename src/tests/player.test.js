import { Player } from "../modules/player.js";
import { Gameboard } from "../modules/gameboard.js";

describe("Player class", () => {
  test("has gameboard property", () => {
    let player = new Player();

    expect(player.gameboard).toBeDefined();

    expect(player.gameboard).toBeInstanceOf(Gameboard);
  });

  describe("placeShipsRandomly() method", () => {
    let player;

    beforeEach(() => {
      player = new Player();
    });

    test("places the correct number of ships", () => {
      player.placeShipsRandomly();

      expect(player.gameboard.ships.length).toBe(5);
    });

    test("places ships of each type", () => {
      player.placeShipsRandomly();

      expect(player.gameboard.ships).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ length: 5 }),
          expect.objectContaining({ length: 4 }),
          expect.objectContaining({ length: 3 }),
          expect.objectContaining({ length: 3 }),
          expect.objectContaining({ length: 2 }),
        ]),
      );
    });
  });
});
