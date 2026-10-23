// A flickering campfire burning low at the bottom, emitting warm orange and yellow sparks
// that drift upward into a darkening midnight sky, forming constellations as they cool

const PARTICLE_COUNT = 800;
const FIRE_HEIGHT = 100;
const GRAVITY = 0.02;
const WIND_STRENGTH = 0.003;
const SPARK_LIFETIME = 300;

let particles = [];
let bgColor;
let fireColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Deep midnight blue sky
  bgColor = color(220, 80, 5, 1);
  
  // Warm fire colors
  fireColor = color(25, 100, 100, 1);
  
  // Initialize particles with random properties
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      pos: createVector(random(width), height - random(0, FIRE_HEIGHT)),
      vel: createVector(0, 0),
      acc: createVector(0, 0),
      size: random(1, 3),
      lifetime: random(SPARK_LIFETIME * 0.5, SPARK_LIFETIME),
      maxLifetime: SPARK_LIFETIME,
      hue: random(20, 40), // orange to yellow
      saturation: random(80, 100),
      brightness: random(80, 100),
      trail: []
    });
  }
}

function draw() {
  background(bgColor);
  
  // Draw fire at bottom
  noStroke();
  fill(fireColor);
  for (let i = 0; i < 20; i++) {
    let x = random(width);
    let y = height - random(0, FIRE_HEIGHT);
    let r = random(5, 20);
    ellipse(x, y, r, r);
  }
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Add some noise to movement
    let noiseX = noise(p.pos.x * 0.01, p.pos.y * 0.01, frameCount * 0.01) - 0.5;
    let noiseY = noise(p.pos.x * 0.01, p.pos.y * 0.01, frameCount * 0.01 + 1000) - 0.5;
    
    // Apply forces
    p.acc.x += noiseX * WIND_STRENGTH;
    p.acc.y -= GRAVITY;
    
    // Update velocity and position
    p.vel.add(p.acc);
    p.pos.add(p.vel);
    
    // Reset acceleration
    p.acc.mult(0);
    
    // Age the particle
    p.lifetime--;
    
    // Add current position to trail
    p.trail.push(createVector(p.pos.x, p.pos.y));
    
    // Limit trail length
    if (p.trail.length > 20) {
      p.trail.shift();
    }
    
    // Reset particle if it dies or goes off screen
    if (p.lifetime <= 0 || p.pos.y < -50) {
      p.pos.set(random(width), height - random(0, FIRE_HEIGHT));
      p.vel.mult(0);
      p.lifetime = p.maxLifetime;
      p.trail = [];
      p.hue = random(20, 40); // Reset to warm orange/yellow
    }
    
    // Color transition from warm to cool as particle rises
    let t = map(p.pos.y, height, 0, 0, 1);
    t = constrain(t, 0, 1);
    let newHue = lerp(20, 240, t); // Warm orange to cool blue
    let newSat = lerp(80, 90, t);
    let newBright = lerp(80, 95, t);
    
    // Draw trail
    noFill();
    stroke(newHue, newSat, newBright, 0.6);
    strokeWeight(1);
    beginShape();
    for (let pos of p.trail) {
      vertex(pos.x, pos.y);
    }
    endShape();
    
    // Draw particle
    fill(newHue, newSat, newBright, 0.8);
    noStroke();
    ellipse(p.pos.x, p.pos.y, p.size, p.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
