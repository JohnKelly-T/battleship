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
});