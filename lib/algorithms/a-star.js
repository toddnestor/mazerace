import BestFS from './bestfs';

class AStar extends BestFS {
  constructor(grid) {
    super(grid);
    this.lastChecked = null;
  }

  nextSquare() {
    let bestSquare = null;
    let distanceFromEnd = null;

    this.store.forEach( square => {
      let distance = this.distanceFromEnd(square) + this.gScore(square);

      if( distanceFromEnd === null || distance < distanceFromEnd ) {
        distanceFromEnd = distance;
        bestSquare = square;
      } else if( distance === distanceFromEnd && square.parent  && square.parent == this.lastChecked ) {
        bestSquare = square;
      }
    });

    this.removeSquareFromStore(bestSquare);

    this.lastChecked = bestSquare;

    return bestSquare;
  }

  processSquare(square, diagonal = false) {
    this.steps++;

    this.makeSeen(square);
    let neighbors = this.grid.getNeighbors(square, diagonal);
    let newStore = [];

    neighbors.forEach( neighbor => {
      let gScore = this.gScore(square) + this.gScoreAddition(square, neighbor);
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

  gScoreAddition(square, neighbor) {
    let sameRow = square.row == neighbor.row;
    let sameCol = square.col == neighbor.col;
    return sameRow || sameCol ? 1 : Math.sqrt(2);
  }

  gScore(square) {
    return this.gScores[square.row][square.col];
  }

  setgScore(square, score) {
    this.gScores[square.row][square.col] = score;
  }

}

export default AStar;
