let crystals = [];
let grid = [];
let gridSpacing = 60;
let cols, rows;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  frameRate(15);

  cols = ceil(width / gridSpacing) + 2;
  rows = ceil(height / gridSpacing) + 2;

  // Initialize grid
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid.push({
        x: x * gridSpacing - gridSpacing,
        y: y * gridSpacing - gridSpacing,
        z: random(-100, 100),
        active: random() > 0.7
      });
    }
  }

  // Initialize crystals
  for (let i = 0; i < 200; i++) {
    crystals.push({
      x: random(width),
      y: random(height),
      z: random(-300, 300),
      size: random(5, 20),
      hue: random(180, 240),
      saturation: random(60, 90),
      brightness: random(70, 90),
      age: 0,
      maxAge: 100 + floor(random(200)),
      growSpeed: random(0.05, 0.2),
      direction: createVector(random(-1, 1), random(-1, 1), random(-1, 1))
    });
  }
}

function draw() {
  background(240, 10, 5, 1);

  // Camera movement for dynamic view
  let time = millis() * 0.0002;
  camera(
    sin(time) * width * 0.5,
    cos(time * 0.7) * height * 0.3,
    cos(time) * width * 0.5,
    0, 0, 0,
    0, 1, 0
  );

  // Draw grid as crystal lattice structure
  for (let i = 0; i < grid.length; i++) {
    const cell = grid[i];
    if (cell.active) {
      push();
      translate(cell.x, cell.y, cell.z);
      rotateX(time * 0.2 + cell.x * 0.01);
      rotateY(time * 0.3 + cell.y * 0.01);
      fill(180, 20, 80, 0.1);
      box(gridSpacing * 0.5);
      pop();
    }
  }

  // Update and draw crystals
  for (let i = 0; i < crystals.length; i++) {
    const crystal = crystals[i];
    crystal.age++;

    if (crystal.age > crystal.maxAge) {
      crystal.x = random(width);
      crystal.y = random(height);
      crystal.z = random(-300, 300);
      crystal.size = random(5, 20);
      crystal.age = 0;
      crystal.growSpeed = random(0.05, 0.2);
    }

    // Growth
    crystal.size += crystal.growSpeed;

    // Tectonic movement
    crystal.x += crystal.direction.x * 0.5;
    crystal.y += crystal.direction.y * 0.5;
    crystal.z += crystal.direction.z * 0.5;

    // Boundary checks
    if (crystal.x < -width / 2 || crystal.x > width / 2) crystal.direction.x *= -1;
    if (crystal.y < -height / 2 || crystal.y > height / 2) crystal.direction.y *= -1;
    if (crystal.z < -300 || crystal.z > 300) crystal.direction.z *= -1;

    // Draw crystal
    push();
    translate(crystal.x, crystal.y, crystal.z);
    rotateX(time * 0.5 + crystal.x * 0.01);
    rotateY(time * 0.7 + crystal.y * 0.01);
    rotateZ(time * 0.3 + crystal.z * 0.01);

    // Ores glow
    if (crystal.size > 15) {
      fill(crystal.hue, crystal.saturation, crystal.brightness, 0.9);
      sphere(crystal.size * 0.8);
      fill(crystal.hue + 20, 100, 100, 0.5);
      sphere(crystal.size * 0.6);
    } else {
      fill(crystal.hue, crystal.saturation, crystal.brightness, 0.7);
      sphere(crystal.size);
    }
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = ceil(width / gridSpacing) + 2;
  rows = ceil(height / gridSpacing) + 2;
}
