let satellites = [];
let earthRadius = 100;
let numSatellites = 500;
let rotationSpeed = 0.002;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create satellites grouped into orbital planes
  for (let i = 0; i < numSatellites; i++) {
    let angle = random(TWO_PI);
    let radius = earthRadius * (1.5 + random(3));
    let inclination = random(-PI/4, PI/4); // Orbital plane inclination
    
    // Distribute satellites among different orbital planes
    let planeIndex = floor(map(i, 0, numSatellites, 0, 8));
    let planeAngle = planeIndex * TWO_PI / 8;
    
    let x = radius * cos(angle) * cos(inclination);
    let y = radius * sin(angle) * cos(inclination);
    let z = radius * sin(inclination);
    
    satellites.push({
      x: x,
      y: y,
      z: z,
      angle: angle,
      radius: radius,
      inclination: inclination,
      planeAngle: planeAngle,
      speed: random(0.001, 0.005),
      size: random(2, 6)
    });
  }
}

function draw() {
  background(0);
  
  // Slowly rotate the entire scene
  rotateY(frameCount * rotationSpeed * 0.3);
  rotateX(frameCount * rotationSpeed * 0.1);
  
  // Draw Earth with gradient
  push();
  noStroke();
  fill(30, 50, 150);
  sphere(earthRadius);
  
  // Add atmospheric glow
  fill(30, 50, 150, 30);
  sphere(earthRadius * 1.05);
  pop();
  
  // Draw satellites in orbit
  for (let sat of satellites) {
    // Update satellite position
    sat.angle += sat.speed;
    
    let x = sat.radius * cos(sat.angle) * cos(sat.inclination);
    let y = sat.radius * sin(sat.angle) * cos(sat.inclination);
    let z = sat.radius * sin(sat.inclination);
    
    // Apply orbital plane rotation
    let tempX = x * cos(sat.planeAngle) - z * sin(sat.planeAngle);
    let tempZ = x * sin(sat.planeAngle) + z * cos(sat.planeAngle);
    x = tempX;
    z = tempZ;
    
    // Draw satellite
    push();
    translate(x, y, z);
    fill(200, 200, 255);
    sphere(sat.size);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
