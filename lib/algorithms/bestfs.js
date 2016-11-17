import AlgorithmBase from './algorithm-base';

class BestFS extends AlgorithmBase {
  nextSquare() {
    let bestSquare = null;
    let distanceFromEnd = null;

    this.store.forEach( square => {
      let distance = this.distanceFromEnd(square);

      if( !distanceFromEnd || distance < distanceFromEnd ) {
        distanceFromEnd = distance;
        bestSquare = square;
      }
    });

    let newStore = [];

    this.store.forEach( square => {
      if( square !== bestSquare ) {
        newStore.push( square );
      }
    });

    this.store = newStore;

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
}

export default BestFS;
