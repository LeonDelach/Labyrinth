let labyrinthInitialized = false;

function initializeLabyrinth() {
  if (labyrinthInitialized) {
    return;
  }
  labyrinthInitialized = true;

  const canvas = document.getElementById('dessin');
  const renderCanvas = document.getElementById('renderCanvas');

  if (!canvas || !renderCanvas) {
    return;
  }

  const board = new window.Labyrinth.Board(canvas.width, canvas.height);
  board.buildDefault();

  const marble = new window.Labyrinth.Marble(canvas.width / 2, canvas.height / 2, 20);
  const game = new window.Labyrinth.Game(board, marble);
  const renderer = new window.Labyrinth.CanvasRenderer(canvas, board, marble);
  const babylonRenderer = new window.Labyrinth.BabylonRenderer(renderCanvas, board, marble);

  window.__game = game;

  function tick() {
    if (game.gameStatus === 'playing') {
      const tiltX = window.mouseX || 0;
      const tiltY = window.mouseY || 0;
      marble.ax = tiltX * 0.25;
      marble.ay = tiltY * 0.25;
      game.update();
    }

    renderer.render();
    babylonRenderer.syncBallFromModel();
    requestAnimationFrame(tick);
  }

  canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const cx = event.clientX - rect.left;
    const cy = event.clientY - rect.top;
    window.mouseX = (cx - canvas.width / 2) * 0.25;
    window.mouseY = (cy - canvas.height / 2) * 0.25;

    if (babylonRenderer.scene && typeof babylonRenderer.scene.setInclination1 === 'function') {
      babylonRenderer.scene.setInclination1(window.mouseX);
      babylonRenderer.scene.setInclination2(window.mouseY);
    }
  });

  document.getElementById('restart').addEventListener('click', () => {
    game.reset();
    renderer.render();
    babylonRenderer.syncBoardFromModel();
    babylonRenderer.syncBallFromModel();
  });

  renderer.render();
  babylonRenderer.syncBoardFromModel();
  babylonRenderer.syncBallFromModel();
  requestAnimationFrame(tick);
}

if (document.readyState === 'complete') {
  initializeLabyrinth();
} else {
  window.addEventListener('load', initializeLabyrinth);
}
