import { Ship } from "../modules/ship";

describe('Ship class', () => {

  let ship;

  beforeEach(() => {
    ship = new Ship(4);
  });

  test('has a length property', () => {
    expect(
      ship.length
    ).toBeDefined();
  });

  test('increments hit counter when calling hit() method', () => {
    ship.hit()

    expect(
      ship.hits
    ).toBe(1);

    ship.hit()

    expect(
      ship.hits
    ).toBe(2);
  })

  test('has isSunk() method', () => {
    expect(
      ship.isSunk
    ).toBeDefined();
  });

  test('calculates a sunk ship correctly when calling isSunk() method', () => {
    ship.hit();

    expect(
      ship.isSunk()
    ).toBe(false);
  });

  test('sets starting coord and orientation using place() method', () => {
    ship.place(1, 2, 'horizontal');

    expect(
      ship.startCoord
    ).toEqual([1, 2]);

    expect(
      ship.orientation
    ).toBe('horizontal');
  });
});