let shapes = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial shapes with rectilinear and helical motion
  for (let i = 0; i < 50; i++) {
    shapes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-1000, 1000),
      size: random(20, 60),
      hue: random(360),
      speed: random(0.005, 0.02),
      rotationX: random(TWO_PI),
      rotationY: random(TWO_PI),
      rotationZ: random(TWO_PI),
      sides: floor(random(2)) === 0 ? 8 : 6, // octahedron or hexagon
      pulse: random(0.5, 2),
      axis: floor(random(3)), // 0=x, 1=y, 2=z axis
      direction: random() > 0.5 ? 1 : -1,
      phase: random(TWO_PI),
      helixRadius: random(50, 200),
      helixSpeed: random(0.01, 0.03),
      helixPhase: random(TWO_PI),
      isMoving: false,
      lastCollisionTime: 0
    });
  }
}

function draw() {
  background(0, 0, 0, 0.1);
  
  time += 0.01;
  
  // Check for collisions and update shapes
  for (let i = 0; i < shapes.length; i++) {
    let s1 = shapes[i];
    
    // Reset movement state
    s1.isMoving = false;
    
    // Check for collisions with other shapes
    for (let j = i + 1; j < shapes.length; j++) {
      let s2 = shapes[j];
      
      // Calculate distance between centers
      let dx = s1.x - s2.x;
      let dy = s1.y - s2.y;
      let dz = s1.z - s2.z;
      let distance = sqrt(dx*dx + dy*dy + dz*dz);
      
      // Collision detection (simplified)
      if (distance < (s1.size/2 + s2.size/2)) {
        s1.isMoving = true;
        s2.isMoving = true;
        s1.lastCollisionTime = millis();
        s2.lastCollisionTime = millis();
      }
    }
    
    // Update shape with rectilinear and helical motion
    push();
    
    // Combine rectilinear axis movement with helical spiral
    let speed = s1.speed * 20;
    let movement = (time * speed + s1.phase) * s1.direction;
    
    // Helix motion in xz plane
    let helixOffsetX = sin(time * s1.helixSpeed + s1.helixPhase) * s1.helixRadius;
    let helixOffsetZ = cos(time * s1.helixSpeed + s1.helixPhase) * s1.helixRadius;
    
    if (s1.axis === 0) { // x-axis
      translate(movement + helixOffsetX, s1.y, s1.z + helixOffsetZ);
    } else if (s1.axis === 1) { // y-axis
      translate(s1.x + helixOffsetX, movement, s1.z + helixOffsetZ);
    } else { // z-axis
      translate(s1.x + helixOffsetX, s1.y, movement + helixOffsetZ);
    }
    
    // Add some rotation for visual interest
    s1.rotationX += s1.speed * 0.5;
    s1.rotationY += s1.speed * 0.3;
    s1.rotationZ += s1.speed * 0.7;
    
    rotateX(s1.rotationX);
    rotateY(s1.rotationY);
    rotateZ(s1.rotationZ);
    
    // Color effect based on movement state
    let hue = s1.hue;
    if (s1.isMoving) {
      hue += 100 * sin(millis() / 100);
    }
    
    noStroke();
    fill(hue, 100, 100, 0.8);
    
    // Draw shape based on sides
    if (s1.sides === 8) {
      drawOctahedron(s1.size);
    } else {
      drawHexagon(s1.size);
    }
    
    pop();
    
    // Update hue for pulsing effect
    s1.hue += 0.5;
    if (s1.hue > 360) s1.hue -= 360;
  }
}

function drawOctahedron(size) {
  // Simplified octahedron using 8 triangular faces
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
