let planes = [];
let wavePhase = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create multiple intersecting planes with different orientations
  for (let i = 0; i < 8; i++) {
    planes.push({
      angle: i * TWO_PI / 8,
      rotationSpeed: random(-0.005, 0.005),
      size: random(200, 400),
      color: color(random(360), 80, 90, 0.7)
    });
  }
}

function draw() {
  background(0);
  noStroke();
  
  wavePhase += 0.02;
  
  // Center the scene
  translate(0, 0, -500);
  
  for (let i = 0; i < planes.length; i++) {
    let plane = planes[i];
    
    push();
    
    // Rotate each plane differently
    rotateY(plane.angle + wavePhase * plane.rotationSpeed);
    rotateX(plane.angle * 0.5);
    
    // Create a pulsing glow effect using the wave pattern
    let waveIntensity = sin(wavePhase + i) * 0.5 + 0.5;
    
    // Draw the plane with dynamic glow
    fill(plane.color);
    specularMaterial(255, 100);
    shininess(100);
    
    // Use a grid of points to create an intricate surface
    let resolution = 30;
    let gridSize = plane.size / resolution;
    
    beginShape(QUADS);
    for (let x = -plane.size/2; x < plane.size/2; x += gridSize) {
      for (let y = -plane.size/2; y < plane.size/2; y += gridSize) {
        // Apply wave displacement to create movement
        let displacement = sin(x * 0.02 + y * 0.02 + wavePhase) * 30 * waveIntensity;
        
        vertex(x, y, displacement);
        vertex(x + gridSize, y, displacement);
        vertex(x + gridSize, y + gridSize, displacement);
        vertex(x, y + gridSize, displacement);
      }
    }
    endShape();
    
    pop();
  }
  
  // Add connecting lines between planes
  stroke(255, 0.2);
  noFill();
  
  beginShape(LINES);
  for (let i = 0; i < planes.length; i++) {
    let p1 = planes[i];
    let p2 = planes[(i + 1) % planes.length];
    
    // Connect centers of planes with a wave pattern
    let angle1 = p1.angle + wavePhase * p1.rotationSpeed;
    let angle2 = p2.angle + wavePhase * p2.rotationSpeed;
    
    let x1 = sin(angle1) * 300;
    let y1 = cos(angle1) * 300;
    let z1 = sin(wavePhase + i) * 100;
    
    let x2 = sin(angle2) * 300;
    let y2 = cos(angle2) * 300;
    let z2 = sin(wavePhase + (i+1)) * 100;
    
    vertex(x1, y1, z1);
    vertex(x2, y2, z2);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
