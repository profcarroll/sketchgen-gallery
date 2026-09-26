let cameraPosition = { x: 0, y: 0, z: 0 };
let cameraTarget = { x: 0, y: 0, z: 0 };
let time = 0;
let structures = [];
let vegetation = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  // Generate a series of brutalist concrete structures
  for (let i = 0; i < 50; i++) {
    const x = random(-1000, 1000);
    const y = random(-200, 200);
    const z = -i * 300 - 500;
    const width = random(100, 300);
    const height = random(100, 400);
    const depth = random(50, 200);
    structures.push({ x, y, z, width, height, depth });
  }

  // Generate vegetation
  for (let i = 0; i < 300; i++) {
    const x = random(-1000, 1000);
    const y = random(-200, 200);
    const z = -random(500, 3000);
    const size = random(10, 50);
    vegetation.push({ x, y, z, size });
  }
}

function draw() {
  background(50, 50, 55);

  // Animate camera position along a path
  time += 0.003;
  const camX = sin(time * 0.5) * 500;
  const camY = cos(time * 0.3) * 100;
  const camZ = -time * 200;

  cameraPosition = { x: camX, y: camY, z: camZ };
  cameraTarget = { x: camX + sin(time * 0.2), y: camY + cos(time * 0.1), z: camZ - 1000 };

  // Set up the camera
  perspective(PI / 3, width / height, 1, 5000);
  camera(
    cameraPosition.x, cameraPosition.y, cameraPosition.z,
    cameraTarget.x, cameraTarget.y, cameraTarget.z,
    0, 1, 0
  );

  // Draw each structure
  for (let i = 0; i < structures.length; i++) {
    const s = structures[i];

    push();
    translate(s.x, s.y, s.z);

    // Use desaturated colors
    fill(80, 80, 85);
    box(s.width, s.height, s.depth);

    // Add some texture with smaller boxes
    fill(70, 70, 75);
    for (let j = 0; j < 5; j++) {
      const tx = random(-s.width / 2 + 10, s.width / 2 - 10);
      const ty = random(-s.height / 2 + 10, s.height / 2 - 10);
      const tz = random(-s.depth / 2 + 10, s.depth / 2 - 10);
      const tw = random(5, 20);
      const th = random(5, 20);
      const td = random(5, 20);

      push();
      translate(tx, ty, tz);
      box(tw, th, td);
      pop();
    }

    pop();
  }

  // Draw vegetation
  for (let i = 0; i < vegetation.length; i++) {
    const v = vegetation[i];

    push();
    translate(v.x, v.y, v.z);

    // Draw a simple tree-like structure
    fill(30, 100, 30);
    cylinder(v.size * 0.2, v.size * 2);

    // Draw leaves as spheres
    fill(20, 80, 20);
    sphere(v.size * 0.8);

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
