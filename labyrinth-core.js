var canvas2D, ctx;
var show;
var cW, cH;
var fondW = 5, fondL = fondW, fondH = 0.5;
var x = 200, y = 200, vx = 0, vy = 0, ax = 0, ay = 0, dt = 0.02, ddt = dt / 10;
var rBalle = 20, rT = 30;
var m = 1 / 4;
var reb = 0.8; // inelastic collision between the marble and the wall (see move())
var walls = [], holes = [], w, h;
var g = 1000; // gravity
var ab = 0; // step, marble falls, increases during the fall until the marble hits the ground
var r = 255;

function dimension2X(x) {
  x = -(cW / fondW) * x + cW / 2;
  return x;
}

function dimension2Y(y) {
  y = (cH / fondL) * y + cH / 2;
  return y;
}

function dimension3X(x) {
  x = (x - cW / 2) * (-fondW / cW);
  return x;
}

function dimension3Y(y) {
  y = (y - cH / 2) * (fondL / cH);
  return y;
}

function chute(h) {
  /*
    if (h <= -2 + dBall3D / 2 + terreH) {
      ball.parent = terre;
    }
  */
  if (h > -2 + dBall3D / 2 + terreH) {
    h -= 3 * Math.pow(ab * 0.02, 2) / 2; // dt = 0.02
    ab += 1;
  }
  return h;
}

function move() {
  if (typeof ball === "undefined" || !ball || !scene) {
    if (ctx) {
      draw();
    }
    return;
  }

  vx += ax * dt;
  vy += ay * dt;
  x += vx * dt;
  y += vy * dt;

  for (var i = 0; i < walls.length; i++) {
    w = walls[i];
    var x1 = w.x1, y1 = w.y1, x2 = w.x2, y2 = w.y2, b = 0;

    if (w.testV(x, y) == true) {
      while (w.testV(x, y) == true) {
        x -= vx * ddt;
        y -= vy * ddt;
        b += ddt;
      }
      vx = -vx * reb;
      x += b * vx;
      y += b * vy;
    }

    if (w.testH(x, y) == true) {
      while (w.testH(x, y) == true) {
        x -= vx * ddt;
        y -= vy * ddt;
        b += ddt;
      }
      vy = -vy * reb;
      x += b * vx;
      y += b * vy;
    }

    if (w.extremite1(x, y) == true) {
      while (w.extremite1(x, y) == true) {
        x -= vx * ddt;
        y -= vy * ddt;
        b += ddt;
      }
      vx = (vx * (y1 - y) + vy * (-x1 + x) * (y1 - y) - vx * (x1 - x) - vy * (y1 - y) * (x1 - x)) / Math.pow(rBalle, 2);
      vy = (vx * (y1 - y) + vy * (-x1 + x) * (-x1 + x) - vx * (x1 - x) - vy * (y1 - y) * (y1 - y)) / Math.pow(rBalle, 2);
      x += b * vx;
      y += b * vy;
    }

    if (w.extremite2(x, y) == true) {
      while (w.extremite2(x, y) == true) {
        x -= vx * ddt;
        y -= vy * ddt;
        b += ddt;
      }
      vx = (vx * (y2 - y) + vy * (-x2 + x) * (y2 - y) - vx * (x2 - x) - vy * (y2 - y) * (x1 - x)) / Math.pow(rBalle, 2);
      vy = (vx * (y2 - y) + vy * (-x2 + x) * (-x2 + x) - vx * (x2 - x) - vy * (y2 - y) * (y2 - y)) / Math.pow(rBalle, 2);
      x += b * vx;
      y += b * vy;
    }
  }

  var acx = 0, acy = 0;

  for (var j = 0; j < holes.length; j++) {
    h = holes[j];

    if (h.inside(x, y) == true) {
      var d = Math.sqrt(Math.pow(h.x0 - x, 2) + Math.pow(h.y0 - y, 2)); // distance between the hole center and the marble

      ax -= acx;
      ay -= acy;

      acx = g * Math.tan(Math.asin((rT - d) / rBalle)) * (h.x0 - x) / d; // x component of the centripetal acceleration
      acy = g * Math.tan(Math.asin((rT - d) / rBalle)) * (h.y0 - y) / d; // y component of the centripetal acceleration

      ax += acx;
      ay += acy;
    }

    if (h.fail(x, y) == true) {
      dt = 0;
      ball.position.y = chute(ball.position.y);
      r -= 1;
    }
  }

  ax -= acx;
  ay -= acy;

  draw();
  if (typeof syncBallFromBoard === "function") {
    syncBallFromBoard();
  } else {
    ball.position.z = dimension3Y(y);
    ball.position.x = dimension3X(x);
  }
}

function restart() {
  vx = 0;
  vy = 0;
  ax = 0;
  ay = 0;
}
