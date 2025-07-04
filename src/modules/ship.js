class Ship {
  constructor(length, type = '') {
    this.length = length;
    this.type = type;
    this.hits = 0;
    this.startCoord = null;
    this.orientation = null;
  }

  place(x, y, orientation) {
    this.startCoord = [x, y];
    this.orientation = orientation;
  }

  hit() {
    this.hits++;
  }

  isSunk() {
    if (this.hits === this.length) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = { Ship };