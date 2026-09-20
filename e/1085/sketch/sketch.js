let cameraAngle = 0;
let buildingSegments = [];
let trees = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  // Create building segments
  for (let i = 0; i < 20; i++) {
    buildingSegments.push({
      x: random(-300, 300),
      y: random(50, 150),
      z: random(-300, 300),
      width: random(20, 60),
      height: random(80, 150),
      depth: random(20, 60),
    });
  }

  // Create trees
  for (let i = 0; i < 100; i++) {
    trees.push({
      x: random(-400, 400),
      z: random(-400, 400),
      height: random(30, 60),
      trunkWidth: random(3, 8),
      canopyRadius: random(15, 25),
    });
  }
}

function draw() {
  background(30, 40, 30);

  // Slow horizontal camera pan
  cameraAngle += 0.002;
  const camX = sin(cameraAngle) * 800;
  const camZ = cos(cameraAngle) * 800;
  camera(camX, 150, camZ, 0, 100, 0, 0, 1, 0);

  // Draw knoll
  fill(60, 70, 40);
  push();
  translate(0, 100, 0);
  rotateX(PI / 2);
  plane(800, 800);
  pop();

  // Draw building
  fill(100, 100, 100);
  for (let segment of buildingSegments) {
    push();
    translate(segment.x, segment.y, segment.z);
    box(segment.width, segment.height, segment.depth);
    pop();
  }

  // Draw trees
  fill(30, 60, 20);
  for (let tree of trees) {
    push();
    translate(tree.x, 100 + tree.height / 2, tree.z);

    // Trunk
    fill(80, 50, 20);
    cylinder(tree.trunkWidth, tree.height);

    // Canopy
    fill(30, 60, 20);
    sphere(tree.canopyRadius);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
