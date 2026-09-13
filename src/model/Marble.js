/**
 * Marble state in the board coordinate system.
 * Velocity and acceleration are updated by the Game class.
 */
class Marble {
  constructor(x, y, radius = 20) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.radius = radius;
  }

  draw2D(ctx, color = '#ff0000') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

window.Labyrinth = window.Labyrinth || {};
window.Labyrinth.Marble = Marble;
