import AStar from './algorithms/a-star';
import BFS from './algorithms/bfs';
import DFS from './algorithms/dfs';
import BestFS from './algorithms/bestfs';

class Solver {
  constructor(grid) {
    this.grid = grid;
    this.algorithms = {
      bfs: 'Breadth First Search',
      dfs: 'Depth First Search',
      best: 'Best First Search',
      // astar: 'A*'
    }

    this.selectedAlgorithms = [];

    this.setAlgorithmOptions();
    this.bindEvents();
  }

  bindEvents() {
    document.querySelector('.play-button').addEventListener('click', e => {
      this.paused = false;

      if( !this.searching ) {
        this.searching = true;
        this.grid.reset();
        let alg1Ready = false;
        let alg2Ready = false;

        if( this.selectedAlgorithms.length > 1 ) {
          this.firstDone = false;
          this.secondDone = false;
          let grid1 = this.grid.clone(document.getElementById('firstAlgorithm'), 20, () => {
            this.firstAlgorithm = this.getAlgorithm(this.selectedAlgorithms[0], grid1);
            alg1Ready = true;
            if( alg2Ready ) {
              document.getElementById('chooser-grid').classList.add('closed');
              document.querySelector('.controls').classList.add('closed');
              document.querySelector('.controls-parent').classList.add('closed');
              setTimeout(() => {
                this.search();
              }, 1500);
            }
          });
          let grid2 = this.grid.clone(document.getElementById('secondAlgorithm'), 20, () => {
            this.secondAlgorithm = this.getAlgorithm(this.selectedAlgorithms[1], grid2);
            alg2Ready = true;
            if( alg1Ready ) {
              document.getElementById('chooser-grid').classList.add('closed');
              document.querySelector('.controls').classList.add('closed');
              document.querySelector('.controls-parent').classList.add('closed');
              setTimeout(() => {
                this.search();
              }, 1500);
            }
          });

        } else {
          this.firstAlgorithm = this.getAlgorithm(this.selectedAlgorithms[0], this.grid);
          this.search();
        }
      } else {
        this.search();
      }
    });

    document.querySelector('.restart-button').addEventListener('click', e => {
      this.grid.reset();
    });

    document.querySelector('.erase-button').addEventListener('click', e => {
      this.grid.hardReset();
    });

    document.querySelector('.pause-button').addEventListener('click', e => {
      this.paused = true;
    });
  }

  step(algorithm) {
    let square = algorithm.nextSquare();
    if( square ) {
      if( square.squareType !== 'start' && square.squareType !== 'end' ) {
        algorithm.grid.setAsChecking(square);
      }

      if( square.squareType === 'end' ) {
        algorithm.drawPath(square);
      } else {
        let newStore = algorithm.processSquare( square );

        newStore.forEach( square => {
          if( square.squareType != 'end' && square.squareType != 'start' ) {
            algorithm.grid.setAsJustChecked(square);
          }
        });
      }
    }

    return square || {};
  }

  search() {
    if( !this.paused ) {
      let { firstAlgorithm, secondAlgorithm } = this;

      let firstSquare, secondSquare;

      if( !this.firstDone ) {
        firstSquare = this.step(firstAlgorithm);
        if( firstSquare.squareType === 'end' ) {
          this.firstDone = true;
        }
      }

      if( !this.secondDone && secondAlgorithm ) {
        secondSquare = this.step(secondAlgorithm);
        if( secondSquare.squareType === 'end' ) {
          this.secondDone = true;
        }
      }

      setTimeout( () => {
        if( !this.firstDone ) {
          if( firstSquare.squareType != 'end' && firstSquare.squareType != 'start' ) {
            firstAlgorithm.grid.setAsChecked( firstSquare );
          }
        }

        if( !this.secondDone && secondAlgorithm ) {
          if( secondSquare.squareType != 'end' && secondSquare.squareType != 'start' ) {
            secondAlgorithm.grid.setAsChecked( secondSquare );
          }
        }

        if( !this.firstDone || (!this.secondDone && secondAlgorithm) || (!secondAlgorithm) ) {
          this.search();
        } else {
          this.searching = false;
        }
      }, 10);
    }
  }

  getAlgorithm(key, grid) {
    switch( key ) {
      case 'bfs':
        return new BFS(grid);
      case 'dfs':
        return new DFS(grid);
      case 'best':
        return new BestFS(grid);
      case 'astart':
        return new AStar(grid);
    }
  }

  setAlgorithmOptions() {
    const algorithmListEl = document.querySelector('.algorithm-selection ul');

    Object.keys(this.algorithms).forEach( key => {
      algorithmListEl.appendChild(this.createAlgorithmSelector(key));
    });
  }

  createAlgorithmSelector(key) {
    let li = document.createElement('li');
    let label = document.createElement('label');
    label.setAttribute('class', 'm-sm');
    let checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('value', key);
    label.appendChild(checkbox);
    label.innerHTML = label.innerHTML + ` ${this.algorithms[key]}`;
    li.appendChild(label);
    li.addEventListener('click', this.handleAlgorithmSelection.bind(this));
    return li;
  }

  handleAlgorithmSelection(e) {
    if(e.target.tagName === 'INPUT') {
      let {checked, value} = e.target;
      if( e.target.checked ) {
        this.addSelectedAlgorithm(value);
        this.uncheckUnSelected();
      } else {
        this.removeSelectedAlgorithm(value);
      }
    }
  }

  uncheckUnSelected() {
    const algorithmCheckboxes = document.querySelectorAll('.algorithm-selection ul li input');

    algorithmCheckboxes.forEach( checkbox => {
      if( !this.selectedAlgorithms.includes(checkbox.value) ) {
        checkbox.checked = false;
      }
    });
  }

  addSelectedAlgorithm(key) {
    if( this.selectedAlgorithms.length >= 2 ) {
      this.selectedAlgorithms = this.selectedAlgorithms.slice(0,1);
    }

    this.selectedAlgorithms.push(key);
  }

  removeSelectedAlgorithm(key) {
    let { selectedAlgorithms } = this;
    let newAlgorithms = [];

    selectedAlgorithms.forEach(algorithm => {
      if( algorithm !== key ) {
        newAlgorithms.push(algorithm);
      }
    });

    this.selectedAlgorithms = newAlgorithms;
  }
}

export default Solver;
