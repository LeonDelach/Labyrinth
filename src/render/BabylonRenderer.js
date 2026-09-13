/**
 * 3D renderer built on Babylon.js.
 * It mirrors the same board state in a separate visual layer.
 */
class BabylonRenderer {
  constructor(canvas, board, marble) {
    this.canvas = canvas;
    this.board = board;
    this.marble = marble;
    this.engine = new BABYLON.Engine(canvas, true);
    this.scene = new BABYLON.Scene(this.engine);
    this.boardRoot = new BABYLON.TransformNode('boardRoot');
    this.boardMesh = null;
    this.arrivalMesh = null;
    this.wallMeshes = [];
    this.ballMesh = null;

    this.setupScene();
  }

  setupScene() {
    const camera = new BABYLON.ArcRotateCamera(
      'Camera',
      -Math.PI / 2,
      Math.PI / 2.5,
      8,
      new BABYLON.Vector3(0, 0.5, 0),
      this.scene
    );
    camera.attachControl(this.canvas, true);
    camera.setTarget(new BABYLON.Vector3(0, 0.3, 0));

    const hemi = new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(0, 1, 0), this.scene);
    hemi.intensity = 1.1;

    this.createBoardMesh();
    this.createBallMesh();
    this.syncBoardFromModel();
    this.syncBallFromModel();

    this.scene.setInclination1 = (tiltX) => {
      this.boardRoot.rotation.z = tiltX * 0.12;
    };

    this.scene.setInclination2 = (tiltY) => {
      this.boardRoot.rotation.x = tiltY * 0.12;
    };

    this.engine.runRenderLoop(() => this.scene.render());
    window.addEventListener('resize', () => this.engine.resize());
  }

  boardTo3D(x2D, y2D) {
    return {
      x: ((x2D - this.board.width / 2) / (this.board.width / 2)) * 2.5,
      z: -((y2D - this.board.height / 2) / (this.board.height / 2)) * 2.5
    };
  }

  createBoardMesh() {
    const boardMat = new BABYLON.StandardMaterial('boardMat', this.scene);
    boardMat.diffuseColor = new BABYLON.Color3(0.8, 0.54, 0.2);

    this.boardMesh = BABYLON.MeshBuilder.CreateBox(
      'board',
      { width: 5, height: 0.4, depth: 5 },
      this.scene
    );
    this.boardMesh.parent = this.boardRoot;
    this.boardMesh.position.y = -0.45;
    this.boardMesh.material = boardMat;
  }

  createBallMesh() {
    this.ballMesh = BABYLON.MeshBuilder.CreateSphere(
      'ball',
      { diameter: 0.7 },
      this.scene
    );
    this.ballMesh.parent = this.boardRoot;
    this.ballMesh.position.y = 0.35;

    const ballMat = new BABYLON.StandardMaterial('ballMat', this.scene);
    ballMat.diffuseColor = new BABYLON.Color3(1, 0.2, 0.2);
    this.ballMesh.material = ballMat;
  }

  syncBoardFromModel() {
    this.wallMeshes.forEach((mesh) => mesh.dispose());
    this.wallMeshes = [];

    if (this.arrivalMesh) {
      this.arrivalMesh.dispose();
      this.arrivalMesh = null;
    }

    if (this.board.arrival) {
      const arrivalPos = this.boardTo3D(this.board.arrival.x, this.board.arrival.y);
      this.arrivalMesh = BABYLON.MeshBuilder.CreateCylinder(
        'arrival3D',
        { height: 0.05, diameter: 0.52, tessellation: 24 },
        this.scene
      );
      this.arrivalMesh.parent = this.boardRoot;
      this.arrivalMesh.position.x = arrivalPos.x;
      this.arrivalMesh.position.z = arrivalPos.z;
      this.arrivalMesh.position.y = -0.22;

      const arrivalMat = new BABYLON.StandardMaterial('arrivalMaterial', this.scene);
      arrivalMat.diffuseColor = new BABYLON.Color3(0, 1, 0.3);
      arrivalMat.emissiveColor = new BABYLON.Color3(0.1, 0.7, 0.2);
      this.arrivalMesh.material = arrivalMat;
    }

    this.board.walls.forEach((wallDef) => {
      const p1 = this.boardTo3D(wallDef.x1, wallDef.y1);
      const p2 = this.boardTo3D(wallDef.x2, wallDef.y2);
      const dx = p2.x - p1.x;
      const dz = p2.z - p1.z;
      const length = Math.sqrt(dx * dx + dz * dz);
      const angle = Math.atan2(dx, dz);

      const wallMesh = BABYLON.MeshBuilder.CreateBox(
        'wall3D',
        { width: 0.18, height: 0.9, depth: Math.max(length, 0.2) },
        this.scene
      );
      wallMesh.parent = this.boardRoot;
      wallMesh.position.x = (p1.x + p2.x) / 2;
      wallMesh.position.z = (p1.z + p2.z) / 2;
      wallMesh.position.y = 0.25;
      wallMesh.rotation.y = -angle;

      const material = new BABYLON.StandardMaterial('wallMaterial', this.scene);
      material.diffuseColor = new BABYLON.Color3(0.45, 0.25, 0.7);
      wallMesh.material = material;
      this.wallMeshes.push(wallMesh);
    });
  }

  syncBallFromModel() {
    if (!this.ballMesh) {
      return;
    }

    const pos = this.boardTo3D(this.marble.x, this.marble.y);
    this.ballMesh.position.x = pos.x;
    this.ballMesh.position.z = pos.z;
    this.ballMesh.position.y = 0.35;
  }
}

window.Labyrinth = window.Labyrinth || {};
window.Labyrinth.BabylonRenderer = BabylonRenderer;
