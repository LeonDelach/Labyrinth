window.Labyrinth = window.Labyrinth || {};
window.Labyrinth.Presets = window.Labyrinth.Presets || {};

window.Labyrinth.Presets.playground = {
  name: 'playground',
  start: { x: 350, y: 350 },
  arrival: { x: 350, y: 60, radius: 18 },
  holes: [
    { x0: 330, y0: 330, radius: 30 }
  ],
  walls: [
    { x1: 0, y1: 0, x2: 400, y2: 0 },
    { x1: 400, y1: 0, x2: 400, y2: 400 },
    { x1: 0, y1: 400, x2: 400, y2: 400 },
    { x1: 0, y1: 0, x2: 0, y2: 400 },
    { x1: 120, y1: 100, x2: 280, y2: 100 },
    { x1: 280, y1: 100, x2: 280, y2: 300 },
    { x1: 80, y1: 300, x2: 240, y2: 300 }
  ]
};

window.Labyrinth.BoardPresets = window.Labyrinth.BoardPresets || {};
window.Labyrinth.BoardPresets.playground = window.Labyrinth.Presets.playground;
