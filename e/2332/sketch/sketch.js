let structures = [];
let time = 0;
let cameraZ = 0;
let pipeGrid = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial structures that mimic slime mould and crystal formations
  for (let i = 0; i < 300; i++) {
    structures.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-1500, 1500),
      size: random(15, 60),
      speed: random(0.003, 0.015),
      hue: random(10, 40), // rusted reds and browns
      saturation: random(50, 80),
      brightness: random(60, 90),
      age: random(TWO_PI),
      growth: random(0.005, 0.02)
    });
  }
  
  // Create pipe grid structure
  for (let x = -width/2; x < width/2; x += 150) {
    for (let y = -height/2; y < height/2; y += 150) {
      pipeGrid.push({
        x: x,
        y: y,
        z: random(-1000, 1000),
        size: random(80, 150),
        angle: random(TWO_PI)
      });
    }
  }
}

function draw() {
  background(20, 20, 5); // dark subterranean base
  
  // Animate time
  time += 0.003;
  
  // Camera movement for immersive effect
  cameraZ = map(sin(time * 0.2), -1, 1, -2000, -800);
  camera(0, 0, cameraZ, 0, 0, 0, 0, 1, 0);
  
  // Draw pipe grid
  for (let pipe of pipeGrid) {
    push();
    translate(pipe.x, pipe.y, pipe.z);
    rotateX(pipe.angle);
    rotateY(pipe.angle * 0.5);
    
    noStroke();
    fill(20, 30, 30, 0.7);
    cylinder(pipe.size, 8, 1, false);
    
    // Add inner structure
    fill(15, 20, 20, 0.4);
    cylinder(pipe.size * 0.6, 8, 1, false);
    
    pop();
  }
  
  // Draw structures
  for (let structure of structures) {
    // Update position with organic movement
    structure.x += sin(structure.age) * structure.speed * 2;
    structure.y += cos(structure.age) * structure.speed * 2;
    structure.z += sin(time * 0.5 + structure.age) * structure.speed * 3;
    
    // Age structure for glow effect
    structure.age += structure.growth;
    
    // Glow intensity based on age and position
    let glow = map(sin(structure.age), -1, 1, 0.4, 1);
    
    push();
    translate(structure.x, structure.y, structure.z);
    
    // Create organic, crystalline shape using sphere and noise
    noStroke();
    fill(structure.hue, structure.saturation, structure.brightness, glow * 0.7);
    
    // Use noise for organic growth effect
    let n = noise(structure.x * 0.01, structure.y * 0.01, time * 0.1);
    let size = structure.size + sin(time + structure.age) * 15;
    
    sphere(size * (0.7 + n * 0.3), 6, 4); // low detail for performance
    
    // Add inner glow
    fill(structure.hue, structure.saturation, 100, glow * 0.2);
    sphere(size * 0.4, 6, 4);
    
    pop();
  }
  
  // Add subtle particle system for depth and atmosphere
  for (let i = 0; i < 50; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-1500, 1500);
    
    push();
    translate(x, y, z);
    noStroke();
    fill(20, 10, 80, 0.4);
    sphere(random(1, 2), 4, 4);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
