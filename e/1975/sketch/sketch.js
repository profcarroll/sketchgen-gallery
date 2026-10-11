let shapes = [];
let connections = [];
const shapeCount = 1000;
const connectionCount = 5000;
const interactionRadius = 150;
const snapDistance = 20;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create tessellating shapes
  for (let i = 0; i < shapeCount; i++) {
    shapes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      size: random(15, 40),
      hue: random(360),
      saturation: random(60, 90),
      brightness: random(70, 90),
      originalX: 0,
      originalY: 0,
      originalZ: 0,
      isSnapped: false
    });
  }
  
  // Create connections between nearby shapes
  for (let i = 0; i < connectionCount; i++) {
    let a = floor(random(shapeCount));
    let b = floor(random(shapeCount));
    
    if (a !== b) {
      connections.push({
        a: a,
        b: b,
        distance: dist(shapes[a].x, shapes[a].y, shapes[a].z, 
                      shapes[b].x, shapes[b].y, shapes[b].z)
      });
    }
  }
}

function draw() {
  background(0, 0, 0);
  
  // Draw connections
  stroke(0, 0, 0, 0.8);
  strokeWeight(1);
  noFill();
  
  beginShape(LINES);
  for (let i = 0; i < connections.length; i++) {
    let c = connections[i];
    let sA = shapes[c.a];
    let sB = shapes[c.b];
    
    if (dist(sA.x, sA.y, sA.z, sB.x, sB.y, sB.z) < interactionRadius * 2) {
      vertex(sA.x, sA.y, sA.z);
      vertex(sB.x, sB.y, sB.z);
    }
  }
  endShape();
  
  // Draw shapes
  for (let i = 0; i < shapes.length; i++) {
    let s = shapes[i];
    
    push();
    translate(s.x, s.y, s.z);
    
    noStroke();
    fill(s.hue, s.saturation, s.brightness, 0.9);
    
    // Draw different geometric forms to create a tessellated pattern
    if (i % 4 === 0) {
      // Tetrahedron
      drawTetrahedron(s.size);
    } else if (i % 4 === 1) {
      // Octahedron
      drawOctahedron(s.size);
    } else if (i % 4 === 2) {
      // Dodecahedron
      drawDodecahedron(s.size);
    } else {
      // Icosahedron
      drawIcosahedron(s.size);
    }
    
    pop();
  }
}

function drawTetrahedron(size) {
  beginShape(TRIANGLES);
  vertex(0, -size/2, 0);
  vertex(-size/2, size/2, size/2);
  vertex(size/2, size/2, size/2);

  vertex(0, -size/2, 0);
  vertex(size/2, size/2, size/2);
  vertex(size/2, size/2, -size/2);

  vertex(0, -size/2, 0);
  vertex(size/2, size/2, -size/2);
  vertex(-size/2, size/2, -size/2);

  vertex(0, -size/2, 0);
  vertex(-size/2, size/2, -size/2);
  vertex(-size/2, size/2, size/2);
  endShape();
}

function drawOctahedron(size) {
  beginShape(TRIANGLES);
  vertex(0, -size/2, 0);
  vertex(-size/2, 0, size/2);
  vertex(size/2, 0, size/2);

  vertex(0, -size/2, 0);
  vertex(size/2, 0, size/2);
  vertex(size/2, 0, -size/2);

  vertex(0, -size/2, 0);
  vertex(size/2, 0, -size/2);
  vertex(-size/2, 0, -size/2);

  vertex(0, -size/2, 0);
  vertex(-size/2, 0, -size/2);
  vertex(-size/2, 0, size/2);

  vertex(0, size/2, 0);
  vertex(-size/2, 0, size/2);
  vertex(size/2, 0, size/2);

  vertex(0, size/2, 0);
  vertex(size/2, 0, size/2);
  vertex(size/2, 0, -size/2);

  vertex(0, size/2, 0);
  vertex(size/2, 0, -size/2);
  vertex(-size/2, 0, -size/2);

  vertex(0, size/2, 0);
  vertex(-size/2, 0, -size/2);
  vertex(-size/2, 0, size/2);
  endShape();
}

function drawDodecahedron(size) {
  // Simplified version using a cube
  box(size);
}

function drawIcosahedron(size) {
  // Simplified version using a sphere with low detail
  sphere(size, 5, 3);
}

function mousePressed() {
  applyInteraction(mouseX - width/2, mouseY - height/2);
  return false;
}

function mouseDragged() {
  applyInteraction(mouseX - width/2, mouseY - height/2);
  return false;
}

function applyInteraction(x, y) {
  // Find nearby shapes and snap them
  for (let i = 0; i < shapes.length; i++) {
    let s = shapes[i];
    let d = dist(s.x, s.y, s.z, x, y, 0);
    
    if (d < interactionRadius) {
      // Snap to new position
      let angle = atan2(s.y - y, s.x - x);
      let snapX = x + cos(angle) * snapDistance;
      let snapY = y + sin(angle) * snapDistance;
      
      s.x = lerp(s.x, snapX, 0.3);
      s.y = lerp(s.y, snapY, 0.3);
      s.isSnapped = true;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
