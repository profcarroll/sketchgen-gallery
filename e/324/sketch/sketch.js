let buildings = [];
let sunAngle = 0;
let timeSpeed = 0.002;

function setup() {
  createCanvas(800, 600, WEBGL);
  noStroke();

  // Create a grid of buildings
  for (let x = -300; x < 300; x += 40) {
    for (let z = -300; z < 300; z += 40) {
      if (random() > 0.3) { // Randomly skip some spots
        let height = random(20, 100);
        buildings.push({ x, z, height });
      }
    }
  }
}

function draw() {
  background(50);

  // Rotate the scene for a dynamic view
  rotateY(sunAngle * 0.3);

  // Simulate sun movement
  sunAngle += timeSpeed;

  // Ambient light
  ambientLight(80);

  // Sun directional light
  pointLight(255, 255, 255, 0, -300, 500);

  // Draw buildings
  for (let building of buildings) {
    push();
    translate(building.x, 0, building.z);
    fill(100, 120, 180);
    box(30, building.height, 30);
    
    // Shadows
    let shadowX = building.x - (building.height * sin(sunAngle) * 2);
    let shadowZ = building.z + (building.height * cos(sunAngle) * 2);
    fill(0, 0, 0, 100);
    rect(shadowX, 0, 30, 30);
    
    pop();
  }
}
