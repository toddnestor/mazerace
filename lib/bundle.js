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
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	__webpack_require__(2);
	
	
	document.addEventListener('DOMContentLoaded', function () {
	  var gridEl = document.getElementById('chooser-grid');
	  var grid = new _grid2.default(gridEl);
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
	        fill: '#8B4513',
	        'stroke-opacity': 0.2
	      },
	      start: {
	        fill: '#0d0',
	        'stroke-opacity': 0.2
	      },
	      end: {
	        fill: '#e40',
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
	    key: 'clickEvent',
	    value: function clickEvent(e) {
	      this.handleSquare(e);
	      this.currentAction = null;
	    }
	  }, {
	    key: 'bindEvents',
	    value: function bindEvents() {
	      var _this2 = this;
	
	      this.el.addEventListener('mouseover', this.hoverEvent.bind(this));
	      this.el.addEventListener('click', this.clickEvent.bind(this));
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
	  }]);
	
	  return Grid;
	}();
	
	exports.default = Grid;

/***/ },
/* 2 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map