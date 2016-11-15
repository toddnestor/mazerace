require('./stylesheets/mazerace.scss');
import Grid from './grid';

document.addEventListener('DOMContentLoaded', () => {
  let grid = new Grid(document.getElementById('chooser-grid'));
});
