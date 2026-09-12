var canvas2D, ctx;
var show;
var cW, cH;
var x = 200, y = 200, vx = 0, vy = 0, ax = 0, ay = 0, dt = 0.02, ddt = dt / 10;
var rBalle = 20, rT = 30;
var m = 1 / 4;
var reb = 0.8; // inelastic collision between the marble and the wall (see move())
var walls = [], holes = [], w, h;
var g = 1000; // gravity
var ab = 0; // step, marble falls, increases during the fall until the marble hits the ground
var r = 255;

var Position = {
  get: function (obj) {
    var curleft = curtop = 0;
    if (obj.offsetParent) {
      do {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
      } while ((obj = obj.offsetParent));
    }
    return { x: curleft, y: curtop }; // position of the top-left corner relative to the window
  }
};

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

function wall(x1, y1, x2, y2) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;

  this.testV = function (x, y) {
    return (x1 == x2 && y <= y2 && y >= y1 && x < x1 + rBalle && x > x1 - rBalle); // vertical walls: x1 = x2 and y2 > y1
  };

  this.testH = function (x, y) {
    return (y1 == y2 && x <= x2 && x >= x1 && y < y1 + rBalle && y > y1 - rBalle); // horizontal walls: y1 = y2 and x2 > x1
  };

  this.draw = function () {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  this.extremite1 = function (x, y) {
    return (Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2), 2) < rBalle);
  };

  this.extremite2 = function (x, y) {
    return (Math.sqrt(Math.pow(x - x2, 2) + Math.pow(y - y2, 2), 2) < rBalle); // we test whether the distance between the 2 ends of the wall and the marble is below rBalle
  };
}

function hole(x0, y0) {
  this.x0 = x0;
  this.y0 = y0;

  this.inside = function (x, y) {
    return (rT > Math.sqrt(Math.pow(x0 - x, 2) + Math.pow(y0 - y, 2), 2) && rT - rBalle < Math.sqrt(Math.pow(x0 - x, 2) + Math.pow(y0 - y, 2), 2)); // inside the hole
  };

  this.fail = function (x, y) {
    return (rT - rBalle >= Math.sqrt(Math.pow(x0 - x, 2) + Math.pow(y0 - y, 2), 2));
  };

  this.draw = function () {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(x0, y0, rT, 0, 2 * Math.PI);
    ctx.fill();
  };
}

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
  ball.position.z = dimension3Y(y);
  ball.position.x = dimension3X(x);
}

function load2D() {
  show = document.getElementById("show");
  canvas2D = document.getElementById("dessin");
  ctx = canvas2D.getContext('2d');

  canvas2D.onmousemove = function (event) {
    ax = (event.clientX - Position.get(canvas2D).x - cW / 2) * m;
    ay = (event.clientY - Position.get(canvas2D).y - cH / 2) * m;
    scene.setInclination1(ax / 10);
    scene.setInclination2(ay / 10);
  };

  cW = canvas2D.width;
  cH = canvas2D.height;
  x = cW / 2;
  y = cH / 2;
  draw();
  var anim = setInterval(move, dt * 1000); // run move() regularly
}

function restart() {
  vx = 0;
  vy = 0;
  ax = 0;
  ay = 0;
}
