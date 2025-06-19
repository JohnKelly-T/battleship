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

  describe('receiveAttack method', () => {
    beforeEach(() => {
      gameboard.placeShip('carrier', 0, 0, 'horizontal');
      gameboard.placeShip('battleship', 0, 1, 'horizontal');
      gameboard.placeShip('destroyer', 0, 2, 'horizontal');
      gameboard.placeShip('submarine', 0, 3, 'horizontal');
      gameboard.placeShip('patrolBoat', 0, 4, 'horizontal');
    });

    test('sends hit to correct ship', () => {
      gameboard.receiveAttack(1, 0);

      expect(
        gameboard.ships[0].hits
      ).toBe(1);

      gameboard.receiveAttack(2, 1);

      expect(
        gameboard.ships[1].hits
      ).toBe(1);

      gameboard.receiveAttack(0, 2);

      expect(
        gameboard.ships[2].hits
      ).toBe(1);

      gameboard.receiveAttack(2, 3);

      expect(
        gameboard.ships[3].hits
      ).toBe(1);
    });

    test('records hits', () => {
      gameboard.receiveAttack(1, 0);
      gameboard.receiveAttack(2, 1);
      gameboard.receiveAttack(1, 2);
      gameboard.receiveAttack(2, 3);

      expect(
        gameboard.receivedAttacks[0][1]
      ).toBe('hit');

      expect(
        gameboard.receivedAttacks[1][2]
      ).toBe('hit');

      expect(
        gameboard.receivedAttacks[2][1]
      ).toBe('hit');

      expect(
        gameboard.receivedAttacks[3][2]
      ).toBe('hit');
    });

    test('records misses', () => {
      gameboard.receiveAttack(7, 0);
      gameboard.receiveAttack(8, 1);
      gameboard.receiveAttack(6, 2);
      gameboard.receiveAttack(9, 3);

      expect(
        gameboard.receivedAttacks[0][7]
      ).toBe('miss');

      expect(
        gameboard.receivedAttacks[1][8]
      ).toBe('miss');

      expect(
        gameboard.receivedAttacks[2][6]
      ).toBe('miss');

      expect(
        gameboard.receivedAttacks[3][9]
      ).toBe('miss');
    });

    test('returns true for a valid hit', () => {
      expect(
        gameboard.receiveAttack(7, 0)
      ).toBe(true);
    });

    test('returns false when coordinate has already been hit', () => {
      expect(
        gameboard.receiveAttack(7, 0)
      ).toBe(true);

      expect(
        gameboard.receiveAttack(7, 0)
      ).toBe(false);
    });
  });

  describe('areAllShipsSunk method', () => {
    beforeEach(() => {
      gameboard.placeShip('carrier', 0, 0, 'horizontal');
      gameboard.placeShip('battleship', 0, 1, 'horizontal');
      gameboard.placeShip('destroyer', 0, 2, 'horizontal');
      gameboard.placeShip('submarine', 0, 3, 'horizontal');
      gameboard.placeShip('patrolBoat', 0, 4, 'horizontal');
    });

    test('returns false when there are still ships to sink', () => {
      expect(
        gameboard.areAllShipsSunk()
      ).toBe(false);
    });

    test('returns true when all ships are sunk', () => {

      // place hits on all squares to sink all ships
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          gameboard.receiveAttack(i, j);
        }
      }

      expect(
        gameboard.areAllShipsSunk()
      ).toBe(true);
    })
  })
});   