class Grid {
  constructor($el, cellSize = 25, bindEvents = true, cb = () => {}) {
    this.el = $el;
    this.grid = Raphael($el);
    this.cols = 30;
    this.rows = 30;
    this.path = [];
    this.squares = [];
    this.currentAction = null;
    this.start = null;
    this.end = null;
    window.grid = this;
    this.cellSize = cellSize;
    this.cellStyles = {
      normal: {
        fill: 'white',
        'stroke-opacity': 0.2
      },
      wall: {
        fill: '#95a5a6',
        'stroke-opacity': 0.2,
      },
      start: {
        fill: '#2ecc71',
        'stroke-opacity': 0.2,
      },
      end: {
        fill: '#e74c3c',
        'stroke-opacity': 0.2,
      },
      checking: {
        fill: '#2980b9',
        'stroke-opacity': 0.2,
      },
      justChecked: {
        fill: 'rgb(152, 251, 152)',
        'stroke-opacity': 0.2,
      },
      checked: {
        fill: 'rgb(175, 238, 238)',
        'stroke-opacity': 0.2,
      },
      path: {
        fill: '#ff0',
        'stroke-opacity': 0.2
      }
    };

    this.drawGrid(() => {
      this.setDefaults();
      cb();
    });

    if( bindEvents ) {
      this.bindEvents();
    }
  }

  setAsSingleton(square, type) {
    if( square.squareType == 'normal' ) {
      if( this[type] ) {
        let newX = square.attrs.x;
        let newY = square.attrs.y;
        square.attr({x: this[type].attrs.x, y: this[type].attrs.y});
        this[type].attr({x: newX, y: newY}).toFront();
        this.squares[this[type].row][this[type].col] = square;
        this.squares[square.row][square.col] = this[type];
        let tempRow = square.row;
        let tempCol = square.col;
        square.row = this[type].row;
        square.col = this[type].col;
        this[type].row = tempRow;
        this[type].col = tempCol;
      } else {
        square.squareType = type;
        this[type] = square;
        square.animate(this.cellStyles[type], 100);
      }
    }
  }

  demo() {
    this.hardReset();
    this.setAsStart(this.squares[1][1]);
    this.setAsEnd(this.squares[28][28]);

    let walls = {
      0: [3, 7, 9, 18, 27],
      1: [3, 5, 7, 9, 11, 12, 13, 15, 18, 27],
      2: [3, 5, 7, 9, 11, 13, 15, 18, 27, 29],
      3: [1, 2, 3, 5, 7, 9, 11, 13, 15, 18, 19, 20, 21, 22, 23, 24, 25, 27],
      4: [5, 7, 9, 11, 13, 15, 18, 25, 27, 29],
      5: [0, 1, 2, 3, 4, 5, 7, 9, 11, 13, 15, 18, 21, 22, 23, 24, 25, 27],
      6: [7, 9, 11, 13, 15, 16, 17, 18],
      7: [13],
      8: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 25, 26, 27, 28, 29],
      9: [3, 7, 14, 16, 21, 23],
      10: [14, 16, 21, 23],
      11: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 21, 23, 24, 25, 26, 27],
      12: [11, 17, 21, 23],
      13: [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 21, 23],
      14: [17, 21, 23, 26, 27, 28, 29],
      15: [17, 20, 21, 23],
      16: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20, 23, 26, 27, 28, 29],
      17: [17, 20, 23],
      18: [17, 20, 23, 24, 25, 26, 27, 28],
      19: [0, 1, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 15, 16, 17, 23],
      20: [9, 11, 17, 20, 23, 27],
      21: [9, 11, 17, 20, 23, 27],
      22: [2, 3, 4, 5, 6, 7, 8, 9, 11, 13, 14, 15, 16, 17, 20, 22, 23, 27],
      23: [0, 2, 11, 17, 18, 20, 22, 27],
      24: [2, 11, 17, 18, 20, 22, 23, 24, 27],
      25: [0, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 20, 24, 27],
      26: [2, 7, 9, 11, 17, 20, 24, 27],
      27: [2, 4, 7, 9, 10, 11, 13, 17, 19, 20, 21, 22, 23, 24, 27, 28, 29],
      28: [0, 2, 4, 7, 13, 17, 18, 19, 24, 25, 26, 27, 29],
      29: [4, 13]
    };

    Object.keys(walls).forEach( row => {
      walls[row].forEach( col => {
        this.setAsWall( this.squares[row][col]);
      });
    });
  }

  setAsStart(square) {
    this.setAsSingleton(square, 'start');
  }

  setAsEnd(square) {
    this.setAsSingleton(square, 'end');
  }

  setAsWall(square) {
    if( square.squareType == 'normal' ) {
      square.squareType = 'wall';
      square.attr({
        transform: 's1.2'
      }).animate({
        fill: this.cellStyles.wall.fill,
        transform: 's1.0'
      }, 100);
    }
  }

  setAsChecked(square) {
    square.attr({
      transform: 's1.2'
    }).animate({
      fill: this.cellStyles.checked.fill,
      transform: 's1.0'
    }, 100);
  }

  setAsPath(square) {
    let centerX = square.attrs.x + this.cellSize/2;
    let centerY = square.attrs.y + this.cellSize/2;
    let parentX = square.parent.attrs.x + this.cellSize/2;
    let parentY = square.parent.attrs.y + this.cellSize/2;
    let path = this.grid.path(`M${centerX} ${centerY}L${parentX} ${parentY}`);
    path.attr('stroke', this.cellStyles.path.fill);
    path.attr('stroke-width', 4);
    this.path.push(path);
  }

  setAsChecking(square) {
    square.attr({
      transform: 's1.2'
    }).animate({
      fill: this.cellStyles.checking.fill,
      transform: 's1.0'
    }, 100);
  }

  setAsJustChecked(square) {
    square.attr({
      transform: 's1.2'
    }).animate({
      fill: this.cellStyles.justChecked.fill,
      transform: 's1.0'
    }, 100);
  }

  setAsNormal(square) {
    if( square.squareType == 'wall' ) {
      square.squareType = 'normal';
      square.attr({
        transform: 's1.2'
      }).animate({
        fill: this.cellStyles.normal.fill,
        transform: 's1.0'
      }, 100);
    }
  }

  setDefaults() {
    this.setAsStart(this.squares[10][10]);
    this.setAsEnd(this.squares[20][20]);
  }

  handleSquare(e) {
    const x = e.srcElement.getAttribute('x');
    const y = e.srcElement.getAttribute('y');

    if( x && y ) {
      let col = x / this.cellSize;
      let row = y / this.cellSize;

      let square = this.squares[row][col];

      if( square ) {
        switch( this.currentAction ) {
          case 'draggingStart':
            this.setAsStart(square);
            break;
          case 'draggingEnd':
            this.setAsEnd(square);
            break;
          case 'drawingWall':
            this.setAsWall(square);
            break;
          case 'erasingWall':
            this.setAsNormal(square);
            break;
          default:
            this.setAction(square);
        }
      }
    }
  }

  setAction(square) {
    switch( square.squareType ) {
      case 'start':
        this.currentAction = 'draggingStart';
        break;
      case 'end':
        this.currentAction = 'draggingEnd';
        break;
      case 'wall':
        this.currentAction = 'erasingWall';
        this.setAsNormal(square);
        break;
      default:
        this.currentAction = 'drawingWall';
        this.setAsWall(square);
    }
  }

  hoverEvent(e) {
    if( this.currentAction ) {
      this.handleSquare(e);
    }
  }

  bindEvents() {
    this.el.addEventListener('mouseover', this.hoverEvent.bind(this));
    this.el.addEventListener('mousedown', this.handleSquare.bind(this));
    this.el.addEventListener('mouseup', e => {
      this.currentAction = null;
    });
  }

  drawGrid(callback) {
    let { squares, grid, cellSize, cols, rows, cellStyles } = this;
    grid.setSize(cols * cellSize, rows * cellSize);

    const createRowTask = function(rowId) {
      return function(done) {
        squares[rowId] = [];
        for (let j = 0; j < cols; ++j) {
          let x = j * cellSize;
          let y = rowId * cellSize;

          let square = grid.rect(x, y, cellSize, cellSize);
          square.attr(cellStyles.normal);
          square.squareType = 'normal';
          square.row = rowId;
          square.col = j;
          squares[rowId].push(square);
        }

        done(null);
      };
    };

    const sleep = function(done) {
      setTimeout(function() {
        done(null);
      }, 0);
    };

    let tasks = [];
    for (let i = 0; i < rows; ++i) {
      tasks.push(createRowTask(i));
      tasks.push(sleep);
    }

    async.series(tasks, function() {
      if (callback) {
        callback();
      }
    });
  }

  getNeighbors(square, allowDiagonal = false) {
    let neighbors = [];
    let deltas;

    if( allowDiagonal) {
      deltas = [
        [1, 0],
        [1, 1],
        [0, 1],
        [-1, 1],
        [-1, 0],
        [-1, -1],
        [0, -1],
        [1, -1]
      ];
    } else {
      deltas = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1]
      ];
    }

    deltas.forEach( delta => {
      let pos = [];
      pos.push( square.row + delta[0] );
      pos.push( square.col + delta[1] );

      if( this.squares[pos[0]]) {
        let neighbor = this.squares[pos[0]][pos[1]];

        if( neighbor && neighbor.squareType !== 'wall' ) {
          neighbors.push(neighbor);
        }
      }
    });

    return neighbors;
  }

  reset() {
    let stats = this.el.querySelector('.stats');

    if( stats ) {
      this.el.removeChild(stats);
    }
    this.squares.forEach( row => {
      row.forEach( square => {
        if( square.squareType === 'normal' ) {
          square.attr(this.cellStyles.normal);
        }
      });
    });

    document.getElementById('firstAlgorithm').innerHTML = '';
    document.getElementById('secondAlgorithm').innerHTML = '';
    document.getElementById('chooser-grid').classList.remove('closed');
    document.querySelector('.controls').classList.remove('closed');
    document.querySelector('.controls-parent').classList.remove('closed');

    this.path.forEach( segment => segment.remove() );
    this.path = [];

    document.querySelectorAll('.winner').forEach( el => el.parentNode.removeChild(el) );
    document.querySelectorAll('.unsolvable').forEach( el => el.parentNode.removeChild(el) );
  }

  hardReset() {
    let stats = this.el.querySelector('.stats');

    if( stats ) {
      this.el.removeChild(stats);
    }
    this.squares.forEach( row => {
      row.forEach( square => {
        if( square.squareType !== 'end' && square.squareType !== 'start' ) {
          square.attr(this.cellStyles.normal);
          square.squareType = 'normal';
        }
      });
    });

    this.path.forEach( segment => segment.remove() );
    this.path = [];

    document.querySelectorAll('.winner').forEach( el => el.parentNode.removeChild(el) );
    document.querySelectorAll('.unsolvable').forEach( el => el.parentNode.removeChild(el) );
  }

  drawPath(square, cb = () => {}) {
    while( square.parent ) {
      this.setAsPath(square);
      square.parent.child = square;
      square = square.parent;
    }

    cb();
  }

  declareWinner() {
    if( !this.won ) {
      for( let i = 0; i < 30; i++ ) {
        let winner = document.createElement('div');
        winner.classList.add('winner');
        winner.classList.add('emerald-font');
        winner.classList.add('bold');
        winner.classList.add('transparent');
        winner.innerHTML = 'WINNER!';
        this.el.appendChild(winner);
        winner.classList.remove('transparent');
      }
      this.won = true;
    }
  }

  displayStats(steps, maxStore) {
    let oldStats = this.el.querySelectorAll('.stats');

    if( oldStats ) {
      oldStats.forEach(stats => {
        this.el.removeChild(stats);
      });
    }

    for( let i = 0; i < 10; i++ ) {
      let stats = document.createElement('div');
      stats.classList.add('stats');
      stats.classList.add('bold');
      stats.classList.add('white-font');
      stats.innerHTML = `Steps: ${steps}<br />Maximum Store Length: ${maxStore}`;

      if( this.path.length ) {
        stats.innerHTML = `Path Length: ${this.path.length}<br />${stats.innerHTML}`;
      }

      this.el.appendChild(stats);
    }
  }

  declareUnsolvable() {
    if( !this.unsolved ) {
      for( let i = 0; i < 30; i++ ) {
        let winner = document.createElement('div');
        winner.classList.add('unsolvable');
        winner.classList.add('red-font');
        winner.classList.add('bold');
        winner.classList.add('transparent');
        winner.innerHTML = 'UNSOLVABLE!';
        this.el.appendChild(winner);
        winner.classList.remove('transparent');
      }
      this.unsolved = true;
    }
  }

  clone($el, cellSize = 15, cb = () => {}) {
    let grid = new Grid($el, cellSize, false, () => {

      grid.squares.forEach( (rowSquares, row) => {
        rowSquares.forEach( (square, col) => {
          let originalSquare = this.squares[row][col];

          switch( originalSquare.squareType ) {
            case 'start':
            grid.setAsStart(square);
            break;
            case 'end':
            grid.setAsEnd(square);
            break;
            case 'wall':
            grid.setAsWall(square);
            break;
            case 'normal':
            grid.setAsNormal(square);
            break;
          }
        });
      });
      cb();
    });

    return grid;
  }
}

export default Grid;
