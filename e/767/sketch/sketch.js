let steelMesh;
let streaks = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create a curved steel pathway mesh
  steelMesh = createSteelMesh();
  
  // Generate rust streaks
  for (let i = 0; i < 200; i++) {
    streaks.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      length: random(30, 150),
      angle: random(TWO_PI)
    });
  }
}

function draw() {
  background(30, 30, 35);
  
  // Ambient lighting
  ambientLight(40);
  pointLight(255, 255, 255, 0, -height/2, 0);
  pointLight(150, 100, 80, 0, height/2, 0);
  
  // Rotate the whole scene slowly
  rotateY(frameCount * 0.002);
  
  // Draw the steel pathway
  push();
  translate(0, 0, -100);
  drawSteelPathway();
  pop();
  
  // Draw rust streaks
  drawRustStreaks();
}

function createSteelMesh() {
  let mesh = [];
  const segments = 50;
  const radius = 200;
  
  for (let i = 0; i < segments; i++) {
    const angle = map(i, 0, segments, 0, TWO_PI);
    const nextAngle = map(i + 1, 0, segments, 0, TWO_PI);
    
    // Create a curved surface with some irregularity
    const x1 = cos(angle) * radius;
    const y1 = sin(angle) * radius;
    const z1 = sin(angle * 0.5) * 100;
    
    const x2 = cos(nextAngle) * radius;
    const y2 = sin(nextAngle) * radius;
    const z2 = sin(nextAngle * 0.5) * 100;
    
    mesh.push({x: x1, y: y1, z: z1});
    mesh.push({x: x2, y: y2, z: z2});
  }
  
  return mesh;
}

function drawSteelPathway() {
  // Steel material properties
  fill(80, 75, 85);
  shininess(5);
  
  // Draw the curved pathway
  beginShape();
  for (let i = 0; i < steelMesh.length; i += 2) {
    const p1 = steelMesh[i];
    const p2 = steelMesh[i + 1];
    
    vertex(p1.x, p1.y, p1.z);
    vertex(p2.x, p2.y, p2.z);
  }
  endShape(CLOSE);
  
  // Add some depth with inner curve
  fill(60, 55, 70);
  beginShape();
  for (let i = 0; i < steelMesh.length; i += 2) {
    const p1 = steelMesh[i];
    const p2 = steelMesh[i + 1];
    
    // Inner curve
    const innerX = p1.x * 0.9;
    const innerY = p1.y * 0.9;
    const innerZ = p1.z * 0.9;
    
    vertex(innerX, innerY, innerZ);
  }
  endShape(CLOSE);
}

function drawRustStreaks() {
  // Draw rust streaks as elongated shapes
  for (let i = 0; i < streaks.length; i++) {
    const s = streaks[i];
    
    push();
    translate(s.x, s.y, s.z);
    rotateZ(s.angle);
    
    // Rust color with varying intensity
    const rustColor = color(120, 40, 0, 180);
    fill(rustColor);
    
    // Draw streak as a long, thin rectangle
    rectMode(CENTER);
    rect(0, 0, 3, s.length);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
