let buildings = [];
let ground;
let timeOfDay = 0;
let sunPosition;

function setup() {
  createCanvas(800, 600, WEBGL);
  noStroke();

  // Generate buildings
  for (let i = 0; i < 100; i++) {
    let x = random(-400, 400);
    let z = random(-400, 400);
    let w = random(20, 60);
    let h = random(30, 150);
    let d = random(20, 60);
    buildings.push({ x, z, w, h, d });
  }

  // Create ground
  ground = createGraphics(800, 600);
  ground.noStroke();
  for (let i = 0; i < 1000; i++) {
    let x = random(ground.width);
    let y = random(ground.height);
    let sz = random(1, 3);
    let c = color(random(50, 100), random(40, 80), random(20, 60));
    ground.fill(c);
    ground.ellipse(x, y, sz, sz);
  }
}

function draw() {
  background(0);

  // Update time
  timeOfDay += 0.002;
  sunPosition = createVector(
    sin(timeOfDay) * 500,
    cos(timeOfDay) * 300,
    cos(timeOfDay) * 400
  );

  // Ambient light
  ambientLight(50);

  // Sun
  pointLight(255, 255, 255, sunPosition.x, sunPosition.y, sunPosition.z);

  // Draw buildings
  for (let b of buildings) {
    push();
    translate(b.x, b.h / 2, b.z);
    fill(100, 100, 150);
    box(b.w, b.h, b.d);
    pop();
  }

  // Ground shadow
  push();
  rotateX(HALF_PI);
  translate(0, 0, -300);
  fill(0, 0, 0, 100);
  rect(-400, -300, 800, 600);
  pop();

  // Static ground texture
  push();
  rotateX(HALF_PI);
  texture(ground);
  plane(800, 600);
  pop();
}
