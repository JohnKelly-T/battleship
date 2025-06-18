import { Gameboard } from "../modules/gameboard";
import { Ship } from "../modules/ship";

describe('Gameboard class', () => {

  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard;
  });

  test('has a board property', () => {
    expect(
      gameboard.board
    ).toBeDefined();
  });

  test('board is a 10x10 array', () => {
    expect(gameboard.board.length).toBe(10);

    for (let col of gameboard.board) {
      expect(col.length).toBe(10);
    }
  });

  test('board is filled with null', () => {

    for (let row of gameboard.board) {
      for (let square of row) {
        expect(square).toBe(null);
      }
    }
  });

  describe('placeShip method', () => {
    test('places ships correctly', () => {

      gameboard.placeShip('carrier', 0, 0, 'horizontal');
      

      for (let i = 0; i < 5; i++) {
        expect(
          gameboard.board[0][i]
        ).toBeInstanceOf(Ship);
      }

      gameboard.placeShip('battleship', 0, 1, 'horizontal');

      for (let i = 0; i < 4; i++) {
        expect(
          gameboard.board[1][i]
        ).toBeInstanceOf(Ship);
      }
    });

    test('does not place ship if there is a collision', () => {
      gameboard.placeShip('carrier', 0, 0, 'horizontal');
      gameboard.placeShip('battleship', 3, 0, 'horizontal');

      for (let i = 0; i < 5; i++) {
        expect(
          gameboard.board[0][i]
        ).toBeInstanceOf(Ship);
      }

      for (let i = 5; i < 10; i++){
        expect(
          gameboard.board[0][i]
        ).not.toBeInstanceOf(Ship);
      };
    });

    test('does not place ship if out of bounds', () => {
      gameboard.placeShip('carrier', 8, 0, 'horizontal');

      for (let row of gameboard.board) {
        for (let square of row) {
          expect(
            square
          ).toBe(null);
        }
      }

    });
  });


});