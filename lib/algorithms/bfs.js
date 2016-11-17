import AlgorithmBase from './algorithm-base';

class BFS extends AlgorithmBase {
  nextSquare() {
    let square = this.store.shift();
    return square;
  }
}

export default BFS;
