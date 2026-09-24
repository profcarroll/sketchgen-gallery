let earth, stars, satellites;
let rotationSpeed = 0.002;
let cameraAngle = 0;

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
  
  // Create satellites with geometric paths
  satellites = [];
  for (let i = 0; i < 50; i++) {
    satellites.push({
      angle: random(TWO_PI),
      radius: random(150, 300),
      speed: random(0.005, 0.02),
      size: random(2, 6),
      path: []
    });
  }
  
  // Precompute orbital paths for satellites
  for (let s of satellites) {
    s.path = [];
    for (let i = 0; i < 100; i++) {
      let angle = map(i, 0, 99, 0, TWO_PI);
      let x = cos(angle) * s.radius;
      let z = sin(angle) * s.radius;
      let y = sin(angle * 0.7) * 100;
      s.path.push([x, y, z]);
    }
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
  
  // Draw Earth
  push();
  rotateX(-PI / 8);
  rotateY(cameraAngle * 0.5);
  fill(30, 144, 255);
  stroke(0);
  sphere(100);
  pop();
  
  // Draw satellites as a single point cloud
  noStroke();
  fill(255);
  beginShape(POINTS);
  for (let s of satellites) {
    s.angle += s.speed;
    let x = cos(s.angle) * s.radius;
    let z = sin(s.angle) * s.radius;
    let y = sin(s.angle * 0.7) * 100;
    vertex(x, y, z);
  }
  endShape();
  
  // Draw orbital paths as a single shape
  noFill();
  stroke(255, 30);
  for (let s of satellites) {
    beginShape();
    for (let point of s.path) {
      vertex(point[0], point[1], point[2]);
    }
    endShape(CLOSE);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
