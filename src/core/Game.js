/**
 * Game loop and rules engine.
 * It owns movement, collisions, win/loss checks, and the authoritative board state.
 */
class Game {
  constructor(board, marble) {
    this.board = board;
    this.marble = marble;
    this.gameStatus = 'playing';
    this.gravity = 1000;
    this.dt = 0.02;
    this.ddt = this.dt / 10;
    this.rebound = 0.8;
    this.acceleration = { x: 0, y: 0 };
  }

  triggerGameEnd(message) {
    if (this.gameStatus !== 'playing') {
      return;
    }

    this.gameStatus = message === 'You won' ? 'won' : 'lost';
    this.dt = 0;
    alert(message);
  }

  hasReachedArrival() {
    if (!this.board.arrival) {
      return false;
    }

    return this.board.arrival.contains(this.marble.x, this.marble.y);
  }

  update() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    this.marble.vx += this.marble.ax * this.dt;
    this.marble.vy += this.marble.ay * this.dt;
    this.marble.x += this.marble.vx * this.dt;
    this.marble.y += this.marble.vy * this.dt;

    this.handleBounds();
    this.handleWallCollisions();
    this.handleHoleCollisions();

    if (this.hasReachedArrival()) {
      this.triggerGameEnd('You won');
      return;
    }

    this.marble.ax -= this.acceleration.x;
    this.marble.ay -= this.acceleration.y;
  }

  handleBounds() {
    if (this.marble.x < this.marble.radius) {
      this.marble.x = this.marble.radius;
      this.marble.vx = Math.abs(this.marble.vx) * this.rebound;
    }
    if (this.marble.x > this.board.width - this.marble.radius) {
      this.marble.x = this.board.width - this.marble.radius;
      this.marble.vx = -Math.abs(this.marble.vx) * this.rebound;
    }
    if (this.marble.y < this.marble.radius) {
      this.marble.y = this.marble.radius;
      this.marble.vy = Math.abs(this.marble.vy) * this.rebound;
    }
    if (this.marble.y > this.board.height - this.marble.radius) {
      this.marble.y = this.board.height - this.marble.radius;
      this.marble.vy = -Math.abs(this.marble.vy) * this.rebound;
    }
  }

  handleWallCollisions() {
    for (let i = 0; i < this.board.walls.length; i++) {
      const w = this.board.walls[i];
      let b = 0;
      const x = this.marble.x;
      const y = this.marble.y;

      if (w.testVertical(x, y, this.marble.radius)) {
        while (w.testVertical(this.marble.x, this.marble.y, this.marble.radius)) {
          this.marble.x -= this.marble.vx * this.ddt;
          this.marble.y -= this.marble.vy * this.ddt;
          b += this.ddt;
        }
        this.marble.vx = -this.marble.vx * this.rebound;
        this.marble.x += b * this.marble.vx;
        this.marble.y += b * this.marble.vy;
      }

      if (w.testHorizontal(this.marble.x, this.marble.y, this.marble.radius)) {
        while (w.testHorizontal(this.marble.x, this.marble.y, this.marble.radius)) {
          this.marble.x -= this.marble.vx * this.ddt;
          this.marble.y -= this.marble.vy * this.ddt;
          b += this.ddt;
        }
        this.marble.vy = -this.marble.vy * this.rebound;
        this.marble.x += b * this.marble.vx;
        this.marble.y += b * this.marble.vy;
      }

      if (w.extremity1(this.marble.x, this.marble.y, this.marble.radius)) {
        while (w.extremity1(this.marble.x, this.marble.y, this.marble.radius)) {
          this.marble.x -= this.marble.vx * this.ddt;
          this.marble.y -= this.marble.vy * this.ddt;
          b += this.ddt;
        }
        const x1 = w.x1;
        const y1 = w.y1;
        const vx = this.marble.vx;
        const vy = this.marble.vy;
        const newVx = (vx * (y1 - this.marble.y) + vy * (-x1 + this.marble.x) * (y1 - this.marble.y) - vx * (x1 - this.marble.x) - vy * (y1 - this.marble.y) * (x1 - this.marble.x)) / Math.pow(this.marble.radius, 2);
        const newVy = (vx * (y1 - this.marble.y) + vy * (-x1 + this.marble.x) * (-x1 + this.marble.x) - vx * (x1 - this.marble.x) - vy * (y1 - this.marble.y) * (y1 - this.marble.y)) / Math.pow(this.marble.radius, 2);
        this.marble.vx = newVx;
        this.marble.vy = newVy;
        this.marble.x += b * this.marble.vx;
        this.marble.y += b * this.marble.vy;
      }

      if (w.extremity2(this.marble.x, this.marble.y, this.marble.radius)) {
        while (w.extremity2(this.marble.x, this.marble.y, this.marble.radius)) {
          this.marble.x -= this.marble.vx * this.ddt;
          this.marble.y -= this.marble.vy * this.ddt;
          b += this.ddt;
        }
        const x2 = w.x2;
        const y2 = w.y2;
        const vx = this.marble.vx;
        const vy = this.marble.vy;
        const newVx = (vx * (y2 - this.marble.y) + vy * (-x2 + this.marble.x) * (y2 - this.marble.y) - vx * (x2 - this.marble.x) - vy * (y2 - this.marble.y) * (x2 - this.marble.x)) / Math.pow(this.marble.radius, 2);
        const newVy = (vx * (y2 - this.marble.y) + vy * (-x2 + this.marble.x) * (-x2 + this.marble.x) - vx * (x2 - this.marble.x) - vy * (y2 - this.marble.y) * (y2 - this.marble.y)) / Math.pow(this.marble.radius, 2);
        this.marble.vx = newVx;
        this.marble.vy = newVy;
        this.marble.x += b * this.marble.vx;
        this.marble.y += b * this.marble.vy;
      }
    }
  }

  handleHoleCollisions() {
    let acx = 0;
    let acy = 0;

    for (let j = 0; j < this.board.holes.length; j++) {
      const h = this.board.holes[j];

      if (h.contains(this.marble.x, this.marble.y, this.marble.radius)) {
        const d = Math.sqrt(Math.pow(h.x0 - this.marble.x, 2) + Math.pow(h.y0 - this.marble.y, 2));

        this.marble.ax -= acx;
        this.marble.ay -= acy;

        acx = this.gravity * Math.tan(Math.asin((h.radius - d) / this.marble.radius)) * (h.x0 - this.marble.x) / d;
        acy = this.gravity * Math.tan(Math.asin((h.radius - d) / this.marble.radius)) * (h.y0 - this.marble.y) / d;

        this.marble.ax += acx;
        this.marble.ay += acy;
      }

      if (h.fails(this.marble.x, this.marble.y, this.marble.radius)) {
        this.triggerGameEnd('You lost');
        return;
      }
    }

    this.marble.ax -= acx;
    this.marble.ay -= acy;
  }

  reset() {
    this.gameStatus = 'playing';
    this.dt = 0.02;
    this.marble.vx = 0;
    this.marble.vy = 0;
    this.marble.ax = 0;
    this.marble.ay = 0;
    this.acceleration.x = 0;
    this.acceleration.y = 0;
    this.board.buildDefault();
    this.marble.x = this.board.width / 2;
    this.marble.y = this.board.height / 2;
  }
}

window.Labyrinth = window.Labyrinth || {};
window.Labyrinth.Game = Game;
