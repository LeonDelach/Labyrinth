window.Labyrinth = window.Labyrinth || {};
window.Labyrinth.Presets = window.Labyrinth.Presets || {};

window.Labyrinth.Presets.labyrinth2 = {
  name: 'labyrinth2',
  start: { x: 360, y: 360 },
  arrival: { x: 30, y: 30, radius: 18 },
  holes: [
    { x0: 70, y0: 90, radius: 18 },
    { x0: 180, y0: 120, radius: 18 },
    { x0: 275, y0: 200, radius: 20 },
    { x0: 330, y0: 90, radius: 18 },
    { x0: 110, y0: 290, radius: 18 },
    { x0: 220, y0: 320, radius: 18 }
  ],
  walls: [
    { x1: 0, y1: 0, x2: 400, y2: 0 },
    { x1: 400, y1: 0, x2: 400, y2: 400 },
    { x1: 0, y1: 400, x2: 400, y2: 400 },
    { x1: 0, y1: 0, x2: 0, y2: 400 },
    { x1: 60, y1: 50, x2: 60, y2: 130 },
    { x1: 60, y1: 170, x2: 60, y2: 240 },
    { x1: 60, y1: 290, x2: 60, y2: 360 },
    { x1: 120, y1: 90, x2: 240, y2: 90 },
    { x1: 120, y1: 170, x2: 200, y2: 170 },
    { x1: 240, y1: 170, x2: 320, y2: 170 },
    { x1: 150, y1: 250, x2: 150, y2: 340 },
    { x1: 220, y1: 230, x2: 220, y2: 340 },
    { x1: 300, y1: 110, x2: 300, y2: 200 },
    { x1: 300, y1: 250, x2: 300, y2: 360 },
    { x1: 150, y1: 60, x2: 350, y2: 60 },
    { x1: 330, y1: 120, x2: 400, y2: 120 },
    { x1: 80, y1: 210, x2: 270, y2: 210 },
    { x1: 80, y1: 300, x2: 350, y2: 300 },
    { x1: 350, y1: 210, x2: 350, y2: 320 }
  ]
};

window.Labyrinth.BoardPresets = window.Labyrinth.BoardPresets || {};
window.Labyrinth.BoardPresets.labyrinth2 = window.Labyrinth.Presets.labyrinth2;
