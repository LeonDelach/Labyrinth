/**
 * Arrival area: the win condition in the maze.
 * The marble wins when its center enters this circular zone.
 */
class Arrival {
  constructor(x, y, radius = 18) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  contains(x, y) {
    return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2)) <= this.radius;
  }

  draw2D(ctx) {
    ctx.fillStyle = '#00cc66';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

window.Labyrinth = window.Labyrinth || {};
window.Labyrinth.Arrival = Arrival;
