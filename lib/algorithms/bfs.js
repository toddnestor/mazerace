import AlgorithmBase from './algorithm-base';

class BFS extends AlgorithmBase {
  constructor(grid) {
    super(grid);
  }

  nextSquare() {
    let square = this.store.shift();
    return square;
  }

  processSquare(square) {
    this.makeSeen(square);
    let neighbors = this.grid.getNeighbors(square);

    neighbors.forEach( neighbor => {
      if( !this.alreadySeen(neighbor) ) {
        neighbor.parent = square;
        this.store.push(neighbor);
        this.makeSeen(neighbor);
      }
    });
  }
}

export default BFS;
