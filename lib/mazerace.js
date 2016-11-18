require('./stylesheets/mazerace.scss');
import Grid from './grid';
import Solver from './solver';
import Modal from './modal';

document.addEventListener('DOMContentLoaded', () => {
  const gridEl = document.getElementById('chooser-grid');
  let grid = new Grid(gridEl);
  let solver = new Solver(grid);
  let modal = new Modal;
});
