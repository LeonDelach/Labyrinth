var canvas3D, engine, scene;
var boardWidth = 5;
var boardDepth = 5;
var boardHeight = 0.4;
var ballRadius = 0.35;
var boardRoot;
var ball;
var wallMeshes = [];
var holeMeshes = [];

function wallTo3D(point) {
  if (typeof cW === "undefined" || typeof cH === "undefined" || cW === 0 || cH === 0) {
    return { x: 0, z: 0 };
  }

  return {
    x: ((point.x - cW / 2) / (cW / 2)) * (boardWidth / 2),
    z: -((point.y - cH / 2) / (cH / 2)) * (boardDepth / 2)
  };
}

function Wall3D(options) {
  this.mesh = BABYLON.MeshBuilder.CreateBox(
    options.name || "wall",
    {
      width: options.width,
      height: options.height,
      depth: options.depth
    },
    scene
  );

  this.mesh.position.x = options.x || 0;
  this.mesh.position.y = (options.height || 1) / 2;
  this.mesh.position.z = options.z || 0;

  var material = new BABYLON.StandardMaterial(options.name + "Material", scene);
  material.diffuseColor = new BABYLON.Color3(0.6, 0.35, 0.15);
  this.mesh.material = material;

  return this;
}

function Hole3D(options) {
  this.mesh = BABYLON.MeshBuilder.CreateCylinder(
    options.name || "hole",
    {
      height: options.height || 0.2,
      diameter: options.diameter || 0.8,
      tessellation: 30
    },
    scene
  );

  this.mesh.position.x = options.x || 0;
  this.mesh.position.y = -(boardHeight / 2) - 0.02;
  this.mesh.position.z = options.z || 0;
  this.mesh.rotation.x = Math.PI / 2;

  var material = new BABYLON.StandardMaterial(options.name + "Material", scene);
  material.diffuseColor = new BABYLON.Color3(0.08, 0.08, 0.1);
  this.mesh.material = material;

  return this;
}

function boardTo3D(x2D, y2D) {
  if (typeof cW === "undefined" || typeof cH === "undefined" || cW === 0 || cH === 0) {
    return { x: 0, z: 0 };
  }

  return {
    x: ((x2D - cW / 2) / (cW / 2)) * (boardWidth / 2),
    z: -((y2D - cH / 2) / (cH / 2)) * (boardDepth / 2)
  };
}

function syncBallFromBoard() {
  if (!ball || typeof x === "undefined" || typeof y === "undefined") {
    return;
  }

  var pos = boardTo3D(x, y);
  ball.position.x = pos.x;
  ball.position.z = pos.z;
  ball.position.y = 0.35;
}

function syncBoardGeometryFrom2D() {
  if (!scene || !boardRoot) {
    return;
  }

  wallMeshes.forEach(function (mesh) {
    mesh.dispose();
  });
  wallMeshes = [];

  holeMeshes.forEach(function (mesh) {
    mesh.dispose();
  });
  holeMeshes = [];

  if (typeof walls !== "undefined") {
    walls.forEach(function (wallDef) {
      var p1 = wallTo3D({ x: wallDef.x1, y: wallDef.y1 });
      var p2 = wallTo3D({ x: wallDef.x2, y: wallDef.y2 });
      var dx = p2.x - p1.x;
      var dz = p2.z - p1.z;
      var length = Math.sqrt(dx * dx + dz * dz);
      var angle = Math.atan2(dx, dz);
      var wallMesh = BABYLON.MeshBuilder.CreateBox(
        "wall3D",
        { width: 0.18, height: 0.9, depth: Math.max(length, 0.2) },
        scene
      );
      wallMesh.parent = boardRoot;
      wallMesh.position.x = (p1.x + p2.x) / 2;
      wallMesh.position.z = (p1.z + p2.z) / 2;
      wallMesh.position.y = 0.25;
      wallMesh.rotation.y = -angle;

      var wallMat = new BABYLON.StandardMaterial("wallMaterial", scene);
      wallMat.diffuseColor = new BABYLON.Color3(0.5, 0.28, 0.12);
      wallMesh.material = wallMat;
      wallMeshes.push(wallMesh);
    });
  }

  if (typeof holes !== "undefined") {
    holes.forEach(function (holeDef) {
      var center = boardTo3D(holeDef.x0, holeDef.y0);
      var holeMesh = new Hole3D({
        name: "hole3D",
        x: center.x,
        z: center.z,
        diameter: 0.72,
        height: 0.12
      });
      holeMesh.mesh.parent = boardRoot;
      holeMeshes.push(holeMesh.mesh);
    });
  }
}

function load3D() {
  canvas3D = document.getElementById("renderCanvas");

  if (!canvas3D) {
    console.error("renderCanvas not found");
    return;
  }

  engine = new BABYLON.Engine(canvas3D, true);
  scene = new BABYLON.Scene(engine);

  var camera = new BABYLON.ArcRotateCamera(
    "Camera",
    -Math.PI / 2,
    Math.PI / 2.5,
    8,
    new BABYLON.Vector3(0, 0.5, 0),
    scene
  );
  camera.attachControl(canvas3D, true);
  camera.setTarget(new BABYLON.Vector3(0, 0.3, 0));

  var hemi = new BABYLON.HemisphericLight(
    "hemi",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  hemi.intensity = 1.1;

  boardRoot = new BABYLON.TransformNode("boardRoot");
  var board = BABYLON.MeshBuilder.CreateBox(
    "board",
    { width: boardWidth, height: boardHeight, depth: boardDepth },
    scene
  );
  board.parent = boardRoot;
  board.position.y = -0.45;

  var boardMat = new BABYLON.StandardMaterial("boardMat", scene);
  boardMat.diffuseColor = new BABYLON.Color3(0.8, 0.54, 0.2);
  board.material = boardMat;

  ball = BABYLON.MeshBuilder.CreateSphere(
    "ball",
    { diameter: ballRadius * 2 },
    scene
  );
  ball.parent = boardRoot;
  ball.position.y = 0.35;
  ball.position.x = 0;
  ball.position.z = 0;

  var ballMat = new BABYLON.StandardMaterial("ballMat", scene);
  ballMat.diffuseColor = new BABYLON.Color3(1, 0.2, 0.2);
  ball.material = ballMat;

  scene.setInclination1 = function (tiltX) {
    boardRoot.rotation.z = tiltX * 0.12;
  };

  scene.setInclination2 = function (tiltY) {
    boardRoot.rotation.x = tiltY * 0.12;
  };

  if (typeof buildBoard === "function") {
    buildBoard();
  }

  syncBoardGeometryFrom2D();
  syncBallFromBoard();

  engine.runRenderLoop(function () {
    scene.render();
  });

  window.addEventListener("resize", function () {
    engine.resize();
  });

  return scene;
}
