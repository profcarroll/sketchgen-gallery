let particles = [];
let noiseScale = 0.002;
let noiseStrength = 0.1;
let wordForms = [];
let wordTimer = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Preallocate particles
  for (let i = 0; i < 1000; i++) {
    particles.push({
      pos: createVector(random(width), random(height)),
      vel: createVector(0, 0),
      size: random(1, 3),
      hue: random(180, 240),
      alpha: random(0.05, 0.2),
      age: random(100)
    });
  }
  
  // Predefined word-like shapes
  wordForms = [
    { shape: [], name: "steam" },
    { shape: [], name: "mist" },
    { shape: [], name: "fog" },
    { shape: [], name: "vapor" }
  ];
}

function draw() {
  // Semi-transparent background for trail effect
  background(0, 0, 0, 0.02);
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Noise-based movement
    let nx = noise(p.pos.x * noiseScale, p.pos.y * noiseScale) - 0.5;
    let ny = noise(p.pos.x * noiseScale + 1000, p.pos.y * noiseScale + 1000) - 0.5;
    
    p.vel.x += nx * noiseStrength;
    p.vel.y += ny * noiseStrength;
    
    // Apply velocity
    p.pos.add(p.vel);
    
    // Add some damping
    p.vel.mult(0.95);
    
    // Boundary check and reset
    if (p.pos.x < 0 || p.pos.x > width ||
        p.pos.y < 0 || p.pos.y > height) {
      p.pos.set(random(width), random(height));
      p.vel.set(0, 0);
    }
    
    // Age the particle
    p.age++;
    if (p.age > 200) {
      p.age = 0;
      p.pos.set(random(width), random(height));
    }
    
    // Draw particle
    noStroke();
    fill(p.hue, 50, 90, p.alpha);
    ellipse(p.pos.x, p.pos.y, p.size);
  }
  
  // Occasionally form words
  wordTimer++;
  if (wordTimer > 300) {
    wordTimer = 0;
    
    // Fade out previous word forms
    for (let i = 0; i < wordForms.length; i++) {
      if (random() > 0.95) {
        wordForms[i].shape = [];
      }
    }
    
    // Create new shapes
    for (let i = 0; i < wordForms.length; i++) {
      if (wordForms[i].shape.length === 0 && random() > 0.7) {
        wordForms[i].shape = createWordShape(i);
      }
    }
  }
  
  // Draw current word forms
  for (let form of wordForms) {
    if (form.shape.length > 0) {
      stroke(200, 30, 80, 0.1);
      noFill();
      beginShape();
      for (let pt of form.shape) {
        vertex(pt.x, pt.y);
      }
      endShape(CLOSE);
    }
  }
}

function createWordShape(index) {
  // Simple approximation of word shapes using points
  let shape = [];
  let numPoints = 5 + index * 2;
  
  for (let i = 0; i < numPoints; i++) {
    let angle = map(i, 0, numPoints, 0, TWO_PI);
    let radius = random(10, 40);
    let x = cos(angle) * radius + width/2;
    let y = sin(angle) * radius + height/2;
    
    shape.push({x, y});
  }
  
  return shape;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
