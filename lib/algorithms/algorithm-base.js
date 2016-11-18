class AlgorithmBase {
  constructor(grid) {
    this.grid = grid;

    this.store = [this.grid.start];
    this.steps = 0;
    this.maxStore = 1;
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
    this.steps++;
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

    this.updateMaxLength();

    return newStore;
  }

  updateMaxLength() {
    if( this.store.length > this.maxStore ) {
      this.maxStore = this.store.length;
    }
  }

  drawPath(square) {
    this.grid.drawPath(square, () => this.displayStats());
  }

  displayStats() {
    this.grid.displayStats(this.steps, this.maxStore);
  }
}

export default AlgorithmBase;
