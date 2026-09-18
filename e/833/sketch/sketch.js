let cubeRotation = 0;
let glassSpirals = [];
let bioluminescentPatterns = [];
let crystalStructures = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create glass spirals
  for (let i = 0; i < 8; i++) {
    glassSpirals.push({
      angle: i * TWO_PI / 8,
      radius: 150 + random(50),
      speed: random(0.005, 0.01),
      color: color(random(120, 140), 80, 90, 0.7)
    });
  }
  
  // Initialize bioluminescent patterns
  for (let i = 0; i < 300; i++) {
    bioluminescentPatterns.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(2, 8),
      speed: random(0.005, 0.02),
      phase: random(TWO_PI)
    });
  }
  
  // Initialize crystal structures
  for (let i = 0; i < 50; i++) {
    crystalStructures.push({
      x: random(-width/3, width/3),
      y: random(-height/3, height/3),
      z: random(-100, 100),
      size: random(2, 10),
      growth: random(0.001, 0.005),
      age: 0
    });
  }
}

function draw() {
  background(0);
  
  // Center the scene
  translate(0, 0, -500);
  
  // Rotate the cube
  cubeRotation += 0.005;
  rotateX(cubeRotation * 0.7);
  rotateY(cubeRotation);
  rotateZ(cubeRotation * 0.3);
  
  // Draw molten bronze core
  noStroke();
  fill(10, 90, 90, 0.9);
  sphere(50);
  
  // Add copper highlights
  fill(20, 80, 70, 0.5);
  sphere(45);
  
  // Draw glass spirals
  for (let spiral of glassSpirals) {
    spiral.angle += spiral.speed;
    let x = cos(spiral.angle) * spiral.radius;
    let y = sin(spiral.angle) * spiral.radius;
    let z = sin(spiral.angle * 0.5) * 100;
    
    push();
    translate(x, y, z);
    rotateX(PI/2 + spiral.angle);
    rotateY(spiral.angle);
    fill(spiral.color);
    noStroke();
    
    // Create spiral shape
    beginShape(QUAD_STRIP);
    for (let i = 0; i < 50; i++) {
      let t = map(i, 0, 49, 0, TWO_PI * 3);
      let radius = map(i, 0, 49, 20, 5);
      let px = cos(t) * radius;
      let py = sin(t) * radius;
      let pz = i * 2 - 50;
      
      vertex(px, py, pz);
      vertex(px + random(-1, 1), py + random(-1, 1), pz + random(-1, 1));
    }
    endShape();
    
    pop();
  }
  
  // Draw bioluminescent patterns
  noStroke();
  for (let pattern of bioluminescentPatterns) {
    pattern.phase += pattern.speed;
    let alpha = sin(pattern.phase) * 0.5 + 0.5;
    fill(160, 100, 90, alpha * 0.3);
    
    push();
    translate(pattern.x, pattern.y, pattern.z);
    sphere(pattern.size);
    pop();
  }
  
  // Draw crystal structures
  noStroke();
  for (let crystal of crystalStructures) {
    crystal.age += crystal.growth;
    let size = crystal.size * (1 + crystal.age * 0.5);
    
    if (crystal.age > 1) {
      crystal.age = 0;
      crystal.x = random(-width/3, width/3);
      crystal.y = random(-height/3, height/3);
      crystal.z = random(-100, 100);
    }
    
    fill(200, 80, 90, 0.7);
    push();
    translate(crystal.x, crystal.y, crystal.z);
    sphere(size, 4, 4);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
