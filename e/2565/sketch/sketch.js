let lines = [];
let points = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create a dense network of intersecting lines using grid-based approach
  const gridSize = 50;
  const gridSpacing = width / gridSize;
  
  for (let i = 0; i < 800; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-1500, 1500);
    
    // Create lines that intersect at grid points
    lines.push({
      x: x,
      y: y,
      z: z,
      length: random(100, 300),
      angleX: random(TWO_PI),
      angleY: random(TWO_PI),
      angleZ: random(TWO_PI)
    });
  }

  // Create crystalline points at regular intervals
  for (let i = 0; i < 2000; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-1500, 1500);
    
    points.push({
      x: x,
      y: y,
      z: z,
      size: random(0.3, 1.2)
    });
  }
}

function draw() {
  background(0, 0, 5); // Very dark background

  // Ambient lighting
  ambientLight(10);
  
  // Dynamic point light source that pulses and moves
  let lightX = sin(frameCount * 0.002) * width/4;
  let lightY = cos(frameCount * 0.001) * height/4;
  pointLight(200, 150, 180, lightX, lightY, -600);
  
  // Rotate scene slowly
  rotateY(frameCount * 0.0003);
  rotateX(frameCount * 0.00005);

  // Draw intersecting lines in one batch
  beginShape(LINES);
  for (let line of lines) {
    push();
    
    translate(line.x, line.y, line.z);
    rotateX(line.angleX + frameCount * 0.001);
    rotateY(line.angleY + frameCount * 0.001);
    rotateZ(line.angleZ + frameCount * 0.001);
    
    stroke(200, 80, 90); // Cool cyan color
    strokeWeight(0.3);
    
    vertex(-line.length/2, 0, 0);
    vertex(line.length/2, 0, 0);
    
    pop();
  }
  endShape();

  // Draw points in one batch for performance
  beginShape(POINTS);
  for (let p of points) {
    push();
    translate(p.x, p.y, p.z);
    noStroke();
    fill(200, 80, 90, 0.8);
    vertex(0, 0, 0); // Using vertex instead of sphere
    pop();
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
