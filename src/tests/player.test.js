import { Player } from "../modules/player.js";
import { Gameboard } from "../modules/gameboard.js";

describe('Player class', () => {
  test('has gameboard property', () => {
    let player = new Player();

    expect(
      player.board
    ).toBeDefined();

    expect(
      player.board
    ).toBeInstanceOf(Gameboard);
  })
});