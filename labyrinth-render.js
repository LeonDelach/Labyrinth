function draw() {
  ctx.fillStyle = "orange";
  ctx.fillRect(0, 0, cW, cH);

  for (var j = 0; j < holes.length; j++) {
    h = holes[j];
    h.draw();
  }

  ctx.fillStyle = "rgb(" + r + ", 0, 0)";
  ctx.beginPath();
  ctx.arc(x, y, rBalle, 0, 2 * Math.PI);
  ctx.fill();

  for (var i = 0; i < walls.length; i++) {
    w = walls[i];
    w.draw();
  }
}

function load2D() {
  show = document.getElementById("show");
  canvas2D = document.getElementById("dessin");
  ctx = canvas2D.getContext('2d');

  canvas2D.onmousemove = function (event) {
    ax = (event.clientX - Position.get(canvas2D).x - cW / 2) * m;
    ay = (event.clientY - Position.get(canvas2D).y - cH / 2) * m;
    if (scene && typeof scene.setInclination1 === "function") {
      scene.setInclination1(ax / 10);
      scene.setInclination2(ay / 10);
    }
  };

  cW = canvas2D.width;
  cH = canvas2D.height;

  if (typeof buildBoard === "function") {
    buildBoard();
  }

  x = cW / 2;
  y = cH / 2;
  draw();
  var anim = setInterval(move, dt * 1000); // run move() regularly
}
