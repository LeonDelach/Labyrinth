/**
 * Hole model: position + radius + loss logic.
 * The hole is a game rule object, not a rendering object.
 */
class Hole {
  constructor(x0, y0, radius = 30) {
    this.x0 = x0;
    this.y0 = y0;
    this.radius = radius;
  }

  contains(x, y, marbleRadius = 20) {
    const distance = Math.sqrt(Math.pow(this.x0 - x, 2) + Math.pow(this.y0 - y, 2));
    return this.radius > distance && this.radius - marbleRadius < distance;
  }

  fails(x, y, marbleRadius = 20) {
    const distance = Math.sqrt(Math.pow(this.x0 - x, 2) + Math.pow(this.y0 - y, 2));
    return this.radius - marbleRadius >= distance;
  }

  draw2D(ctx) {
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(this.x0, this.y0, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

window.Labyrinth = window.Labyrinth || {};
window.Labyrinth.Hole = Hole;
