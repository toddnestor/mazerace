class AlgorithmBase {
  constructor(grid) {
    this.grid = grid;

    this.store = [this.grid.start];
    this.seen = {};
  }

  alreadySeen(square) {
    return this.seen[square.row] && this.seen[square.row][square.col];
  }

  makeSeen(square) {
    if( !this.seen[square.row] ) {
      this.seen[square.row] = {};
    }

    this.seen[square.row][square.col] = true;
  }

  drawPath(square) {
    this.grid.drawPath(square);
  }
}

export default AlgorithmBase;
