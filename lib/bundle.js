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
	
	var _solver = __webpack_require__(3);
	
	var _solver2 = _interopRequireDefault(_solver);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	__webpack_require__(2);
	
	
	document.addEventListener('DOMContentLoaded', function () {
	  var gridEl = document.getElementById('chooser-grid');
	  var grid = new _grid2.default(gridEl);
	  var solver = new _solver2.default(grid);
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
	    var _this = this;
	
	    _classCallCheck(this, Grid);
	
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
	      return _this.setDefaults();
	    });
	    this.bindEvents();
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
	      square.attr({
	        transform: 's1.2'
	      }).animate({
	        fill: this.cellStyles.path.fill,
	        transform: 's1.0'
	      }, 100);
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
	      var _this2 = this;
	
	      this.el.addEventListener('mouseover', this.hoverEvent.bind(this));
	      this.el.addEventListener('mousedown', this.handleSquare.bind(this));
	      this.el.addEventListener('mouseup', function (e) {
	        _this2.currentAction = null;
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
	      var _this3 = this;
	
	      var neighbors = [];
	
	      var deltas = [[1, 0], [0, 1], [-1, 0], [0, -1]];
	
	      deltas.forEach(function (delta) {
	        var pos = [];
	        pos.push(square.row + delta[0]);
	        pos.push(square.col + delta[1]);
	
	        if (_this3.squares[pos[0]]) {
	          var neighbor = _this3.squares[pos[0]][pos[1]];
	
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
	      var _this4 = this;
	
	      this.squares.forEach(function (row) {
	        row.forEach(function (square) {
	          if (square.squareType === 'normal') {
	            square.attr(_this4.cellStyles.normal);
	          }
	        });
	      });
	    }
	  }, {
	    key: 'drawPath',
	    value: function drawPath(square) {
	      var _this5 = this;
	
	      if (square.squareType != 'start' && square.squareType != 'end') {
	        this.setAsPath(square);
	      }
	
	      if (square.parent) {
	        setTimeout(function () {
	          _this5.drawPath(square.parent);
	        }, 10);
	      }
	    }
	  }]);
	
	  return Grid;
	}();
	
	exports.default = Grid;

/***/ },
/* 2 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _aStar = __webpack_require__(4);
	
	var _aStar2 = _interopRequireDefault(_aStar);
	
	var _bfs = __webpack_require__(6);
	
	var _bfs2 = _interopRequireDefault(_bfs);
	
	var _dfs = __webpack_require__(7);
	
	var _dfs2 = _interopRequireDefault(_dfs);
	
	var _bestfs = __webpack_require__(8);
	
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
	
	    this.selectedAlgorithms = [];
	
	    this.setAlgorithmOptions();
	    this.bindEvents();
	  }
	
	  _createClass(Solver, [{
	    key: 'bindEvents',
	    value: function bindEvents() {
	      var _this = this;
	
	      document.querySelector('.play-button').addEventListener('click', function (e) {
	        _this.grid.reset();
	        var firstAlgorithm = _this.getAlgorithm(_this.selectedAlgorithms[0], _this.grid);
	        _this.search(firstAlgorithm);
	      });
	
	      document.querySelector('.restart-button').addEventListener('click', function (e) {
	        console.log('i got clicked');
	        _this.grid.reset();
	      });
	    }
	  }, {
	    key: 'search',
	    value: function search(firstAlgorithm) {
	      var _this2 = this;
	
	      var square = firstAlgorithm.nextSquare();
	      if (square) {
	        if (square.squareType !== 'start' && square.squareType !== 'end') {
	          this.grid.setAsChecking(square);
	        }
	
	        if (square.squareType === 'end') {
	          firstAlgorithm.drawPath(square);
	        } else {
	          var newStore = firstAlgorithm.processSquare(square);
	
	          newStore.forEach(function (square) {
	            if (square.squareType != 'end' && square.squareType != 'start') {
	              _this2.grid.setAsJustChecked(square);
	            }
	          });
	
	          setTimeout(function () {
	            if (square.squareType != 'end' && square.squareType != 'start') {
	              _this2.grid.setAsChecked(square);
	            }
	
	            _this2.search(firstAlgorithm);
	          }, 10);
	        }
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
	        case 'astart':
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
	      checkbox.setAttribute('value', key);
	      label.appendChild(checkbox);
	      label.innerHTML = label.innerHTML + (' ' + this.algorithms[key]);
	      li.appendChild(label);
	      li.addEventListener('click', this.handleAlgorithmSelection.bind(this));
	      return li;
	    }
	  }, {
	    key: 'handleAlgorithmSelection',
	    value: function handleAlgorithmSelection(e) {
	      if (e.target.tagName === 'INPUT') {
	        var _e$target = e.target,
	            checked = _e$target.checked,
	            value = _e$target.value;
	
	        if (e.target.checked) {
	          this.addSelectedAlgorithm(value);
	          this.uncheckUnSelected();
	        } else {
	          this.removeSelectedAlgorithm(value);
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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _algorithmBase = __webpack_require__(5);
	
	var _algorithmBase2 = _interopRequireDefault(_algorithmBase);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var AStar = function (_AlgorithmBase) {
	  _inherits(AStar, _AlgorithmBase);
	
	  function AStar(grid) {
	    _classCallCheck(this, AStar);
	
	    return _possibleConstructorReturn(this, (AStar.__proto__ || Object.getPrototypeOf(AStar)).call(this, grid));
	  }
	
	  return AStar;
	}(_algorithmBase2.default);
	
	exports.default = AStar;

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
	
	      this.makeSeen(square);
	      var neighbors = this.grid.getNeighbors(square);
	      var newStore = [];
	
	      neighbors.forEach(function (neighbor) {
	        if (!_this.alreadySeen(neighbor)) {
	          neighbor.parent = square;
	          _this.store.push(neighbor);
	          newStore.push(neighbor);
	          _this.makeSeen(neighbor);
	        }
	      });
	
	      return newStore;
	    }
	  }, {
	    key: "drawPath",
	    value: function drawPath(square) {
	      this.grid.drawPath(square);
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
	      var square = this.store.shift();
	      return square;
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
	      var square = this.store.pop();
	      return square;
	    }
	  }]);
	
	  return DFS;
	}(_algorithmBase2.default);
	
	exports.default = DFS;

/***/ },
/* 8 */
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
	
	var BestFS = function (_AlgorithmBase) {
	  _inherits(BestFS, _AlgorithmBase);
	
	  function BestFS() {
	    _classCallCheck(this, BestFS);
	
	    return _possibleConstructorReturn(this, (BestFS.__proto__ || Object.getPrototypeOf(BestFS)).apply(this, arguments));
	  }
	
	  _createClass(BestFS, [{
	    key: 'nextSquare',
	    value: function nextSquare() {
	      var _this2 = this;
	
	      var bestSquare = null;
	      var distanceFromEnd = null;
	
	      this.store.forEach(function (square) {
	        var distance = _this2.distanceFromEnd(square);
	
	        if (!distanceFromEnd || distance < distanceFromEnd && bestSquare.squareType != 'end') {
	          distanceFromEnd = distance;
	          bestSquare = square;
	        }
	      });
	
	      var newStore = [];
	
	      this.store.forEach(function (square) {
	        if (square !== bestSquare) {
	          newStore.push(square);
	        }
	      });
	
	      this.store = newStore;
	
	      return bestSquare;
	    }
	  }, {
	    key: 'distanceFromEnd',
	    value: function distanceFromEnd(square) {
	      var end = this.grid.end;
	
	
	      var x1 = end.row;
	      var x2 = square.row;
	      var y1 = end.col;
	      var y2 = square.col;
	
	      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	    }
	  }]);
	
	  return BestFS;
	}(_algorithmBase2.default);
	
	exports.default = BestFS;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map