let shapes = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial shapes
  for (let i = 0; i < 150; i++) {
    shapes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-1000, 1000),
      size: random(10, 60),
      hue: random(360),
      speed: random(0.005, 0.02),
      rotationX: random(TWO_PI),
      rotationY: random(TWO_PI),
      rotationZ: random(TWO_PI),
      sides: floor(random(2)) === 0 ? 8 : 6, // octahedron or hexagon
      pulse: random(0.5, 2),
      spiralPhase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.1);
  
  time += 0.01;
  
  // Draw and update shapes with synchronized helical motion
  for (let s of shapes) {
    push();
    
    // Helical spiral motion
    let spiralRadius = 300;
    let spiralHeight = 200;
    let spiralSpeed = 0.005;
    
    let spiralX = sin(time * spiralSpeed + s.spiralPhase) * spiralRadius;
    let spiralY = cos(time * spiralSpeed + s.spiralPhase) * spiralRadius;
    let spiralZ = time * 20 + s.spiralPhase * 100;
    
    translate(spiralX, spiralY, spiralZ);
    
    // Add some rotation for visual interest
    s.rotationX += s.speed * 0.5;
    s.rotationY += s.speed * 0.3;
    s.rotationZ += s.speed * 0.7;
    
    rotateX(s.rotationX);
    rotateY(s.rotationY);
    rotateZ(s.rotationZ);
    
    noStroke();
    fill(s.hue, 100, 100, 0.8);
    
    if (s.sides === 8) {
      // Octahedron
      drawOctahedron(s.size);
    } else {
      // Hexagon (as a regular polygon)
      drawHexagon(s.size);
    }
    
    pop();
    
    // Update hue for pulsing effect
    s.hue += 0.5;
    if (s.hue > 360) s.hue -= 360;
  }
}

function drawOctahedron(size) {
  // Simple octahedron using 8 triangular faces
  beginShape();
  vertex(0, -size/2, 0);
  vertex(size/2, 0, 0);
  vertex(0, 0, size/2);
  endShape(CLOSE);
  
  beginShape();
  vertex(0, -size/2, 0);
  vertex(0, 0, size/2);
  vertex(-size/2, 0, 0);
  endShape(CLOSE);
  
  beginShape();
  vertex(0, -size/2, 0);
  vertex(-size/2, 0, 0);
  vertex(0, 0, -size/2);
  endShape(CLOSE);
  
  beginShape();
  vertex(0, -size/2, 0);
  vertex(0, 0, -size/2);
  vertex(size/2, 0, 0);
  endShape(CLOSE);
  
  beginShape();
  vertex(0, size/2, 0);
  vertex(size/2, 0, 0);
  vertex(0, 0, -size/2);
  endShape(CLOSE);
  
  beginShape();
  vertex(0, size/2, 0);
  vertex(0, 0, -size/2);
  vertex(-size/2, 0, 0);
  endShape(CLOSE);
  
  beginShape();
  vertex(0, size/2, 0);
  vertex(-size/2, 0, 0);
  vertex(0, 0, size/2);
  endShape(CLOSE);
  
  beginShape();
  vertex(0, size/2, 0);
  vertex(0, 0, size/2);
  vertex(size/2, 0, 0);
  endShape(CLOSE);
}

function drawHexagon(size) {
  // Draw a hexagon as a polygon
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = map(i, 0, 6, 0, TWO_PI);
    let x = cos(angle) * size;
    let y = sin(angle) * size;
    vertex(x, y);
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
