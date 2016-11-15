class Grid {
  constructor($el) {
    this.grid = Raphael($el);
    this.cols = 30;
    this.rows = 30;
    this.rects = [];
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
