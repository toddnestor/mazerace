class Grid {
  constructor($el) {
    this.el = $el;
    this.grid = Raphael($el);
    this.cols = 30;
    this.rows = 30;
    this.squares = [];
    this.currentAction = null;
    this.start = null;
    this.end = null;
    window.grid = this;
    this.cellSize = 30;
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
        fill: '#d35400',
        'stroke-opacity': 0.2,
      },
      checked: {
        fill: '#f1c40f',
        'stroke-opacity': 0.2,
      },
      path: {
        fill: '#0f0',
        'stroke-opacity': 0.2
      }
    };

    this.drawGrid(() => this.setDefaults());
    this.bindEvents();
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
    square.attr({
      transform: 's1.2'
    }).animate({
      fill: this.cellStyles.path.fill,
      transform: 's1.0'
    }, 100);
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

  getNeighbors(square) {
    let neighbors = [];

    let deltas = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1]
    ];

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

  drawPath(square) {
    if( square.squareType != 'start' && square.squareType != 'end' ) {
      this.setAsPath(square);
    }

    if( square.parent ) {
      setTimeout(() => {
        this.drawPath(square.parent);
      }, 100);
    }
  }
}

export default Grid;
