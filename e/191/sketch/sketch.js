let buildings = [];
let cars = [];
let cameraX = 0;
let cameraY = 0;
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  // Generate buildings
  for (let i = 0; i < 200; i++) {
    let x = random(-1000, 1000);
    let z = random(-1000, 1000);
    let width = random(40, 80);
    let height = random(60, 200);
    let depth = random(40, 80);
    buildings.push({ x, z, width, height, depth });
  }

  // Generate cars
  for (let i = 0; i < 50; i++) {
    let x = random(-1000, 1000);
    let z = random(-1000, 1000);
    let speed = random(0.5, 2);
    cars.push({ x, z, speed });
  }
}

function draw() {
  background(30, 40, 60);

  // Camera movement
  if (isDragging) {
    cameraX += (mouseX - lastMouseX) * 0.5;
    cameraY += (mouseY - lastMouseY) * 0.5;
  }
  lastMouseX = mouseX;
  lastMouseY = mouseY;

  // Lighting
  ambientLight(60);
  pointLight(255, 255, 255, 0, -300, 500);

  // Draw ground
  push();
  translate(0, 100, 0);
  rotateX(HALF_PI);
  fill(50, 70, 90);
  plane(2000, 2000);
  pop();

  // Draw buildings
  for (let b of buildings) {
    push();
    translate(b.x - cameraX, 0, b.z - cameraY);
    fill(80, 100, 130);
    box(b.width, b.height, b.depth);
    pop();
  }

  // Draw roads
  for (let i = 0; i < 20; i++) {
    let x = map(i, 0, 20, -1000, 1000);
    push();
    translate(x - cameraX, 95, 0);
    fill(40, 40, 40);
    box(80, 10, 2000);
    pop();
  }

  // Draw cars
  for (let c of cars) {
    c.x += c.speed;
    if (c.x > 1000) c.x = -1000;
    push();
    translate(c.x - cameraX, 85, c.z - cameraY);
    fill(220, 60, 60);
    box(30, 15, 60);
    pop();
  }
}

function mousePressed() {
  isDragging = true;
}

function mouseReleased() {
  isDragging = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
