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

  processSquare(square, diagonal = false) {
    this.makeSeen(square);
    let neighbors = this.grid.getNeighbors(square, diagonal);
    let newStore = [];

    neighbors.forEach( neighbor => {
      if( !this.alreadySeen(neighbor) ) {
        neighbor.parent = square;
        this.store.push(neighbor);
        newStore.push(neighbor);
        this.makeSeen(neighbor);
      }
    });

    return newStore;
  }

  drawPath(square) {
    this.grid.drawPath(square);
  }
}

export default AlgorithmBase;
