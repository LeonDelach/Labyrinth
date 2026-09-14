window.Labyrinth = window.Labyrinth || {};
window.Labyrinth.Presets = window.Labyrinth.Presets || {};

window.Labyrinth.Presets.labyrinth1 = {
  name: 'labyrinth1',
  start: { x: 350, y: 350 },
  arrival: { x: 35, y: 35, radius: 18 },
  holes: [
    { x0: 100, y0: 120, radius: 18 },
    { x0: 185, y0: 220, radius: 16 },
    { x0: 260, y0: 125, radius: 20 },
    { x0: 335, y0: 300, radius: 22 },
    { x0: 120, y0: 330, radius: 18 },
    { x0: 345, y0: 175, radius: 18 }
  ],
  walls: [
    { x1: 0, y1: 0, x2: 400, y2: 0 },
    { x1: 400, y1: 0, x2: 400, y2: 400 },
    { x1: 0, y1: 400, x2: 400, y2: 400 },
    { x1: 0, y1: 0, x2: 0, y2: 400 },
    { x1: 70, y1: 40, x2: 70, y2: 160 },
    { x1: 70, y1: 220, x2: 70, y2: 400 },
    { x1: 140, y1: 70, x2: 140, y2: 210 },
    { x1: 140, y1: 290, x2: 140, y2: 340 },
    { x1: 210, y1: 60, x2: 210, y2: 180 },
    { x1: 210, y1: 240, x2: 210, y2: 360 },
    { x1: 290, y1: 90, x2: 290, y2: 210 },
    { x1: 290, y1: 300, x2: 290, y2: 360 },
    { x1: 350, y1: 50, x2: 350, y2: 170 },
    { x1: 350, y1: 240, x2: 350, y2: 330 },
    { x1: 40, y1: 100, x2: 170, y2: 100 },
    { x1: 200, y1: 100, x2: 250, y2: 100 },
    { x1: 310, y1: 100, x2: 400, y2: 100 },
    { x1: 40, y1: 180, x2: 110, y2: 180 },
    { x1: 170, y1: 180, x2: 260, y2: 180 },
    { x1: 300, y1: 180, x2: 400, y2: 180 },
    { x1: 80, y1: 260, x2: 170, y2: 260 },
    { x1: 220, y1: 260, x2: 300, y2: 260 },
    { x1: 330, y1: 260, x2: 400, y2: 260 },
    { x1: 40, y1: 340, x2: 150, y2: 340 },
    { x1: 200, y1: 340, x2: 250, y2: 340 },
    { x1: 300, y1: 340, x2: 400, y2: 340 }
  ]
};

window.Labyrinth.BoardPresets = window.Labyrinth.BoardPresets || {};
window.Labyrinth.BoardPresets.labyrinth1 = window.Labyrinth.Presets.labyrinth1;
