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
    this.start = { x: width / 2, y: height / 2 };
  }

  applyPreset(preset) {
    const config = preset || window.Labyrinth.BoardPresets?.playground || null;
    if (!config) {
      return;
    }

    this.start = { ...config.start };
    this.walls = (config.walls || []).map((wall) => new Wall(wall.x1, wall.y1, wall.x2, wall.y2));
    this.holes = (config.holes || []).map((hole) => new Hole(hole.x0, hole.y0, hole.radius));
    this.arrival = new Arrival(config.arrival.x, config.arrival.y, config.arrival.radius || 18);
  }

  buildDefault() {
    this.applyPreset(window.Labyrinth.BoardPresets?.playground);
  }
}

window.Labyrinth = window.Labyrinth || {};
window.Labyrinth.Board = Board;
