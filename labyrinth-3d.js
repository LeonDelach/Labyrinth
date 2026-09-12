var canvas3D, engine, scene;
var fondW = 5,
  fondL = fondW,
  fondH = 0.5;
var wallW = fondH,
  wallH = 1;
var terreW = fondW * 1.5, terreH = 0.2;
var angleFact = 0.02;
var fond, terre;
var dBall3D = rBalle / 40;
var material;
var ball;

function load3D() {
  canvas3D = document.getElementById("renderCanvas");
  engine = new BABYLON.Engine(canvas3D, true);
  scene = createScene();

  engine.runRenderLoop(function () {
    scene.render();
  });

  window.addEventListener("resize", function () {
    engine.resize();
  });
}

var createScene = function () {
  scene = new BABYLON.Scene(engine);

  var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, BABYLON.Vector3.Zero(), scene);
  camera.setPosition(new BABYLON.Vector3(0, 10, 10));
  camera.attachControl(canvas3D, true);

  var light2 = new BABYLON.SpotLight("Dir0", new BABYLON.Vector3(0, 10, 0),
    new BABYLON.Vector3(0, -10, 0),
    1,
    1,
    scene);

  fond = new BABYLON.Mesh.CreateBox("basement", fondW, scene);
  fond.scaling.y = fondH / fondW;
  fond.bakeCurrentTransformIntoVertices();

  material = new BABYLON.StandardMaterial("kosh", scene);
  material.diffuseColor = new BABYLON.Color3(1, 0, 1);
  material.specularColor = new BABYLON.Color3(1, 1, 0);
  fond.material = material;

  fond.bakeCurrentTransformIntoVertices();

  ball = new BABYLON.Mesh.CreateSphere("sphere", 10, dBall3D, scene);
  ball.position.y = fondH / 2 + dBall3D / 2;

  move();

  new hole3D(-1, -1);

  ball.parent = fond;

  new wall3D(2.25, -2.5, 2.25, 2.5);
  new wall3D(2.5, 2.25, -2.5, 2.25);
  new wall3D(-2.25, -2.5, -2.25, 2.5);
  new wall3D(2.5, -2.25, -2.5, -2.25);
  new wall3D(1, -1, 1, 1);

  terre = new BABYLON.Mesh.CreateBox("wall", terreW, scene);
  terre.scaling.y = terreH / terreW;
  terre.position.y = -2;
  terre.material = new BABYLON.StandardMaterial("texture1", scene);
  terre.material.diffuseTexture = new BABYLON.Texture("grass.jpg", scene);
  terre.material.specularColor = new BABYLON.Color3(0, 0, 0);

  var shadowGenerator = new BABYLON.ShadowGenerator(1024, light2);
  shadowGenerator.getShadowMap().renderList.push(ball);
  fond.receiveShadows = true;

  scene.beforeRender = function () {};

  scene.setInclination1 = function (x, y) {
    fond.rotation.z = x * angleFact;
  };

  scene.setInclination2 = function (z, y) {
    fond.rotation.x = z * angleFact;
  };

  return scene;
};

function wall3D(X1, Y1, X2, Y2) {
  var W, D;
  if (X1 == X2 && Y1 != Y2) {
    W = wallW;
    D = Math.abs(Y1 - Y2);
    walls.push(new wall(dimension2X(X1 - W / 2), dimension2Y(Y1), dimension2X(X2 - W / 2), dimension2Y(Y2)));
    walls.push(new wall(dimension2X(X1 + W / 2), dimension2Y(Y1), dimension2X(X2 + W / 2), dimension2Y(Y2)));
    walls.push(new wall(dimension2X(X1 + W / 2), dimension2Y(Y1), dimension2X(X1 - W / 2), dimension2Y(Y1)));
    walls.push(new wall(dimension2X(X2 + W / 2), dimension2Y(Y2), dimension2X(X2 - W / 2), dimension2Y(Y2)));
  }

  if (X1 != X2 && Y1 == Y2) {
    W = Math.abs(X1 - X2);
    D = wallW;
    walls.push(new wall(dimension2X(X1), dimension2Y(Y1 - D / 2), dimension2X(X2), dimension2Y(Y2 - D / 2)));
    walls.push(new wall(dimension2X(X1), dimension2Y(Y1 + D / 2), dimension2X(X2), dimension2Y(Y2 + D / 2)));
    walls.push(new wall(dimension2X(X1), dimension2Y(Y1 - D / 2), dimension2X(X1), dimension2Y(Y1 + D / 2)));
    walls.push(new wall(dimension2X(X2), dimension2Y(Y2 - D / 2), dimension2X(X2), dimension2Y(Y2 + D / 2)));
  }

  this.mur = new BABYLON.Mesh.CreateBox("wall", fondL, scene);
  this.mur.scaling.x = W / fondL;
  this.mur.scaling.z = D / fondL;
  this.mur.scaling.y = wallH / fondW;
  this.mur.position.y = fondH / 2 + wallH / 2;
  this.mur.position.x = (X1 + X2) / 2;
  this.mur.position.z = (Y1 + Y2) / 2;
  this.mur.parent = fond;
}

function hole3D(X0, Y0) {
  holes.push(new hole(dimension2X(X0), dimension2Y(Y0)));

  this.trou = new BABYLON.Mesh.CreateCylinder("hole", 2, rT / 40, rT / 40, 20, 1, scene);
  this.trou.position.y = fond.position.y - fondH;
  this.trou.position.x = X0;
  this.trou.position.z = Y0;

  var fondCSG = BABYLON.CSG.FromMesh(fond);
  var trouCSG = BABYLON.CSG.FromMesh(this.trou);

  var fondT = fondCSG.subtract(trouCSG);
  fondT.material = material;

  fond.dispose();
  this.trou.dispose();

  fond = fondT.toMesh("csg", material, scene);
  fond.bakeCurrentTransformIntoVertices();
}
