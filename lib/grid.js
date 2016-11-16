class Grid {
  constructor($el) {
    this.el = $el;
    this.grid = Raphael($el);
    this.cols = 30;
    this.rows = 30;
    this.rects = [];
    this.clicked = false;
    window.rects = this.rects;
    this.cellSize = 30;
    this.cellStyles = {
      normal: {
        fill: 'white',
        'stroke-opacity': 0.2
      },
      blocked: {
          fill: 'grey',
          'stroke-opacity': 0.2,
      },
      start: {
          fill: '#0d0',
          'stroke-opacity': 0.2,
      },
      end: {
          fill: '#e40',
          'stroke-opacity': 0.2,
      },
      opened: {
          fill: '#98fb98',
          'stroke-opacity': 0.2,
      },
      closed: {
          fill: '#afeeee',
          'stroke-opacity': 0.2,
      },
      failed: {
          fill: '#ff8888',
          'stroke-opacity': 0.2,
      },
      tested: {
          fill: '#e5e5e5',
          'stroke-opacity': 0.2,
      }
    }

    this.drawGrid();
    this.bindClick();
  }

  handleSquare(e) {
    const x = e.srcElement.getAttribute('x');
    const y = e.srcElement.getAttribute('y');

    if( x && y ) {
      let col = x / this.cellSize;
      let row = y / this.cellSize;

      let square = this.rects[row][col];

      if( square ) {
        square.attr({
          fill: '#0f0',
          'stroke-opacity': 0.2,
        });
      }
    }
  }

  hoverEvent(e) {
    if( this.clicked ) {
      this.handleSquare(e);
    }
  }

  bindClick() {
    this.el.addEventListener('mouseover', this.hoverEvent.bind(this));
    this.el.addEventListener('click', this.handleSquare.bind(this));
    this.el.addEventListener('mousedown', e => this.clicked = true);
    this.el.addEventListener('mouseup', e => this.clicked = false);
  }

  drawGrid(callback) {
    let { rects, grid, cellSize, cols, rows, cellStyles } = this;
    grid.setSize(cols * cellSize, rows * cellSize);

    const createRowTask = function(rowId) {
      return function(done) {
        rects[rowId] = [];
        for (let j = 0; j < cols; ++j) {
          let x = j * cellSize;
          let y = rowId * cellSize;

          let rect = grid.rect(x, y, cellSize, cellSize);
          rect.attr(cellStyles.normal);
          rects[rowId].push(rect);
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
}

export default Grid;
