var canvas3D, engine, scene;
var boardWidth = 5;
var boardDepth = 5;
var boardHeight = 0.4;
var ballRadius = 0.35;
var boardRoot;
var boardMesh;
var arrivalMesh;
var ball;
var wallMeshes = [];

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

  if (boardMesh) {
    boardMesh.dispose();
  }
  if (arrivalMesh) {
    arrivalMesh.dispose();
  }

  var boardMat = new BABYLON.StandardMaterial("boardMat", scene);
  boardMat.diffuseColor = new BABYLON.Color3(0.8, 0.54, 0.2);

  boardMesh = BABYLON.MeshBuilder.CreateBox(
    "board",
    { width: boardWidth, height: boardHeight, depth: boardDepth },
    scene
  );
  boardMesh.parent = boardRoot;
  boardMesh.position.y = -0.45;
  boardMesh.material = boardMat;

  if (typeof holes !== "undefined") {
    var boardCSG = BABYLON.CSG.FromMesh(boardMesh);

    holes.forEach(function (holeDef) {
      var center = boardTo3D(holeDef.x0, holeDef.y0);
      var cutter = BABYLON.MeshBuilder.CreateCylinder(
        "holeCutout",
        {
          height: 1.5,
          diameter: 0.72,
          tessellation: 48
        },
        scene
      );
      cutter.parent = boardRoot;
      cutter.position.x = center.x;
      cutter.position.z = center.z;
      cutter.position.y = 0;
      cutter.rotation.x = 0;
      cutter.rotation.z = 0;

      var cutterCSG = BABYLON.CSG.FromMesh(cutter);
      boardCSG.subtractInPlace(cutterCSG);
      cutter.dispose();
    });

    boardMesh.dispose();
    boardMesh = boardCSG.toMesh("board", boardMat, scene, false);
    boardMesh.parent = boardRoot;
    boardMesh.position.y = -0.45;
  }

  if (typeof arrival !== "undefined") {
    var arrivalPos = boardTo3D(arrival.x, arrival.y);
    arrivalMesh = BABYLON.MeshBuilder.CreateCylinder(
      "arrival3D",
      { height: 0.05, diameter: 0.52, tessellation: 24 },
      scene
    );
    arrivalMesh.parent = boardRoot;
    arrivalMesh.position.x = arrivalPos.x;
    arrivalMesh.position.z = arrivalPos.z;
    arrivalMesh.position.y = -0.25 + 0.03;
    arrivalMesh.rotation.x = 0;

    var arrivalMat = new BABYLON.StandardMaterial("arrivalMaterial", scene);
    arrivalMat.diffuseColor = new BABYLON.Color3(0, 1, 0.3);
    arrivalMat.emissiveColor = new BABYLON.Color3(0.1, 0.7, 0.2);
    arrivalMesh.material = arrivalMat;
  }

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
      wallMat.diffuseColor = new BABYLON.Color3(0.45, 0.25, 0.7);
      wallMesh.material = wallMat;
      wallMeshes.push(wallMesh);
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
  boardMesh = BABYLON.MeshBuilder.CreateBox(
    "board",
    { width: boardWidth, height: boardHeight, depth: boardDepth },
    scene
  );
  boardMesh.parent = boardRoot;
  boardMesh.position.y = -0.45;

  var boardMat = new BABYLON.StandardMaterial("boardMat", scene);
  boardMat.diffuseColor = new BABYLON.Color3(0.8, 0.54, 0.2);
  boardMesh.material = boardMat;

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
