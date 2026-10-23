let structures = [];
let time = 0;
let cameraZ = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial structures that mimic slime mould and crystal formations
  for (let i = 0; i < 200; i++) {
    structures.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-1000, 1000),
      size: random(20, 80),
      speed: random(0.005, 0.02),
      hue: random(180, 240), // blue-green hues for organic feel
      saturation: random(60, 90),
      brightness: random(70, 90),
      age: random(TWO_PI)
    });
  }
}

function draw() {
  background(10, 10, 5); // dark subterranean base
  
  // Animate time
  time += 0.002;
  
  // Camera movement for immersive effect
  cameraZ = map(sin(time * 0.3), -1, 1, -1500, -500);
  camera(0, 0, cameraZ, 0, 0, 0, 0, 1, 0);
  
  // Draw structures
  for (let structure of structures) {
    // Update position with organic movement
    structure.x += sin(structure.age) * structure.speed * 2;
    structure.y += cos(structure.age) * structure.speed * 2;
    structure.z += sin(time * 0.5 + structure.age) * structure.speed * 3;
    
    // Age structure for glow effect
    structure.age += 0.01;
    
    // Glow intensity based on age and position
    let glow = map(sin(structure.age), -1, 1, 0.5, 1);
    
    push();
    translate(structure.x, structure.y, structure.z);
    
    // Create organic, crystalline shape using sphere and noise
    noStroke();
    fill(structure.hue, structure.saturation, structure.brightness, glow * 0.8);
    
    // Use noise for organic growth effect
    let n = noise(structure.x * 0.01, structure.y * 0.01, time * 0.1);
    let size = structure.size + sin(time + structure.age) * 20;
    
    sphere(size * (0.8 + n * 0.4), 6, 4); // low detail for performance
    
    // Add inner glow
    fill(structure.hue, structure.saturation, 100, glow * 0.3);
    sphere(size * 0.5, 6, 4);
    
    pop();
  }
  
  // Add subtle particle system for depth
  for (let i = 0; i < 100; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-1000, 1000);
    
    push();
    translate(x, y, z);
    noStroke();
    fill(200, 30, 90, 0.3);
    sphere(random(1, 3), 4, 4);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
