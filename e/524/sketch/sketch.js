let buildings = [];
let shadows = [];
let sunAngle = 0;
let timeOfDay = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  noStroke();

  // Generate buildings
  for (let i = 0; i < 50; i++) {
    let x = random(-400, 400);
    let z = random(-300, 300);
    let width = random(20, 60);
    let depth = random(20, 60);
    let height = random(50, 200);
    buildings.push({ x, z, width, depth, height });
  }

  // Precompute shadow geometry
  shadows = new Array(buildings.length);
  for (let i = 0; i < buildings.length; i++) {
    shadows[i] = [];
    const b = buildings[i];
    for (let j = 0; j < 4; j++) {
      let x, z;
      switch(j) {
        case 0: x = b.x - b.width/2; z = b.z - b.depth/2; break;
        case 1: x = b.x + b.width/2; z = b.z - b.depth/2; break;
        case 2: x = b.x + b.width/2; z = b.z + b.depth/2; break;
        case 3: x = b.x - b.width/2; z = b.z + b.depth/2; break;
      }
      shadows[i].push({ x, z });
    }
  }
}

function draw() {
  background(100, 150, 255);

  // Animate sun
  timeOfDay += 0.002;
  sunAngle = map(sin(timeOfDay), -1, 1, -PI/4, PI/4);

  // Draw ground
  fill(80, 120, 60);
  plane(1000, 1000);

  // Draw buildings
  for (let i = 0; i < buildings.length; i++) {
    const b = buildings[i];
    push();
    translate(b.x, 0, b.z);
    fill(180, 150, 120);
    box(b.width, b.height, b.depth);
    pop();
  }

  // Draw shadows
  for (let i = 0; i < buildings.length; i++) {
    const b = buildings[i];
    push();
    translate(0, 0.1, 0); // Slight offset to avoid z-fighting

    // Shadow projection direction
    let shadowX = -sin(sunAngle) * 200;
    let shadowZ = -cos(sunAngle) * 200;

    // Project each corner
    beginShape();
    for (let j = 0; j < 4; j++) {
      const s = shadows[i][j];
      vertex(s.x, 0, s.z);
      vertex(s.x + shadowX, 0, s.z + shadowZ);
    }
    endShape(CLOSE);

    pop();
  }

  // Draw sun
  push();
  translate(200 * cos(timeOfDay), -100, 200 * sin(timeOfDay));
  fill(255, 255, 200);
  sphere(20);
  pop();
}
