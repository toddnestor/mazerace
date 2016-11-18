import AlgorithmBase from './algorithm-base';

class BFS extends AlgorithmBase {
  nextSquare() {
    return this.store.shift();
  }
}

export default BFS;
