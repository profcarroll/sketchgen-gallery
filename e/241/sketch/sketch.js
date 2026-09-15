let buildings = [];
let cars = [];
let cameraAngle = 0;
let cameraElevation = 0;
let cameraDistance = 300;
let isDragging = false;
let lastMouseX, lastMouseY;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  // Generate buildings
  for (let i = 0; i < 200; i++) {
    let x = random(-1000, 1000);
    let z = random(-1000, 1000);
    let width = random(30, 80);
    let depth = random(30, 80);
    let height = random(50, 200);
    buildings.push({ x, z, width, depth, height });
  }

  // Generate cars
  for (let i = 0; i < 100; i++) {
    let x = random(-1000, 1000);
    let z = random(-1000, 1000);
    let speed = random(0.5, 3);
    let angle = random(TWO_PI);
    cars.push({ x, z, speed, angle });
  }
}

function draw() {
  background(50, 80, 120);

  // Camera controls
  if (isDragging) {
    cameraAngle += (mouseX - lastMouseX) * 0.01;
    cameraElevation -= (mouseY - lastMouseY) * 0.01;
    cameraElevation = constrain(cameraElevation, -PI/4, PI/4);
  }

  // Camera position
  let camX = sin(cameraAngle) * cameraDistance;
  let camZ = cos(cameraAngle) * cameraDistance;
  camera(camX, height/2 + cameraElevation * 100, camZ, 0, 0, 0, 0, 1, 0);

  // Draw ground
  fill(100);
  plane(2000, 2000);

  // Draw buildings
  for (let building of buildings) {
    push();
    translate(building.x, 0, building.z);
    fill(80, 100, 140);
    box(building.width, building.height, building.depth);
    
    // Windows
    fill(255, 255, 200, 150);
    for (let x = -building.width/2 + 5; x < building.width/2; x += 10) {
      for (let z = -building.depth/2 + 5; z < building.depth/2; z += 10) {
        if (random() > 0.3) {
          push();
          translate(x, random(0, building.height), z);
          box(4, 8, 4);
          pop();
        }
      }
    }
    pop();
  }

  // Draw cars
  for (let car of cars) {
    push();
    translate(car.x, 0, car.z);
    rotateY(car.angle);
    
    // Car body
    fill(200, 50, 50);
    box(15, 8, 6);
    
    // Car lights
    fill(255, 255, 0);
    push();
    translate(7, 4, 0);
    sphere(2);
    pop();
    
    // Move car
    car.x += cos(car.angle) * car.speed;
    car.z += sin(car.angle) * car.speed;
    
    // Wrap around
    if (car.x > 1000) car.x = -1000;
    if (car.x < -1000) car.x = 1000;
    if (car.z > 1000) car.z = -1000;
    if (car.z < -1000) car.z = 1000;
    
    pop();
  }

  // Update last mouse position
  if (isDragging) {
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

function mousePressed() {
  isDragging = true;
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function mouseReleased() {
  isDragging = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
