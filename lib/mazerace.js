require('./stylesheets/mazerace.scss');
import Grid from './grid';

document.addEventListener('DOMContentLoaded', () => {
  const gridEl = document.getElementById('chooser-grid');
  let grid = new Grid(gridEl);
});
