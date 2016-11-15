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
	
	__webpack_require__(4);
	
	
	document.addEventListener('DOMContentLoaded', function () {
	  var grid = new _grid2.default(document.getElementById('chooser-grid'));
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
	    _classCallCheck(this, Grid);
	
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
	        'stroke-opacity': 0.2
	      },
	      start: {
	        fill: '#0d0',
	        'stroke-opacity': 0.2
	      },
	      end: {
	        fill: '#e40',
	        'stroke-opacity': 0.2
	      },
	      opened: {
	        fill: '#98fb98',
	        'stroke-opacity': 0.2
	      },
	      closed: {
	        fill: '#afeeee',
	        'stroke-opacity': 0.2
	      },
	      failed: {
	        fill: '#ff8888',
	        'stroke-opacity': 0.2
	      },
	      tested: {
	        fill: '#e5e5e5',
	        'stroke-opacity': 0.2
	      }
	    };
	
	    this.drawGrid();
	  }
	
	  _createClass(Grid, [{
	    key: 'drawGrid',
	    value: function drawGrid(callback) {
	      var rects = this.rects,
	          grid = this.grid,
	          cellSize = this.cellSize,
	          cols = this.cols,
	          rows = this.rows,
	          cellStyles = this.cellStyles;
	
	      grid.setSize(cols * cellSize, rows * cellSize);
	
	      var createRowTask = function createRowTask(rowId) {
	        return function (done) {
	          rects[rowId] = [];
	          for (var j = 0; j < cols; ++j) {
	            var x = j * cellSize;
	            var y = rowId * cellSize;
	
	            var rect = grid.rect(x, y, cellSize, cellSize);
	            rect.attr(cellStyles.normal);
	            rects[rowId].push(rect);
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
/* 2 */,
/* 3 */,
/* 4 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map