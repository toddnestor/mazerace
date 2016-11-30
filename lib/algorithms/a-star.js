import BestFS from './bestfs';

class AStar extends BestFS {
  calculateGscore(square, parent) {
    return this.gScore(parent) + this.gScoreAddition(parent, square);
  }

  gScoreAddition(square, neighbor) {
    let sameRow = square.row == neighbor.row;
    let sameCol = square.col == neighbor.col;
    return sameRow || sameCol ? 1 : Math.sqrt(2);
  }
}

export default AStar;
