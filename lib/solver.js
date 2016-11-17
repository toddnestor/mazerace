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

    this.selectedAlgorithms = [];

    this.setAlgorithmOptions();
    this.bindEvents();
  }

  bindEvents() {
    document.querySelector('.play-button').addEventListener('click', e => {
      this.paused = false;
      this.grid.reset();
      let firstAlgorithm = this.getAlgorithm(this.selectedAlgorithms[0], this.grid);
      this.search(firstAlgorithm);
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

  search(firstAlgorithm) {
    let square = firstAlgorithm.nextSquare();
    if( square ) {
      if( square.squareType !== 'start' && square.squareType !== 'end' ) {
        this.grid.setAsChecking(square);
      }

      if( square.squareType === 'end' ) {
        firstAlgorithm.drawPath(square);
      } else {
        let newStore = firstAlgorithm.processSquare( square );

        newStore.forEach( square => {
          if( square.squareType != 'end' && square.squareType != 'start' ) {
            this.grid.setAsJustChecked(square);
          }
        });

        setTimeout( () => {
          if( square.squareType != 'end' && square.squareType != 'start' ) {
            this.grid.setAsChecked( square );
          }

          this.search(firstAlgorithm);
        }, 10);
      }
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
