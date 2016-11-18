import AlgorithmBase from './algorithm-base';

class BestFS extends AlgorithmBase {
  nextSquare() {
    let bestSquare = null;
    let distanceFromEnd = null;

    this.store.forEach( square => {
      let distance = this.distanceFromEnd(square);

      if( distanceFromEnd === null || distance < distanceFromEnd ) {
        distanceFromEnd = distance;
        bestSquare = square;
      }
    });

    this.removeSquareFromStore(bestSquare);

    return bestSquare;
  }

  removeSquareFromStore(square) {
    let newStore = [];

    this.store.forEach( item => {
      if( item !== square ) {
        newStore.push( item );
      }
    });

    this.store = newStore;
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
