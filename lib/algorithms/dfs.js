import AlgorithmBase from './algorithm-base';

class DFS extends AlgorithmBase {
  nextSquare() {
    return this.store.pop();
  }
}

export default DFS;
