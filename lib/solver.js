// A lot of refactoring needs done here to DRY up this code,
// that's what I get for doing it at 3 am...
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
      astar: 'A*'
    }

    this.allowDiagonal = true;
    this.stepDelay = 10;

    this.selectedAlgorithms = ['bfs', 'best'];

    this.setAlgorithmOptions();
    this.bindEvents();
  }

  bindEvents() {
    document.querySelector('.demo-button').addEventListener('click', e => {
      this.grid.demo();
      this.selectedAlgorithms = ['bfs', 'best'];
      this.uncheckUnSelected();

      document.getElementById('did-it-wrong').classList.add('hidden');
      this.paused = false;
      document.querySelector('.play-button').classList.add('hidden');
      document.querySelector('.pause-button').classList.remove('hidden');

      if( !this.searching ) {
        this.searching = true;
        this.grid.reset();
        let alg1Ready = false;
        let alg2Ready = false;

        if( this.selectedAlgorithms.length > 1 ) {
          this.firstDone = false;
          this.secondDone = false;
          document.querySelector('.algorithm1').innerHTML = this.algorithms[this.selectedAlgorithms[0]];
          document.querySelector('.algorithm2').innerHTML = this.algorithms[this.selectedAlgorithms[1]];
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

    document.querySelector('.play-button').addEventListener('click', e => {
      if( this.selectedAlgorithms.length ) {
        document.getElementById('did-it-wrong').classList.add('hidden');
        this.paused = false;
        document.querySelector('.play-button').classList.add('hidden');
        document.querySelector('.pause-button').classList.remove('hidden');

        if( !this.searching ) {
          this.searching = true;
          this.grid.reset();
          let alg1Ready = false;
          let alg2Ready = false;

          if( this.selectedAlgorithms.length > 1 ) {
            this.firstDone = false;
            this.secondDone = false;
            document.querySelector('.algorithm1').innerHTML = this.algorithms[this.selectedAlgorithms[0]];
            document.querySelector('.algorithm2').innerHTML = this.algorithms[this.selectedAlgorithms[1]];
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
      } else {
        document.getElementById('did-it-wrong').classList.remove('hidden');
      }
    });

    document.querySelector('.restart-button').addEventListener('click', e => {
      this.searching = false;
      this.secondDone = false;
      this.firstDone = false;
      this.firstAlgorithm = null;
      this.secondAlgorithm = null;
      document.querySelector('.pause-button').classList.add('hidden');
      document.querySelector('.play-button').classList.remove('hidden');
      this.grid.reset();
    });

    document.querySelector('.erase-button').addEventListener('click', e => {
      this.searching = false;
      this.secondDone = false;
      this.firstDone = false;
      this.firstAlgorithm = null;
      this.secondAlgorithm = null;
      document.querySelector('.pause-button').classList.add('hidden');
      document.querySelector('.play-button').classList.remove('hidden');
      this.grid.hardReset();
    });

    document.querySelector('.pause-button').addEventListener('click', e => {
      document.querySelector('.pause-button').classList.add('hidden');
      document.querySelector('.play-button').classList.remove('hidden');
      this.paused = true;
    });

    document.getElementById('allow-diagonal').addEventListener('click', e => {
      if( e.target.tagName === 'INPUT' ) {
        let {checked, value} = e.target;
        if( e.target.checked ) {
          this.allowDiagonal = true;
        } else {
          this.allowDiagonal = false;
        }
      }
    });

    document.getElementById('delay').addEventListener('change', e => {
      this.stepDelay = e.target.value;
    });
  }

  step(algorithm) {
    let square;
    if( this.searching ) {
      square = algorithm.nextSquare();
      if( square ) {
        if( square.squareType !== 'start' && square.squareType !== 'end' ) {
          algorithm.grid.setAsChecking(square);
        }

        if( square.squareType === 'end' ) {
          algorithm.drawPath(square);
        } else {
          let newStore = algorithm.processSquare(square, this.allowDiagonal);
          algorithm.displayStats();

          newStore.forEach( square => {
            if( square.squareType != 'end' && square.squareType != 'start' ) {
              algorithm.grid.setAsJustChecked(square);
            }
          });
        }
      }
    }

    return square || false;
  }

  search() {
    if( !this.paused && this.searching ) {
      let { firstAlgorithm, secondAlgorithm } = this;

      let firstSquare, secondSquare;

      if( !this.firstDone ) {
        firstSquare = this.step(firstAlgorithm);
        if( !firstSquare ) {
          this.firstDone = true;
          firstAlgorithm.grid.declareUnsolvable();
        } else {
          if( firstSquare.squareType === 'end' ) {
            this.firstDone = true;
          }
        }
      }

      if( !this.secondDone && secondAlgorithm ) {
        secondSquare = this.step(secondAlgorithm);

        if( !secondSquare ) {
          this.secondDone = true;
          secondAlgorithm.grid.declareUnsolvable();
        } else {
          if( secondSquare.squareType === 'end' ) {
            this.secondDone = true;
          }
        }
      }

      if( this.firstDone && !this.secondDone && !firstAlgorithm.grid.unsolved ) {
        if( secondAlgorithm ) {
          firstAlgorithm.grid.declareWinner();
        }
      } else if( this.secondDone && !this.firstDone && !secondAlgorithm.grid.unsolved ) {
        secondAlgorithm.grid.declareWinner();
      } else if( this.firstDone && this.secondDone && !firstAlgorithm.grid.unsolved && !secondAlgorithm.grid.unsolved && !firstAlgorithm.grid.won && !secondAlgorithm.grid.won ) {
        firstAlgorithm.grid.declareTie();
        secondAlgorithm.grid.declareTie();
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

        if( !this.firstDone || (!this.secondDone && secondAlgorithm) ) {
          this.search();
        } else {
          this.searching = false;
          this.secondDone = false;
          this.firstDone = false;
          this.firstAlgorithm = null;
          this.secondAlgorithm = null;
          this.grid.won = false;
          this.grid.unsolved = false;
          document.querySelector('.pause-button').classList.add('hidden');
          document.querySelector('.play-button').classList.remove('hidden');
        }
      }, this.stepDelay);
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
      case 'astar':
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
    if( key === 'bfs' || key === 'best' ) {
      checkbox.setAttribute('checked', 'true');
    }
    checkbox.setAttribute('value', key);
    label.appendChild(checkbox);
    label.innerHTML = label.innerHTML + ` ${this.algorithms[key]}`;
    let info = document.createElement('span');
    info.setAttribute('class', 'fa fa-info pointer p-l-sm p-r');
    info.setAttribute('modal', `#${key}`);
    label.appendChild(info);
    li.appendChild(label);
    li.addEventListener('click', this.handleAlgorithmSelection.bind(this));
    return li;
  }

  handleAlgorithmSelection(e) {
    if(e.target.tagName === 'INPUT') {
      let {checked, value} = e.target;
      if( e.target.checked ) {
        document.getElementById('did-it-wrong').classList.add('hidden');
        this.addSelectedAlgorithm(value);
        this.uncheckUnSelected();
      } else {
        this.removeSelectedAlgorithm(value);
        if( !this.selectedAlgorithms.length ) {
          document.getElementById('did-it-wrong').classList.remove('hidden');
        }
      }
    }
  }

  uncheckUnSelected() {
    const algorithmCheckboxes = document.querySelectorAll('.algorithm-selection ul li input');

    algorithmCheckboxes.forEach( checkbox => {
      if( !this.selectedAlgorithms.includes(checkbox.value) ) {
        checkbox.checked = false;
      } else {
        checkbox.checked = true;
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
