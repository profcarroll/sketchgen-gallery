// A vibrant campfire with glowing sparks that transform into constellations
// Sparks rise from warm orange/yellow fire, cool to blue-white as they ascend,
// then drift apart and connect to form recognizable constellations in the night sky

const PARTICLE_COUNT = 500;
const FIRE_HEIGHT = 120;
const GRAVITY = 0.015;
const WIND_STRENGTH = 0.002;
const SPARK_LIFETIME = 400;

let particles = [];
let bgColor;
let fireColor;
let constellations = [];

// Predefined constellation patterns (star positions relative to center)
const CONSTELLATION_PATTERNS = [
  // Orion
  [[-30, -10], [-20, 0], [-10, 10], [0, 20], [10, 10], [20, 0], [30, -10]],
  // Big Dipper
  [[-40, -30], [-30, -20], [-20, -10], [-10, 0], [0, 10], [10, 20], [20, 30]],
  // Cassiopeia
  [[-30, -20], [-15, -10], [0, 0], [15, -10], [30, -20]],
  // Ursa Major
  [[-30, -20], [-20, -10], [-10, 0], [0, 10], [10, 20], [20, 30], [30, 40]]
];

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
      trail: [],
      isCooling: false,
      constellationIndex: -1
    });
  }
  
  // Initialize constellations with positions
  for (let i = 0; i < 5; i++) {
    constellations.push({
      x: random(width),
      y: random(height * 0.3, height * 0.7),
      stars: [],
      opacity: 0,
      patternIndex: floor(random(CONSTELLATION_PATTERNS.length))
    });
  }
}

function draw() {
  background(bgColor);
  
  // Draw fire at bottom
  noStroke();
  fill(fireColor);
  for (let i = 0; i < 30; i++) {
    let x = random(width);
    let y = height - random(0, FIRE_HEIGHT);
    let r = random(8, 25);
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
      p.isCooling = false;
      p.constellationIndex = -1;
    }
    
    // Color transition from warm to cool as particle rises
    let t = map(p.pos.y, height, 0, 0, 1);
    t = constrain(t, 0, 1);
    
    // Transition to cooling phase
    if (p.lifetime < p.maxLifetime * 0.7 && !p.isCooling) {
      p.isCooling = true;
      p.constellationIndex = floor(random(constellations.length));
    }
    
    let newHue, newSat, newBright;
    if (p.isCooling) {
      // Cool blue-white
      newHue = lerp(240, 210, t); // Blue to cyan
      newSat = lerp(90, 80, t);
      newBright = lerp(95, 85, t);
    } else {
      // Warm orange to yellow
      newHue = lerp(20, 240, t); // Warm orange to cool blue
      newSat = lerp(80, 90, t);
      newBright = lerp(80, 95, t);
    }
    
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
    
    // If particle is cooling and has a constellation index, add it to that constellation
    if (p.isCooling && p.constellationIndex >= 0) {
      const constellation = constellations[p.constellationIndex];
      if (constellation.opacity < 1) {
        constellation.opacity += 0.005;
      }
      
      // Add particle to constellation's star array
      constellation.stars.push({
        x: p.pos.x,
        y: p.pos.y,
        age: 0
      });
    }
  }
  
  // Draw constellations
  for (let i = 0; i < constellations.length; i++) {
    let c = constellations[i];
    
    if (c.opacity > 0) {
      // Get pattern
      let pattern = CONSTELLATION_PATTERNS[c.patternIndex];
      
      // Draw connections between stars in this constellation
      stroke(210, 80, 95, c.opacity * 0.7);
      strokeWeight(1);
      noFill();
      
      beginShape(LINES);
      for (let j = 0; j < pattern.length - 1; j++) {
        let starA = pattern[j];
        let starB = pattern[j + 1];
        
        let x1 = c.x + starA[0];
        let y1 = c.y + starA[1];
        let x2 = c.x + starB[0];
        let y2 = c.y + starB[1];
        
        vertex(x1, y1);
        vertex(x2, y2);
      }
      endShape();
      
      // Draw stars of the constellation
      fill(210, 80, 95, c.opacity * 0.9);
      noStroke();
      
      beginShape(POINTS);
      for (let j = 0; j < c.stars.length; j++) {
        let star = c.stars[j];
        vertex(star.x, star.y);
      }
      endShape();
    }
  }
  
  // Occasionally create new constellations
  if (frameCount % 300 === 0 && frameCount > 500) {
    for (let i = 0; i < 2; i++) {
      let c = constellations[floor(random(constellations.length))];
      c.x = random(width);
      c.y = random(height * 0.3, height * 0.7);
      c.opacity = 0;
      c.stars = [];
      c.patternIndex = floor(random(CONSTELLATION_PATTERNS.length));
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
