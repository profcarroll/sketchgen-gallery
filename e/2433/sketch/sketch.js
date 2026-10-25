let shelves = [];
let time = 0;
let cameraZ = 0;
let dustParticles = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create library shelves
  for (let x = -width/2; x < width/2; x += 120) {
    for (let y = -height/2; y < height/2; y += 120) {
      for (let z = -1500; z < 1500; z += 200) {
        shelves.push({
          x: x + random(-30, 30),
          y: y + random(-30, 30),
          z: z,
          width: random(80, 100),
          height: random(250, 300),
          depth: random(20, 40),
          hue: random(20, 35), // warm cedar tones
          saturation: random(60, 80),
          brightness: random(40, 70),
          age: random(TWO_PI)
        });
      }
    }
  }
  
  // Create dust particles for accumulation effect
  for (let i = 0; i < 1000; i++) {
    dustParticles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-2000, 2000),
      size: random(0.5, 3),
      speed: random(0.001, 0.005),
      opacity: random(0.1, 0.4)
    });
  }
}

function draw() {
  background(15, 10, 5); // deep amber base
  
  time += 0.002;
  
  // Camera movement - slow pan for immersive effect
  cameraZ = map(sin(time * 0.1), -1, 1, -1800, -1000);
  camera(0, 0, cameraZ, 0, 0, 0, 0, 1, 0);
  
  // Draw shelves using batched approach
  beginShape(QUADS);
  for (let shelf of shelves) {
    let ageEffect = sin(time * 0.2 + shelf.age) * 0.5;
    let rotX = ageEffect * 0.1;
    let rotZ = ageEffect * 0.05;
    
    // Use a single batched draw instead of multiple boxes
    fill(shelf.hue, shelf.saturation, shelf.brightness, 0.9);
    
    // Simplified shelf rendering using vertex calls
    let w = shelf.width;
    let h = shelf.height;
    let d = shelf.depth;
    
    // Front face
    vertex(shelf.x - w/2, shelf.y - h/2, shelf.z - d/2);
    vertex(shelf.x + w/2, shelf.y - h/2, shelf.z - d/2);
    vertex(shelf.x + w/2, shelf.y + h/2, shelf.z - d/2);
    vertex(shelf.x - w/2, shelf.y + h/2, shelf.z - d/2);
    
    // Back face
    vertex(shelf.x - w/2, shelf.y - h/2, shelf.z + d/2);
    vertex(shelf.x + w/2, shelf.y - h/2, shelf.z + d/2);
    vertex(shelf.x + w/2, shelf.y + h/2, shelf.z + d/2);
    vertex(shelf.x - w/2, shelf.y + h/2, shelf.z + d/2);
  }
  endShape();
  
  // Draw dust particles using batched approach
  beginShape(POINTS);
  for (let particle of dustParticles) {
    // Slow drift and settling
    particle.z += particle.speed;
    particle.x += sin(time * 0.5 + particle.z * 0.01) * 0.2;
    particle.y += cos(time * 0.3 + particle.z * 0.01) * 0.2;
    
    // Reset particles that drift too far
    if (particle.z > 2000) {
      particle.z = -2000;
      particle.x = random(-width/2, width/2);
      particle.y = random(-height/2, height/2);
    }
    
    fill(20, 5, 90, particle.opacity);
    vertex(particle.x, particle.y, particle.z);
  }
  endShape();
  
  // Add ambient glow to the scene
  noStroke();
  fill(10, 20, 20, 0.05);
  sphere(width * 2, 8, 8);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
