let cameraX = 0;
let cameraY = 0;
let cameraZ = 500;
let moveSpeed = 5;
let attackCooldown = 0;
let attackEffect = null;

const gridSize = 20;
const cellSize = 100;
const buildings = [];
const roads = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Generate city grid
  for (let x = -gridSize; x <= gridSize; x++) {
    for (let z = -gridSize; z <= gridSize; z++) {
      if (random() > 0.3) { // Randomly place buildings
        const height = random(50, 200);
        buildings.push({ x: x * cellSize, z: z * cellSize, height });
      } else {
        roads.push({ x: x * cellSize, z: z * cellSize });
      }
    }
  }
}

function draw() {
  background(100, 150, 200);
  
  // Camera controls
  cameraX += (mouseX - width/2) * 0.01;
  cameraY += (mouseY - height/2) * 0.01;
  
  // Apply camera position
  translate(-cameraX, -cameraY, -cameraZ);
  rotateY(cameraX * 0.001);
  rotateX(cameraY * 0.001);
  
  // Draw roads
  fill(80, 80, 80);
  noStroke();
  for (let road of roads) {
    push();
    translate(road.x, 0, road.z);
    box(cellSize, 5, cellSize);
    pop();
  }
  
  // Draw buildings
  fill(150, 150, 150);
  noStroke();
  for (let building of buildings) {
    push();
    translate(building.x, building.height/2, building.z);
    box(cellSize * 0.8, building.height, cellSize * 0.8);
    pop();
  }
  
  // Draw attack effect
  if (attackCooldown > 0) {
    attackCooldown--;
    stroke(255, 0, 0);
    noFill();
    ellipse(0, 0, 100 - attackCooldown * 2);
  }
  
  // Handle keyboard input for movement
  if (keyIsPressed) {
    if (keyCode === LEFT_ARROW) {
      cameraX -= moveSpeed;
    } else if (keyCode === RIGHT_ARROW) {
      cameraX += moveSpeed;
    } else if (keyCode === UP_ARROW) {
      cameraZ -= moveSpeed;
    } else if (keyCode === DOWN_ARROW) {
      cameraZ += moveSpeed;
    }
  }
  
  // Handle attack
  if (keyIsPressed && key === ' ') {
    if (attackCooldown <= 0) {
      attackCooldown = 50;
      attackEffect = { x: 0, z: 0 };
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
