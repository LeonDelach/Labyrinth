/**
 * Board model: owns the board dimensions and all game components.
 * The renderers read from this object instead of maintaining their own copies.
 */
class Board {
  constructor(width = 400, height = 400) {
    this.width = width;
    this.height = height;
    this.walls = [];
    this.holes = [];
    this.arrival = null;
  }

  buildDefault() {
    this.walls = [
      new Wall(0, 0, this.width, 0),
      new Wall(this.width, 0, this.width, this.height),
      new Wall(0, this.height, this.width, this.height),
      new Wall(0, 0, 0, this.height),
      new Wall(120, 100, 280, 100),
      new Wall(280, 100, 280, 300),
      new Wall(80, 300, 240, 300)
    ];

    this.holes = [new Hole(330, 330, 30)];
    this.arrival = new Arrival(350, 60, 18);
  }
}

window.Labyrinth = window.Labyrinth || {};
window.Labyrinth.Board = Board;
