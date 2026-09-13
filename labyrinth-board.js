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
    ctx.strokeStyle = "#5a2b8f";
    ctx.lineWidth = 8;
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

var arrival = {
  x: 350,
  y: 60,
  radius: 18,
  draw: function () {
    ctx.fillStyle = "#00cc66";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
};

function buildBoard() {
  walls.length = 0;
  holes.length = 0;

  walls.push(new wall(0, 0, 400, 0));
  walls.push(new wall(400, 0, 400, 400));
  walls.push(new wall(0, 400, 400, 400));
  walls.push(new wall(0, 0, 0, 400));

  walls.push(new wall(120, 100, 280, 100));
  walls.push(new wall(280, 100, 280, 300));
  walls.push(new wall(80, 300, 240, 300));

  arrival.x = 350;
  arrival.y = 60;
  holes.push(new hole(330, 330));
}
