import AlgorithmBase from './algorithm-base';

class BestFS extends AlgorithmBase {
  constructor(grid) {
    super(grid);
    this.setupGscores();
  }

  setupGscores() {
    this.gScores = {};

    for( let i = 0; i < 30; i++ ) {
      this.gScores[i] = {};

      for( let j = 0; j < 30; j++ ) {
        this.gScores[i][j] = 0;
      }
    }
  }

  nextSquare() {
    const tmp = this.store[0];
    this.store[0] = this.store[this.store.length - 1];
    this.store[this.store.length - 1] = tmp;

    let bestSquare = this.store.pop();

    this.heapifyDown();

    return bestSquare;
  }

  distanceFromEnd(square) {
    let {end} = this.grid;

    let x1 = end.row;
    let x2 = square.row;
    let y1 = end.col;
    let y2 = square.col;

    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  parentIndex(idx) {
    if( idx === 0 ) {
      throw "Root has no parent";
      return;
    }

    return Math.floor((idx - 1) / 2);
  }

  childIndices(parent_index) {
    return [parent_index * 2 + 1, parent_index * 2 + 2].filter( i => i < this.store.length);
  }

  heapifyUp() {
    let idx = this.store.length - 1;

    while( idx > 0 ) {
      const parent = this.parentIndex(idx);

      if( this.heapGScore(parent) > this.heapGScore(idx) ) {
        const tmp = this.store[parent];
        this.store[parent] = this.store[idx];
        this.store[idx] = tmp;
        idx = parent;
      } else {
        break;
      }
    }
  }

  heapifyDown() {
    let idx = 0;

    while( idx < this.store.length ) {
      let children = this.childIndices(idx);

      let min = null;

      if( children.length === 1 ) {
        min = children[0];
      } else if( children.length === 2 ) {
        min = this.heapGScore(children[0]) < this.heapGScore(children[1]) ? children[0] : children[1];
      }

      if( min && this.heapGScore(min) < this.heapGScore(idx) ) {
        const tmp = this.store[min];
        this.store[min] = this.store[idx];
        this.store[idx] = tmp;

        idx = min;
      } else {
        break;
      }
    }
  }

  heapGScore(idx) {
    let square = this.store[idx];

    return this.distanceFromEnd(square) + this.gScore(square);
  }

  calculateGscore(square) {
    return 0;
  }

  processSquare(square, diagonal = false) {
    this.steps++;
    this.makeSeen(square);
    let neighbors = this.grid.getNeighbors(square, diagonal);
    let newStore = [];

    neighbors.forEach( neighbor => {
      let gScore = this.calculateGscore(neighbor, square);
      let gScoreIsBest = false;

      if( !this.alreadySeen(neighbor) ) {
        gScoreIsBest = true;
        this.store.push(neighbor);
        newStore.push(neighbor);
        this.makeSeen(neighbor);
        this.setgScore(neighbor, gScore);
        this.heapifyUp();
      } else if( gScore < this.gScore(neighbor) ) {
        gScoreIsBest = true;
      }

      if( gScoreIsBest ) {
        neighbor.parent = square;
        this.setgScore(neighbor, gScore);
      }
    });

    this.updateMaxLength();

    return newStore;
  }

  gScore(square) {
    return this.gScores[square.row][square.col];
  }

  setgScore(square, score) {
    this.gScores[square.row][square.col] = score;
  }
}

export default BestFS;
