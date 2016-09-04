'use strict';

var cells = [[]]; // [[Cell]]
var cellNumX; // Int
var cellNumY; // Int

function setup() {
  createCanvas(640, 640);
  cellNumX = Math.floor(width  / Cell.cellSize);
  cellNumY = Math.floor(height / Cell.cellSize);
  restart();
}

function restart() {
  for (var x = 0; x < cellNumX; x++) {
    for (var y = 0; y < cellNumY; y++) {
      if (cells[x] === undefined) cells[x] = [];
      cells[x][y] = new Cell(x, y);
    }
  }

  for (var x = 0; x < cellNumX; x++) {
    for (var y = 0; y < cellNumY; y++) {
      var above = y - 1;
      var below = y + 1;
      var left  = x - 1;
      var right = x + 1;
      if (above < 0)          above = cellNumY - 1;
      if (below === cellNumY) below = 0;
      if (left  < 0)          left = cellNumY - 1;
      if (right === cellNumX) right = 0;

      cells[x][y].addNeightbour(cells[left][above]);
      cells[x][y].addNeightbour(cells[left][y]);
      cells[x][y].addNeightbour(cells[left][below]);
      cells[x][y].addNeightbour(cells[x][above]);
      cells[x][y].addNeightbour(cells[x][below]);
      cells[x][y].addNeightbour(cells[right][above]);
      cells[x][y].addNeightbour(cells[right][y]);
      cells[x][y].addNeightbour(cells[right][below]);
    }
  }
}

function draw() {
  background(200);
  translate(Cell.cellSize / 2, Cell.cellSize / 2);

  // calculate next state of all cells
  for (var x = 0; x < cellNumX; x++) {
    for (var y = 0; y < cellNumY; y++) {
      cells[x][y].calcNextState();
    }
  }
  // draw all cells
  for (var x = 0; x < cellNumX; x++) {
    for (var y = 0; y < cellNumY; y++) {
      cells[x][y].drawMe();
    }
  }
}


// === Cell class ===

var Cell = function (x, y) {
  this.x = x * Cell.cellSize;
  this.y = y * Cell.cellSize;
  // set initial state
  this.nextState = (random(2) > 1) ? true: false;
  this.state = this.nextState;
  this.neighbours = []; // [Cell]
}

Cell.cellSize = 10;

Cell.prototype.addNeightbour = function (otherCell) {
  this.neighbours.push(otherCell);
};

Cell.prototype.calcNextState = function () {
  var liveCount =
    this.neighbours.reduce(function (sum, cell) {
      return sum + cell.state;
    }, 0);

  if (this.state === true) {
    if (liveCount === 2 || liveCount === 3) {
      this.nextState = true;
    } else {
      this.nextState = false;
    }
  } else {
    if (liveCount === 3) {
      this.nextState = true;
    } else {
      this.nextState = false;
    }
  }
};

Cell.prototype.drawMe = function () {
  this.state = this.nextState;
  stroke(0);
  if (this.state === true) {
    fill(0);
  } else {
    fill(255);
  }
  ellipse(this.x, this.y, Cell.cellSize, Cell.cellSize);
};
