let buildings = [];
let sunAngle = 0;
let timeOfDay = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  noStroke();

  // Create a grid of buildings
  for (let x = -300; x < 300; x += 60) {
    for (let z = -300; z < 300; z += 60) {
      if (random() > 0.3) { // Randomly skip some spots
        let height = random(50, 200);
        buildings.push({
          x: x,
          z: z,
          width: 40,
          depth: 40,
          height: height
        });
      }
    }
  }
}

function draw() {
  background(135, 206, 235); // Sky blue

  // Update time of day
  timeOfDay += 0.002;
  sunAngle = timeOfDay % (TWO_PI);

  // Position the sun
  let sunX = sin(sunAngle) * 400;
  let sunY = cos(sunAngle) * 300;

  // Ambient light
  ambientLight(80);

  // Sun light
  pointLight(255, 255, 255, sunX, sunY, 0);

  // Draw buildings
  for (let b of buildings) {
    push();
    translate(b.x, 0, b.z);
    
    // Building color based on position and time
    let hue = map(b.x, -300, 300, 200, 260); // Blue to purple
    let saturation = 50;
    let brightness = map(b.height, 50, 200, 70, 90);
    
    fill(hue, saturation, brightness);

    // Draw building with shadows
    box(b.width, b.height, b.depth);
    
    pop();
  }

  // Draw ground
  push();
  translate(0, 100, 0);
  rotateX(HALF_PI);
  noStroke();
  fill(80, 120, 80); // Greenish ground
  plane(1000, 1000);
  pop();

  // Draw dynamic shadows
  drawShadows();
}

function drawShadows() {
  for (let b of buildings) {
    let shadowX = b.x - sin(sunAngle) * b.height * 0.5;
    let shadowZ = b.z - cos(sunAngle) * b.height * 0.5;
    
    push();
    translate(shadowX, 100, shadowZ);
    rotateX(HALF_PI);
    noStroke();
    fill(0, 0, 0, 80); // Semi-transparent black
    plane(b.width * 0.7, b.depth * 0.7);
    pop();
  }
}
