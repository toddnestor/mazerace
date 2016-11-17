import AlgorithmBase from './algorithm-base';

class DFS extends AlgorithmBase {
  nextSquare() {
    let square = this.store.pop();
    return square;
  }
}

export default DFS;
