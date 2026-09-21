let structures = [];
let cameraZ = 0;
let speed = 0.5;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  // Generate a grid of concrete structures
  for (let x = -30; x <= 30; x += 8) {
    for (let z = -30; z <= 30; z += 8) {
      let y = random(-2, 2);
      structures.push({
        x: x,
        y: y,
        z: z,
        width: random(3, 6),
        height: random(5, 10),
        depth: random(3, 6)
      });
    }
  }
}

function draw() {
  background(40, 45, 50);
  ambientLight(60);
  pointLight(255, 255, 255, 0, -100, 0);

  cameraZ -= speed;

  // Move camera to simulate forward motion
  translate(0, 0, cameraZ);

  // Draw structures
  for (let structure of structures) {
    push();
    translate(structure.x, structure.y, structure.z);
    
    // Base concrete block with weathering details
    fill(120, 115, 110);
    box(structure.width, structure.height, structure.depth);

    // Moss streaks
    fill(30, 60, 30);
    for (let i = 0; i < 3; i++) {
      let wx = random(-structure.width/2, structure.width/2);
      let wz = random(-structure.depth/2, structure.depth/2);
      rect(wx, -structure.height/2 + 1, 1.5, 3);
    }

    // Rust streaks
    fill(80, 20, 20);
    for (let i = 0; i < 2; i++) {
      let wx = random(-structure.width/2, structure.width/2);
      let wz = random(-structure.depth/2, structure.depth/2);
      rect(wx, -structure.height/2 + 1, 1, 2);
    }

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
