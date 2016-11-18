import BestFS from './bestfs';

class AStar extends BestFS {
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

  processSquare(square, diagonal = false) {
    this.steps++;

    this.makeSeen(square);
    let neighbors = this.grid.getNeighbors(square, diagonal);
    let newStore = [];

    neighbors.forEach( neighbor => {
      let gScore = this.gScore(square) + 1;
      let gScoreIsBest = false;

      if( !this.alreadySeen(neighbor) ) {
        gScoreIsBest = true;
        neighbor.parent = square;
        this.store.push(neighbor);
        newStore.push(neighbor);
        this.makeSeen(neighbor);
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

export default AStar;
