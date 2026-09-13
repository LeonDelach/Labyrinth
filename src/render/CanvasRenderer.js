/**
 * 2D renderer for the board.
 * The renderer reads the game model and draws it on the canvas.
 */
class CanvasRenderer {
  constructor(canvas, board, marble) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.board = board;
    this.marble = marble;
  }

  clear() {
    this.ctx.fillStyle = 'orange';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render() {
    this.clear();

    if (this.board.arrival) {
      this.board.arrival.draw2D(this.ctx);
    }

    this.board.holes.forEach((hole) => hole.draw2D(this.ctx));
    this.marble.draw2D(this.ctx);
    this.board.walls.forEach((wall) => wall.draw2D(this.ctx));
  }
}

window.Labyrinth = window.Labyrinth || {};
window.Labyrinth.CanvasRenderer = CanvasRenderer;
