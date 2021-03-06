/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _grid = __webpack_require__(1);
	
	var _grid2 = _interopRequireDefault(_grid);
	
	var _solver = __webpack_require__(2);
	
	var _solver2 = _interopRequireDefault(_solver);
	
	var _modal = __webpack_require__(8);
	
	var _modal2 = _interopRequireDefault(_modal);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	__webpack_require__(9);
	
	
	document.addEventListener('DOMContentLoaded', function () {
	  var gridEl = document.getElementById('chooser-grid');
	  var grid = new _grid2.default(gridEl);
	  var solver = new _solver2.default(grid);
	  var modal = new _modal2.default();
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Grid = function () {
	  function Grid($el) {
	    var cellSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 25;
	
	    var _this = this;
	
	    var bindEvents = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
	    var cb = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};
	
	    _classCallCheck(this, Grid);
	
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
	        'stroke-opacity': 0.2
	      },
	      start: {
	        fill: '#2ecc71',
	        'stroke-opacity': 0.2
	      },
	      end: {
	        fill: '#e74c3c',
	        'stroke-opacity': 0.2
	      },
	      checking: {
	        fill: '#2980b9',
	        'stroke-opacity': 0.2
	      },
	      justChecked: {
	        fill: 'rgb(152, 251, 152)',
	        'stroke-opacity': 0.2
	      },
	      checked: {
	        fill: 'rgb(175, 238, 238)',
	        'stroke-opacity': 0.2
	      },
	      path: {
	        fill: '#ff0',
	        'stroke-opacity': 0.2
	      }
	    };
	
	    this.drawGrid(function () {
	      _this.setDefaults();
	      cb();
	    });
	
	    if (bindEvents) {
	      this.bindEvents();
	    }
	  }
	
	  _createClass(Grid, [{
	    key: 'setAsSingleton',
	    value: function setAsSingleton(square, type) {
	      if (square.squareType == 'normal') {
	        if (this[type]) {
	          var newX = square.attrs.x;
	          var newY = square.attrs.y;
	          square.attr({ x: this[type].attrs.x, y: this[type].attrs.y });
	          this[type].attr({ x: newX, y: newY }).toFront();
	          this.squares[this[type].row][this[type].col] = square;
	          this.squares[square.row][square.col] = this[type];
	          var tempRow = square.row;
	          var tempCol = square.col;
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
	  }, {
	    key: 'demo',
	    value: function demo() {
	      var _this2 = this;
	
	      this.hardReset();
	      this.setAsStart(this.squares[1][1]);
	      this.setAsEnd(this.squares[28][28]);
	
	      var walls = {
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
	
	      Object.keys(walls).forEach(function (row) {
	        walls[row].forEach(function (col) {
	          _this2.setAsWall(_this2.squares[row][col]);
	        });
	      });
	    }
	  }, {
	    key: 'setAsStart',
	    value: function setAsStart(square) {
	      this.setAsSingleton(square, 'start');
	    }
	  }, {
	    key: 'setAsEnd',
	    value: function setAsEnd(square) {
	      this.setAsSingleton(square, 'end');
	    }
	  }, {
	    key: 'setAsWall',
	    value: function setAsWall(square) {
	      if (square.squareType == 'normal') {
	        square.squareType = 'wall';
	        square.attr({
	          transform: 's1.2'
	        }).animate({
	          fill: this.cellStyles.wall.fill,
	          transform: 's1.0'
	        }, 100);
	      }
	    }
	  }, {
	    key: 'setAsChecked',
	    value: function setAsChecked(square) {
	      square.attr({
	        transform: 's1.2'
	      }).animate({
	        fill: this.cellStyles.checked.fill,
	        transform: 's1.0'
	      }, 100);
	    }
	  }, {
	    key: 'setAsPath',
	    value: function setAsPath(square) {
	      var centerX = square.attrs.x + this.cellSize / 2;
	      var centerY = square.attrs.y + this.cellSize / 2;
	      var parentX = square.parent.attrs.x + this.cellSize / 2;
	      var parentY = square.parent.attrs.y + this.cellSize / 2;
	      var path = this.grid.path('M' + centerX + ' ' + centerY + 'L' + parentX + ' ' + parentY);
	      path.attr('stroke', this.cellStyles.path.fill);
	      path.attr('stroke-width', 4);
	      this.path.push(path);
	    }
	  }, {
	    key: 'setAsChecking',
	    value: function setAsChecking(square) {
	      square.attr({
	        transform: 's1.2'
	      }).animate({
	        fill: this.cellStyles.checking.fill,
	        transform: 's1.0'
	      }, 100);
	    }
	  }, {
	    key: 'setAsJustChecked',
	    value: function setAsJustChecked(square) {
	      square.attr({
	        transform: 's1.2'
	      }).animate({
	        fill: this.cellStyles.justChecked.fill,
	        transform: 's1.0'
	      }, 100);
	    }
	  }, {
	    key: 'setAsNormal',
	    value: function setAsNormal(square) {
	      if (square.squareType == 'wall') {
	        square.squareType = 'normal';
	        square.attr({
	          transform: 's1.2'
	        }).animate({
	          fill: this.cellStyles.normal.fill,
	          transform: 's1.0'
	        }, 100);
	      }
	    }
	  }, {
	    key: 'setDefaults',
	    value: function setDefaults() {
	      this.setAsStart(this.squares[10][10]);
	      this.setAsEnd(this.squares[20][20]);
	    }
	  }, {
	    key: 'handleSquare',
	    value: function handleSquare(e) {
	      var x = e.srcElement.getAttribute('x');
	      var y = e.srcElement.getAttribute('y');
	
	      if (x && y) {
	        var col = x / this.cellSize;
	        var row = y / this.cellSize;
	
	        var square = this.squares[row][col];
	
	        if (square) {
	          switch (this.currentAction) {
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
	  }, {
	    key: 'setAction',
	    value: function setAction(square) {
	      switch (square.squareType) {
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
	  }, {
	    key: 'hoverEvent',
	    value: function hoverEvent(e) {
	      if (this.currentAction) {
	        this.handleSquare(e);
	      }
	    }
	  }, {
	    key: 'bindEvents',
	    value: function bindEvents() {
	      var _this3 = this;
	
	      this.el.addEventListener('mouseover', this.hoverEvent.bind(this));
	      this.el.addEventListener('mousedown', this.handleSquare.bind(this));
	      this.el.addEventListener('mouseup', function (e) {
	        _this3.currentAction = null;
	      });
	    }
	  }, {
	    key: 'drawGrid',
	    value: function drawGrid(callback) {
	      var squares = this.squares,
	          grid = this.grid,
	          cellSize = this.cellSize,
	          cols = this.cols,
	          rows = this.rows,
	          cellStyles = this.cellStyles;
	
	      grid.setSize(cols * cellSize, rows * cellSize);
	
	      var createRowTask = function createRowTask(rowId) {
	        return function (done) {
	          squares[rowId] = [];
	          for (var j = 0; j < cols; ++j) {
	            var x = j * cellSize;
	            var y = rowId * cellSize;
	
	            var square = grid.rect(x, y, cellSize, cellSize);
	            square.attr(cellStyles.normal);
	            square.squareType = 'normal';
	            square.row = rowId;
	            square.col = j;
	            squares[rowId].push(square);
	          }
	
	          done(null);
	        };
	      };
	
	      var sleep = function sleep(done) {
	        setTimeout(function () {
	          done(null);
	        }, 0);
	      };
	
	      var tasks = [];
	      for (var i = 0; i < rows; ++i) {
	        tasks.push(createRowTask(i));
	        tasks.push(sleep);
	      }
	
	      async.series(tasks, function () {
	        if (callback) {
	          callback();
	        }
	      });
	    }
	  }, {
	    key: 'getNeighbors',
	    value: function getNeighbors(square) {
	      var _this4 = this;
	
	      var allowDiagonal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	
	      var neighbors = [];
	      var deltas = void 0;
	
	      if (allowDiagonal) {
	        deltas = [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [-1, 1], [-1, -1], [1, -1]];
	      } else {
	        deltas = [[1, 0], [0, 1], [-1, 0], [0, -1]];
	      }
	
	      deltas.forEach(function (delta) {
	        var pos = [];
	        pos.push(square.row + delta[0]);
	        pos.push(square.col + delta[1]);
	
	        if (_this4.squares[pos[0]]) {
	          var neighbor = _this4.squares[pos[0]][pos[1]];
	
	          if (neighbor && neighbor.squareType !== 'wall') {
	            neighbors.push(neighbor);
	          }
	        }
	      });
	
	      return neighbors;
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {
	      var _this5 = this;
	
	      var stats = this.el.querySelector('.stats');
	
	      if (stats) {
	        this.el.removeChild(stats);
	      }
	      this.squares.forEach(function (row) {
	        row.forEach(function (square) {
	          if (square.squareType === 'normal') {
	            square.attr(_this5.cellStyles.normal);
	          }
	        });
	      });
	
	      document.getElementById('firstAlgorithm').innerHTML = '';
	      document.getElementById('secondAlgorithm').innerHTML = '';
	      document.getElementById('chooser-grid').classList.remove('closed');
	      document.querySelector('.controls').classList.remove('closed');
	      document.querySelector('.controls-parent').classList.remove('closed');
	      document.querySelector('.algorithm1').innerHTML = "";
	      document.querySelector('.algorithm2').innerHTML = "";
	
	      this.path.forEach(function (segment) {
	        return segment.remove();
	      });
	      this.path = [];
	
	      document.querySelectorAll('.winner').forEach(function (el) {
	        return el.parentNode.removeChild(el);
	      });
	      document.querySelectorAll('.unsolvable').forEach(function (el) {
	        return el.parentNode.removeChild(el);
	      });
	    }
	  }, {
	    key: 'hardReset',
	    value: function hardReset() {
	      var _this6 = this;
	
	      var stats = this.el.querySelector('.stats');
	
	      if (stats) {
	        this.el.removeChild(stats);
	      }
	      this.squares.forEach(function (row) {
	        row.forEach(function (square) {
	          if (square.squareType !== 'end' && square.squareType !== 'start') {
	            square.attr(_this6.cellStyles.normal);
	            square.squareType = 'normal';
	          }
	        });
	      });
	
	      this.path.forEach(function (segment) {
	        return segment.remove();
	      });
	      this.path = [];
	
	      document.querySelectorAll('.winner').forEach(function (el) {
	        return el.parentNode.removeChild(el);
	      });
	      document.querySelectorAll('.unsolvable').forEach(function (el) {
	        return el.parentNode.removeChild(el);
	      });
	      document.querySelector('.algorithm1').innerHTML = "";
	      document.querySelector('.algorithm2').innerHTML = "";
	    }
	  }, {
	    key: 'drawPath',
	    value: function drawPath(square) {
	      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
	
	      while (square.parent) {
	        this.setAsPath(square);
	        square.parent.child = square;
	        square = square.parent;
	      }
	
	      cb();
	    }
	  }, {
	    key: 'declareWinner',
	    value: function declareWinner() {
	      if (!this.won) {
	        for (var i = 0; i < 30; i++) {
	          var winner = document.createElement('div');
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
	  }, {
	    key: 'declareTie',
	    value: function declareTie() {
	      if (!this.won) {
	        for (var i = 0; i < 30; i++) {
	          var winner = document.createElement('div');
	          winner.classList.add('winner');
	          winner.classList.add('yellow-font');
	          winner.classList.add('bold');
	          winner.classList.add('transparent');
	          winner.innerHTML = 'TIE!';
	          this.el.appendChild(winner);
	          winner.classList.remove('transparent');
	        }
	        this.won = true;
	      }
	    }
	  }, {
	    key: 'displayStats',
	    value: function displayStats(steps, maxStore) {
	      var _this7 = this;
	
	      var oldStats = this.el.querySelectorAll('.stats');
	
	      if (oldStats) {
	        oldStats.forEach(function (stats) {
	          _this7.el.removeChild(stats);
	        });
	      }
	
	      for (var i = 0; i < 10; i++) {
	        var stats = document.createElement('div');
	        stats.classList.add('stats');
	        stats.classList.add('bold');
	        stats.classList.add('white-font');
	        stats.innerHTML = 'Steps: ' + steps + '<br />Maximum Store Length: ' + maxStore;
	
	        if (this.path.length) {
	          stats.innerHTML = 'Path Length: ' + this.path.length + '<br />' + stats.innerHTML;
	        }
	
	        this.el.appendChild(stats);
	      }
	    }
	  }, {
	    key: 'declareUnsolvable',
	    value: function declareUnsolvable() {
	      if (!this.unsolved) {
	        for (var i = 0; i < 30; i++) {
	          var winner = document.createElement('div');
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
	  }, {
	    key: 'clone',
	    value: function clone($el) {
	      var _this8 = this;
	
	      var cellSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 15;
	      var cb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
	
	      var grid = new Grid($el, cellSize, false, function () {
	
	        grid.squares.forEach(function (rowSquares, row) {
	          rowSquares.forEach(function (square, col) {
	            var originalSquare = _this8.squares[row][col];
	
	            switch (originalSquare.squareType) {
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
	  }]);
	
	  return Grid;
	}();
	
	exports.default = Grid;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // A lot of refactoring needs done here to DRY up this code,
	// that's what I get for doing it at 3 am...
	
	
	var _aStar = __webpack_require__(3);
	
	var _aStar2 = _interopRequireDefault(_aStar);
	
	var _bfs = __webpack_require__(6);
	
	var _bfs2 = _interopRequireDefault(_bfs);
	
	var _dfs = __webpack_require__(7);
	
	var _dfs2 = _interopRequireDefault(_dfs);
	
	var _bestfs = __webpack_require__(4);
	
	var _bestfs2 = _interopRequireDefault(_bestfs);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Solver = function () {
	  function Solver(grid) {
	    _classCallCheck(this, Solver);
	
	    this.grid = grid;
	    this.algorithms = {
	      bfs: 'Breadth First Search',
	      dfs: 'Depth First Search',
	      best: 'Best First Search',
	      astar: 'A*'
	    };
	
	    this.allowDiagonal = true;
	    this.stepDelay = 10;
	
	    this.selectedAlgorithms = ['bfs', 'best'];
	
	    this.setAlgorithmOptions();
	    this.bindEvents();
	  }
	
	  _createClass(Solver, [{
	    key: 'bindEvents',
	    value: function bindEvents() {
	      var _this = this;
	
	      document.querySelector('.demo-button').addEventListener('click', function (e) {
	        _this.grid.demo();
	        _this.selectedAlgorithms = ['bfs', 'best'];
	        _this.uncheckUnSelected();
	
	        document.getElementById('did-it-wrong').classList.add('hidden');
	        _this.paused = false;
	        document.querySelector('.play-button').classList.add('hidden');
	        document.querySelector('.pause-button').classList.remove('hidden');
	
	        if (!_this.searching) {
	          (function () {
	            _this.searching = true;
	            _this.grid.reset();
	            var alg1Ready = false;
	            var alg2Ready = false;
	
	            if (_this.selectedAlgorithms.length > 1) {
	              (function () {
	                _this.firstDone = false;
	                _this.secondDone = false;
	                document.querySelector('.algorithm1').innerHTML = _this.algorithms[_this.selectedAlgorithms[0]];
	                document.querySelector('.algorithm2').innerHTML = _this.algorithms[_this.selectedAlgorithms[1]];
	                var grid1 = _this.grid.clone(document.getElementById('firstAlgorithm'), 20, function () {
	                  _this.firstAlgorithm = _this.getAlgorithm(_this.selectedAlgorithms[0], grid1);
	                  alg1Ready = true;
	                  if (alg2Ready) {
	                    document.getElementById('chooser-grid').classList.add('closed');
	                    document.querySelector('.controls').classList.add('closed');
	                    document.querySelector('.controls-parent').classList.add('closed');
	                    setTimeout(function () {
	                      _this.search();
	                    }, 1500);
	                  }
	                });
	                var grid2 = _this.grid.clone(document.getElementById('secondAlgorithm'), 20, function () {
	                  _this.secondAlgorithm = _this.getAlgorithm(_this.selectedAlgorithms[1], grid2);
	                  alg2Ready = true;
	                  if (alg1Ready) {
	                    document.getElementById('chooser-grid').classList.add('closed');
	                    document.querySelector('.controls').classList.add('closed');
	                    document.querySelector('.controls-parent').classList.add('closed');
	                    setTimeout(function () {
	                      _this.search();
	                    }, 1500);
	                  }
	                });
	              })();
	            } else {
	              _this.firstAlgorithm = _this.getAlgorithm(_this.selectedAlgorithms[0], _this.grid);
	              _this.search();
	            }
	          })();
	        } else {
	          _this.search();
	        }
	      });
	
	      document.querySelector('.play-button').addEventListener('click', function (e) {
	        if (_this.selectedAlgorithms.length) {
	          document.getElementById('did-it-wrong').classList.add('hidden');
	          _this.paused = false;
	          document.querySelector('.play-button').classList.add('hidden');
	          document.querySelector('.pause-button').classList.remove('hidden');
	
	          if (!_this.searching) {
	            (function () {
	              _this.searching = true;
	              _this.grid.reset();
	              var alg1Ready = false;
	              var alg2Ready = false;
	
	              if (_this.selectedAlgorithms.length > 1) {
	                (function () {
	                  _this.firstDone = false;
	                  _this.secondDone = false;
	                  document.querySelector('.algorithm1').innerHTML = _this.algorithms[_this.selectedAlgorithms[0]];
	                  document.querySelector('.algorithm2').innerHTML = _this.algorithms[_this.selectedAlgorithms[1]];
	                  var grid1 = _this.grid.clone(document.getElementById('firstAlgorithm'), 20, function () {
	                    _this.firstAlgorithm = _this.getAlgorithm(_this.selectedAlgorithms[0], grid1);
	                    alg1Ready = true;
	                    if (alg2Ready) {
	                      document.getElementById('chooser-grid').classList.add('closed');
	                      document.querySelector('.controls').classList.add('closed');
	                      document.querySelector('.controls-parent').classList.add('closed');
	                      setTimeout(function () {
	                        _this.search();
	                      }, 1500);
	                    }
	                  });
	                  var grid2 = _this.grid.clone(document.getElementById('secondAlgorithm'), 20, function () {
	                    _this.secondAlgorithm = _this.getAlgorithm(_this.selectedAlgorithms[1], grid2);
	                    alg2Ready = true;
	                    if (alg1Ready) {
	                      document.getElementById('chooser-grid').classList.add('closed');
	                      document.querySelector('.controls').classList.add('closed');
	                      document.querySelector('.controls-parent').classList.add('closed');
	                      setTimeout(function () {
	                        _this.search();
	                      }, 1500);
	                    }
	                  });
	                })();
	              } else {
	                _this.firstAlgorithm = _this.getAlgorithm(_this.selectedAlgorithms[0], _this.grid);
	                _this.search();
	              }
	            })();
	          } else {
	            _this.search();
	          }
	        } else {
	          document.getElementById('did-it-wrong').classList.remove('hidden');
	        }
	      });
	
	      document.querySelector('.restart-button').addEventListener('click', function (e) {
	        _this.searching = false;
	        _this.secondDone = false;
	        _this.firstDone = false;
	        _this.firstAlgorithm = null;
	        _this.secondAlgorithm = null;
	        document.querySelector('.pause-button').classList.add('hidden');
	        document.querySelector('.play-button').classList.remove('hidden');
	        _this.grid.reset();
	      });
	
	      document.querySelector('.erase-button').addEventListener('click', function (e) {
	        _this.searching = false;
	        _this.secondDone = false;
	        _this.firstDone = false;
	        _this.firstAlgorithm = null;
	        _this.secondAlgorithm = null;
	        document.querySelector('.pause-button').classList.add('hidden');
	        document.querySelector('.play-button').classList.remove('hidden');
	        _this.grid.hardReset();
	      });
	
	      document.querySelector('.pause-button').addEventListener('click', function (e) {
	        document.querySelector('.pause-button').classList.add('hidden');
	        document.querySelector('.play-button').classList.remove('hidden');
	        _this.paused = true;
	      });
	
	      document.getElementById('allow-diagonal').addEventListener('click', function (e) {
	        if (e.target.tagName === 'INPUT') {
	          var _e$target = e.target,
	              checked = _e$target.checked,
	              value = _e$target.value;
	
	          if (e.target.checked) {
	            _this.allowDiagonal = true;
	          } else {
	            _this.allowDiagonal = false;
	          }
	        }
	      });
	
	      document.getElementById('delay').addEventListener('change', function (e) {
	        _this.stepDelay = e.target.value;
	      });
	    }
	  }, {
	    key: 'step',
	    value: function step(algorithm) {
	      var square = void 0;
	      if (this.searching) {
	        square = algorithm.nextSquare();
	        if (square) {
	          if (square.squareType !== 'start' && square.squareType !== 'end') {
	            algorithm.grid.setAsChecking(square);
	          }
	
	          if (square.squareType === 'end') {
	            algorithm.drawPath(square);
	          } else {
	            var newStore = algorithm.processSquare(square, this.allowDiagonal);
	            algorithm.displayStats();
	
	            newStore.forEach(function (square) {
	              if (square.squareType != 'end' && square.squareType != 'start') {
	                algorithm.grid.setAsJustChecked(square);
	              }
	            });
	          }
	        }
	      }
	
	      return square || false;
	    }
	  }, {
	    key: 'search',
	    value: function search() {
	      var _this2 = this;
	
	      if (!this.paused && this.searching) {
	        (function () {
	          var firstAlgorithm = _this2.firstAlgorithm,
	              secondAlgorithm = _this2.secondAlgorithm;
	
	
	          var firstSquare = void 0,
	              secondSquare = void 0;
	
	          if (!_this2.firstDone) {
	            firstSquare = _this2.step(firstAlgorithm);
	            if (!firstSquare) {
	              _this2.firstDone = true;
	              firstAlgorithm.grid.declareUnsolvable();
	            } else {
	              if (firstSquare.squareType === 'end') {
	                _this2.firstDone = true;
	              }
	            }
	          }
	
	          if (!_this2.secondDone && secondAlgorithm) {
	            secondSquare = _this2.step(secondAlgorithm);
	
	            if (!secondSquare) {
	              _this2.secondDone = true;
	              secondAlgorithm.grid.declareUnsolvable();
	            } else {
	              if (secondSquare.squareType === 'end') {
	                _this2.secondDone = true;
	              }
	            }
	          }
	
	          if (_this2.firstDone && !_this2.secondDone && !firstAlgorithm.grid.unsolved) {
	            if (secondAlgorithm) {
	              firstAlgorithm.grid.declareWinner();
	            }
	          } else if (_this2.secondDone && !_this2.firstDone && !secondAlgorithm.grid.unsolved) {
	            secondAlgorithm.grid.declareWinner();
	          } else if (_this2.firstDone && _this2.secondDone && !firstAlgorithm.grid.unsolved && !secondAlgorithm.grid.unsolved && !firstAlgorithm.grid.won && !secondAlgorithm.grid.won) {
	            firstAlgorithm.grid.declareTie();
	            secondAlgorithm.grid.declareTie();
	          }
	
	          setTimeout(function () {
	            if (!_this2.firstDone) {
	              if (firstSquare.squareType != 'end' && firstSquare.squareType != 'start') {
	                firstAlgorithm.grid.setAsChecked(firstSquare);
	              }
	            }
	
	            if (!_this2.secondDone && secondAlgorithm) {
	              if (secondSquare.squareType != 'end' && secondSquare.squareType != 'start') {
	                secondAlgorithm.grid.setAsChecked(secondSquare);
	              }
	            }
	
	            if (!_this2.firstDone || !_this2.secondDone && secondAlgorithm) {
	              _this2.search();
	            } else {
	              _this2.searching = false;
	              _this2.secondDone = false;
	              _this2.firstDone = false;
	              _this2.firstAlgorithm = null;
	              _this2.secondAlgorithm = null;
	              _this2.grid.won = false;
	              _this2.grid.unsolved = false;
	              document.querySelector('.pause-button').classList.add('hidden');
	              document.querySelector('.play-button').classList.remove('hidden');
	            }
	          }, _this2.stepDelay);
	        })();
	      }
	    }
	  }, {
	    key: 'getAlgorithm',
	    value: function getAlgorithm(key, grid) {
	      switch (key) {
	        case 'bfs':
	          return new _bfs2.default(grid);
	        case 'dfs':
	          return new _dfs2.default(grid);
	        case 'best':
	          return new _bestfs2.default(grid);
	        case 'astar':
	          return new _aStar2.default(grid);
	      }
	    }
	  }, {
	    key: 'setAlgorithmOptions',
	    value: function setAlgorithmOptions() {
	      var _this3 = this;
	
	      var algorithmListEl = document.querySelector('.algorithm-selection ul');
	
	      Object.keys(this.algorithms).forEach(function (key) {
	        algorithmListEl.appendChild(_this3.createAlgorithmSelector(key));
	      });
	    }
	  }, {
	    key: 'createAlgorithmSelector',
	    value: function createAlgorithmSelector(key) {
	      var li = document.createElement('li');
	      var label = document.createElement('label');
	      label.setAttribute('class', 'm-sm');
	      var checkbox = document.createElement('input');
	      checkbox.setAttribute('type', 'checkbox');
	      if (key === 'bfs' || key === 'best') {
	        checkbox.setAttribute('checked', 'true');
	      }
	      checkbox.setAttribute('value', key);
	      label.appendChild(checkbox);
	      label.innerHTML = label.innerHTML + (' ' + this.algorithms[key]);
	      var info = document.createElement('span');
	      info.setAttribute('class', 'fa fa-info pointer p-l-sm p-r');
	      info.setAttribute('modal', '#' + key);
	      label.appendChild(info);
	      li.appendChild(label);
	      li.addEventListener('click', this.handleAlgorithmSelection.bind(this));
	      return li;
	    }
	  }, {
	    key: 'handleAlgorithmSelection',
	    value: function handleAlgorithmSelection(e) {
	      if (e.target.tagName === 'INPUT') {
	        var _e$target2 = e.target,
	            checked = _e$target2.checked,
	            value = _e$target2.value;
	
	        if (e.target.checked) {
	          document.getElementById('did-it-wrong').classList.add('hidden');
	          this.addSelectedAlgorithm(value);
	          this.uncheckUnSelected();
	        } else {
	          this.removeSelectedAlgorithm(value);
	          if (!this.selectedAlgorithms.length) {
	            document.getElementById('did-it-wrong').classList.remove('hidden');
	          }
	        }
	      }
	    }
	  }, {
	    key: 'uncheckUnSelected',
	    value: function uncheckUnSelected() {
	      var _this4 = this;
	
	      var algorithmCheckboxes = document.querySelectorAll('.algorithm-selection ul li input');
	
	      algorithmCheckboxes.forEach(function (checkbox) {
	        if (!_this4.selectedAlgorithms.includes(checkbox.value)) {
	          checkbox.checked = false;
	        } else {
	          checkbox.checked = true;
	        }
	      });
	    }
	  }, {
	    key: 'addSelectedAlgorithm',
	    value: function addSelectedAlgorithm(key) {
	      if (this.selectedAlgorithms.length >= 2) {
	        this.selectedAlgorithms = this.selectedAlgorithms.slice(0, 1);
	      }
	
	      this.selectedAlgorithms.push(key);
	    }
	  }, {
	    key: 'removeSelectedAlgorithm',
	    value: function removeSelectedAlgorithm(key) {
	      var selectedAlgorithms = this.selectedAlgorithms;
	
	      var newAlgorithms = [];
	
	      selectedAlgorithms.forEach(function (algorithm) {
	        if (algorithm !== key) {
	          newAlgorithms.push(algorithm);
	        }
	      });
	
	      this.selectedAlgorithms = newAlgorithms;
	    }
	  }]);
	
	  return Solver;
	}();
	
	exports.default = Solver;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _bestfs = __webpack_require__(4);
	
	var _bestfs2 = _interopRequireDefault(_bestfs);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var AStar = function (_BestFS) {
	  _inherits(AStar, _BestFS);
	
	  function AStar() {
	    _classCallCheck(this, AStar);
	
	    return _possibleConstructorReturn(this, (AStar.__proto__ || Object.getPrototypeOf(AStar)).apply(this, arguments));
	  }
	
	  _createClass(AStar, [{
	    key: 'calculateGscore',
	    value: function calculateGscore(square, parent) {
	      return this.gScore(parent) + this.gScoreAddition(parent, square);
	    }
	  }, {
	    key: 'gScoreAddition',
	    value: function gScoreAddition(square, neighbor) {
	      var sameRow = square.row == neighbor.row;
	      var sameCol = square.col == neighbor.col;
	      return sameRow || sameCol ? 1 : Math.sqrt(2);
	    }
	  }, {
	    key: 'gScore',
	    value: function gScore(square) {
	      return this.gScores[square.row][square.col];
	    }
	  }]);
	
	  return AStar;
	}(_bestfs2.default);
	
	exports.default = AStar;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _algorithmBase = __webpack_require__(5);
	
	var _algorithmBase2 = _interopRequireDefault(_algorithmBase);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var BestFS = function (_AlgorithmBase) {
	  _inherits(BestFS, _AlgorithmBase);
	
	  function BestFS(grid) {
	    _classCallCheck(this, BestFS);
	
	    var _this = _possibleConstructorReturn(this, (BestFS.__proto__ || Object.getPrototypeOf(BestFS)).call(this, grid));
	
	    _this.setupGscores();
	    return _this;
	  }
	
	  _createClass(BestFS, [{
	    key: "setupGscores",
	    value: function setupGscores() {
	      this.gScores = {};
	
	      for (var i = 0; i < 30; i++) {
	        this.gScores[i] = {};
	
	        for (var j = 0; j < 30; j++) {
	          this.gScores[i][j] = 0;
	        }
	      }
	    }
	  }, {
	    key: "nextSquare",
	    value: function nextSquare() {
	      var tmp = this.store[0];
	      this.store[0] = this.store[this.store.length - 1];
	      this.store[this.store.length - 1] = tmp;
	
	      var bestSquare = this.store.pop();
	
	      this.heapifyDown();
	
	      return bestSquare;
	    }
	  }, {
	    key: "distanceFromEnd",
	    value: function distanceFromEnd(square) {
	      var end = this.grid.end;
	
	
	      var x1 = end.row;
	      var x2 = square.row;
	      var y1 = end.col;
	      var y2 = square.col;
	
	      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	    }
	  }, {
	    key: "parentIndex",
	    value: function parentIndex(idx) {
	      if (idx === 0) {
	        throw "Root has no parent";
	        return;
	      }
	
	      return Math.floor((idx - 1) / 2);
	    }
	  }, {
	    key: "childIndices",
	    value: function childIndices(parent_index) {
	      var _this2 = this;
	
	      return [parent_index * 2 + 1, parent_index * 2 + 2].filter(function (i) {
	        return i < _this2.store.length;
	      });
	    }
	  }, {
	    key: "heapifyUp",
	    value: function heapifyUp() {
	      var idx = this.store.length - 1;
	
	      while (idx > 0) {
	        var parent = this.parentIndex(idx);
	
	        if (this.heapGScore(parent) > this.heapGScore(idx)) {
	          var tmp = this.store[parent];
	          this.store[parent] = this.store[idx];
	          this.store[idx] = tmp;
	          idx = parent;
	        } else {
	          break;
	        }
	      }
	    }
	  }, {
	    key: "heapifyDown",
	    value: function heapifyDown() {
	      var idx = 0;
	
	      while (idx < this.store.length) {
	        var children = this.childIndices(idx);
	
	        var min = null;
	
	        if (children.length === 1) {
	          min = children[0];
	        } else if (children.length === 2) {
	          min = this.heapGScore(children[0]) < this.heapGScore(children[1]) ? children[0] : children[1];
	        }
	
	        if (min && this.heapGScore(min) < this.heapGScore(idx)) {
	          var tmp = this.store[min];
	          this.store[min] = this.store[idx];
	          this.store[idx] = tmp;
	
	          idx = min;
	        } else {
	          break;
	        }
	      }
	    }
	  }, {
	    key: "heapGScore",
	    value: function heapGScore(idx) {
	      var square = this.store[idx];
	
	      return this.distanceFromEnd(square) + this.gScore(square);
	    }
	  }, {
	    key: "calculateGscore",
	    value: function calculateGscore(square) {
	      return 0;
	    }
	  }, {
	    key: "processSquare",
	    value: function processSquare(square) {
	      var _this3 = this;
	
	      var diagonal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	
	      this.steps++;
	      this.makeSeen(square);
	      var neighbors = this.grid.getNeighbors(square, diagonal);
	      var newStore = [];
	
	      neighbors.forEach(function (neighbor) {
	        var gScore = _this3.calculateGscore(neighbor, square);
	        var gScoreIsBest = false;
	
	        if (!_this3.alreadySeen(neighbor)) {
	          gScoreIsBest = true;
	          _this3.store.push(neighbor);
	          newStore.push(neighbor);
	          _this3.makeSeen(neighbor);
	          _this3.setgScore(neighbor, gScore);
	          _this3.heapifyUp();
	        } else if (gScore < _this3.gScore(neighbor)) {
	          gScoreIsBest = true;
	        }
	
	        if (gScoreIsBest) {
	          neighbor.parent = square;
	          _this3.setgScore(neighbor, gScore);
	        }
	      });
	
	      this.updateMaxLength();
	
	      return newStore;
	    }
	  }, {
	    key: "gScore",
	    value: function gScore(square) {
	      return this.gScores[square.row][square.col];
	    }
	  }, {
	    key: "setgScore",
	    value: function setgScore(square, score) {
	      this.gScores[square.row][square.col] = score;
	    }
	  }]);
	
	  return BestFS;
	}(_algorithmBase2.default);
	
	exports.default = BestFS;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var AlgorithmBase = function () {
	  function AlgorithmBase(grid) {
	    _classCallCheck(this, AlgorithmBase);
	
	    this.grid = grid;
	
	    this.store = [this.grid.start];
	    this.steps = 0;
	    this.maxStore = 1;
	    this.seen = {};
	  }
	
	  _createClass(AlgorithmBase, [{
	    key: "alreadySeen",
	    value: function alreadySeen(square) {
	      return this.seen[square.row] && this.seen[square.row][square.col];
	    }
	  }, {
	    key: "makeSeen",
	    value: function makeSeen(square) {
	      if (!this.seen[square.row]) {
	        this.seen[square.row] = {};
	      }
	
	      this.seen[square.row][square.col] = true;
	    }
	  }, {
	    key: "processSquare",
	    value: function processSquare(square) {
	      var _this = this;
	
	      var diagonal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	
	      this.steps++;
	      this.makeSeen(square);
	      var neighbors = this.grid.getNeighbors(square, diagonal);
	      var newStore = [];
	
	      neighbors.forEach(function (neighbor) {
	        if (!_this.alreadySeen(neighbor)) {
	          neighbor.parent = square;
	          _this.store.push(neighbor);
	          newStore.push(neighbor);
	          _this.makeSeen(neighbor);
	        }
	      });
	
	      this.updateMaxLength();
	
	      return newStore;
	    }
	  }, {
	    key: "updateMaxLength",
	    value: function updateMaxLength() {
	      if (this.store.length > this.maxStore) {
	        this.maxStore = this.store.length;
	      }
	    }
	  }, {
	    key: "drawPath",
	    value: function drawPath(square) {
	      var _this2 = this;
	
	      this.grid.drawPath(square, function () {
	        return _this2.displayStats();
	      });
	    }
	  }, {
	    key: "displayStats",
	    value: function displayStats() {
	      this.grid.displayStats(this.steps, this.maxStore);
	    }
	  }]);
	
	  return AlgorithmBase;
	}();
	
	exports.default = AlgorithmBase;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _algorithmBase = __webpack_require__(5);
	
	var _algorithmBase2 = _interopRequireDefault(_algorithmBase);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var BFS = function (_AlgorithmBase) {
	  _inherits(BFS, _AlgorithmBase);
	
	  function BFS() {
	    _classCallCheck(this, BFS);
	
	    return _possibleConstructorReturn(this, (BFS.__proto__ || Object.getPrototypeOf(BFS)).apply(this, arguments));
	  }
	
	  _createClass(BFS, [{
	    key: 'nextSquare',
	    value: function nextSquare() {
	      return this.store.shift();
	    }
	  }]);
	
	  return BFS;
	}(_algorithmBase2.default);
	
	exports.default = BFS;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _algorithmBase = __webpack_require__(5);
	
	var _algorithmBase2 = _interopRequireDefault(_algorithmBase);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var DFS = function (_AlgorithmBase) {
	  _inherits(DFS, _AlgorithmBase);
	
	  function DFS() {
	    _classCallCheck(this, DFS);
	
	    return _possibleConstructorReturn(this, (DFS.__proto__ || Object.getPrototypeOf(DFS)).apply(this, arguments));
	  }
	
	  _createClass(DFS, [{
	    key: 'nextSquare',
	    value: function nextSquare() {
	      return this.store.pop();
	    }
	  }]);
	
	  return DFS;
	}(_algorithmBase2.default);
	
	exports.default = DFS;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Modal = function () {
	  function Modal() {
	    _classCallCheck(this, Modal);
	
	    this.el = document.querySelector('.modal');
	    this.bindEvents();
	  }
	
	  _createClass(Modal, [{
	    key: 'bindEvents',
	    value: function bindEvents() {
	      var _this = this;
	
	      document.querySelector('body').addEventListener('click', function (e) {
	        var target = e.target;
	
	
	        var modal = target.getAttribute('modal');
	
	        if (modal) {
	          e.preventDefault();
	          var content = '';
	          var targetElement = document.querySelector(modal);
	
	          if (targetElement) {
	            content = targetElement.innerHTML;
	          }
	
	          _this.el.querySelector('.content .body').innerHTML = content;
	          _this.showModal();
	        } else if (Array.from(target.classList).includes('modal') || Array.from(target.classList).includes('close')) {
	          _this.hideModal();
	        }
	      });
	    }
	  }, {
	    key: 'hideModal',
	    value: function hideModal() {
	      this.el.classList.add('hidden');
	    }
	  }, {
	    key: 'showModal',
	    value: function showModal() {
	      this.el.classList.remove('hidden');
	    }
	  }]);
	
	  return Modal;
	}();
	
	exports.default = Modal;

/***/ },
/* 9 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map