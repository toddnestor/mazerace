# Maze Race

### Background

Maze Race compares algorithms such as Breadth First Search, A*, Best First Search, and Dijkstra.  Maze Race is inspired by [Pathfinder.js](https://qiao.github.io/PathFinding.js/visual/)

It shows a visual representation of how the algorithms work.  It also shows those algorithms happening side-by-side for a visual comparison.  Like Pathfinder.js, Maze race has a grid where a start and end point can be placed.  Walls can also be placed that the search algorithms will have to go around when searching for the endpoint.

Users can create the maze by setting the start/end positions and placing walls on a grid.  Then they can choose from the algorithm options and watch how the maze gets solved, and compare the algorithms with each other.

When the user presses "Start" the grid will be duplicated and side-by-side grids will be displayed.  Each step will light up the square actively being searched on each grid based on the algorithms being used.  A grid will remain lit up until one of it's children squares are searched so the perimeter that has been searched will be lit up. When the end is found a line will be rendered to show the path from the start point to the end point.

### Functionality & MVP

Users will be able to:

- [ ] Place a start position, end position, and walls on a grid
- [ ] Select which algorithms to compare
- [ ] Start, pause, and reset the simulation
- [ ] View stats about the algorithms including how many steps it took to solve the maze and how much time

In addition, this project will include:

- [ ] Explanations about how each of the algorithms work
- [ ] A production Readme

### Wireframes

This app will consist of a single page with grid that the user can set up the maze on, a list of algorithms the user can choose from, and links to the GitHub, my LinkedIn, my porfolio site, and modals that explain each algorithm.  The controls will include a start, pause, and reset button.  When a simulation is started it will show two duplicate grids side-by-side, lighting up the squares as the algorithms check them.

![wireframes](https://devbook.objects.cdn.dream.io/media_items/media/000/000/117/large/New_Mockup_1.png)

![wireframes](https://devbook.objects.cdn.dream.io/media_items/media/000/000/116/large/New_Mockup_1_copy.png)


### Architecture and Technologies

This project will be implemented using Vanilla JS and possibly jQuery to simplify DOM manipulation.  Sass will be used to simplify the CSS for this project.  Webpack will be used to bundle and serve the various scripts.

### Implementation Timeline

**Day 1**: Setup the app skeleton and webpack.  Get the initial grid layout in place including drag and drop functionality for placing the start, end, and wall boxes on the grid.

- Get a green bundle with webpack (including Sass compilation)
- Get the HTML layout in place
- Get drag-and-drop working (either using Vanilla JS or jQuery if that proves too time-consuming)

**Day 2**: Get Breadth First Search algorithm implemented and the simulation working lighting up the appropriate squares as it solves the maze.

- Implement a render function that will light up squares that are being searched.  The search algorithms will mark squares as being searched and the render function will light up those squares by changing the background color.
- Create a Node and queue to be utilized for Breadth First Search

**Day 3**: Implement the Dijkstra, Best First Search, and A* algorithms with side-by-side comparison.

- Utilize the previously created nodes and queue data structures to implement the remaining algorithms
- Get the grid duplicating it self when doing a side-by-side comparison and place the two grids next to each other.
- Get stats showing how many steps and how much time each algorithm takes.

**Day 4**: CSS clean up and explanation of algorithms

- Clean up the styles and animations
- Create explanations for each algorithm that can be accessed by clicking a link that opens a modal

### Bonus features

Some anticipated additional features are:

- [ ] Implement more algorithms
- [ ] Allow uploading of mazes
- [ ] Implement a random maze generation feature
