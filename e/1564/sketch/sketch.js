let earth, stars, satellites;
let rotationSpeed = 0.002;
let cameraAngle = 0;
let satellitePoints = [];
let earthTexture;

function preload() {
  // Load a celestial texture for Earth
  earthTexture = loadImage('https://picsum.photos/seed/earth/800/600');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Create stars as a single point cloud
  stars = [];
  for (let i = 0; i < 1000; i++) {
    stars.push([
      random(-width * 2, width * 2),
      random(-height * 2, height * 2),
      random(-1000, -100)
    ]);
  }
  
  // Create satellites with complex orbital paths
  satellites = [];
  for (let i = 0; i < 500; i++) {
    satellites.push({
      angle: random(TWO_PI),
      radius: random(150, 300),
      speed: random(0.002, 0.01),
      size: random(1, 3),
      inclination: random(PI/6, PI/2), // Random orbital inclination
      eccentricity: random(0.1, 0.5)   // Orbital eccentricity
    });
  }
  
  // Precompute satellite positions for rendering
  satellitePoints = [];
  for (let i = 0; i < 500; i++) {
    satellitePoints.push(createVector(0, 0, 0));
  }
}

function draw() {
  background(0);
  
  // Rotate the entire scene
  rotateY(cameraAngle);
  cameraAngle += rotationSpeed * 0.3;
  
  // Draw stars as a single point cloud
  noStroke();
  fill(255);
  beginShape(POINTS);
  for (let star of stars) {
    vertex(star[0], star[1], star[2]);
  }
  endShape();
  
  // Draw Earth with texture
  push();
  rotateX(-PI / 8);
  rotateY(cameraAngle * 0.5);
  noStroke();
  texture(earthTexture);
  sphere(100);
  pop();
  
  // Draw satellites as a single point cloud
  noStroke();
  fill(255, 200);
  beginShape(POINTS);
  for (let i = 0; i < satellites.length; i++) {
    let s = satellites[i];
    s.angle += s.speed;
    
    // Calculate satellite position with orbital inclination and eccentricity
    let x = cos(s.angle) * s.radius;
    let z = sin(s.angle) * s.radius;
    let y = sin(s.angle * 0.7 + s.angle) * 100 * sin(s.inclination);
    
    // Store for rendering
    satellitePoints[i].set(x, y, z);
    vertex(x, y, z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
