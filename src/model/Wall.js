/**
 * Logical representation of a wall segment in the labyrinth.
 * The class stores the segment geometry and collision checks.
 * Rendering is delegated to the display layer instead of mixing 2D/3D code here.
 */
class Wall {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  testVertical(x, y, radius) {
    return (this.x1 === this.x2 && y <= this.y2 && y >= this.y1 && x < this.x1 + radius && x > this.x1 - radius);
  }

  testHorizontal(x, y, radius) {
    return (this.y1 === this.y2 && x <= this.x2 && x >= this.x1 && y < this.y1 + radius && y > this.y1 - radius);
  }

  extremity1(x, y, radius) {
    return Math.sqrt(Math.pow(x - this.x1, 2) + Math.pow(y - this.y1, 2)) < radius;
  }

  extremity2(x, y, radius) {
    return Math.sqrt(Math.pow(x - this.x2, 2) + Math.pow(y - this.y2, 2)) < radius;
  }

  draw2D(ctx, color = '#5a2b8f', lineWidth = 8) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
  }
}

window.Labyrinth = window.Labyrinth || {};
window.Labyrinth.Wall = Wall;
