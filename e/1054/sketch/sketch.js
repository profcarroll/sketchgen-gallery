let crystals = [];
let particles = [];
let MAX_CRYSTALS = 500;
let MAX_PARTICLES = 1000;
let gridSize = 50;
let grid;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  frameRate(30);
  
  // Initialize some crystals
  for (let i = 0; i < 100; i++) {
    crystals.push(createCrystal());
  }
  
  // Initialize particles
  for (let i = 0; i < MAX_PARTICLES; i++) {
    particles.push(createParticle());
  }
  
  // Initialize spatial grid
  grid = createGraphics(width, height);
}

function draw() {
  background(0, 5, 10);
  
  // Update and draw particles
  drawParticles();
  
  // Update and draw crystals
  updateCrystals();
  drawCrystals();
}

function createCrystal() {
  let x = random(width);
  let y = random(-height * 2, 0);
  let size = random(5, 20);
  let hue = random(180, 280);
  let pulseSpeed = random(0.01, 0.03);
  let pulsePhase = random(TWO_PI);
  return {
    x: x,
    y: y,
    size: size,
    baseSize: size,
    hue: hue,
    brightness: 50,
    pulsePhase: pulsePhase,
    pulseSpeed: pulseSpeed,
    speed: random(0.2, 0.8),
    growthRate: random(0.1, 0.3)
  };
}

function createParticle() {
  return {
    x: random(width),
    y: random(height),
    size: random(1, 4),
    speed: random(0.1, 0.5),
    hue: random(200, 250),
    brightness: random(30, 70)
  };
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawParticles() {
  noStroke();
  beginShape(POINTS);
  
  for (let p of particles) {
    p.y += p.speed;
    if (p.y > height) p.y = 0;
    
    p.brightness = 50 + sin(frameCount * 0.01 + p.x * 0.01) * 20;
    
    fill(p.hue, 80, p.brightness, 60);
    vertex(p.x, p.y);
  }
  
  endShape();
}

function updateCrystals() {
  for (let c of crystals) {
    c.y += c.speed;
    c.pulsePhase += c.pulseSpeed;
    
    // Gentle pulsing
    let pulse = sin(c.pulsePhase) * 0.3 + 0.7;
    c.brightness = 50 + pulse * 30;
    
    // Check distance to mouse
    if (mouseIsPressed) {
      let d = dist(mouseX, mouseY, c.x, c.y);
      if (d < 100) {
        c.brightness = map(d, 0, 100, 100, 50);
        c.size = c.baseSize * (1 + (100 - d) / 100);
      }
    }
    
    // Reset if reached floor or out of bounds
    if (c.y > height + 100 || c.x < -20 || c.x > width + 20) {
      let idx = crystals.indexOf(c);
      if (idx > -1) crystals.splice(idx, 1);
      crystals.push(createCrystal());
    }
  }
}

function drawCrystals() {
  // Draw crystal cores as points
  beginShape(POINTS);
  
  for (let c of crystals) {
    fill(c.hue, 80, c.brightness, 80);
    vertex(c.x, c.y);
  }
  
  endShape();
  
  // Draw crystal branches
  strokeWeight(1);
  for (let c of crystals) {
    // Main glow
    noFill();
  }
  
  // Draw glow halos
  noFill();
  for (let c of crystals) {
    let glowSize = c.size * 2;
    stroke(c.hue, 60, c.brightness, 30);
    arc(c.x, c.y, glowSize * 2, glowSize, 0, PI);
  }
  noStroke();
}

function mouseDragged() {
  // Create crystals along mouse path
  let spacing = 20;
  let steps = dist(pmouseX, pmouseY, mouseX, mouseY) / spacing;
  
  for (let i = 0; i <= steps; i++) {
    let t = i / steps;
    let x = lerp(pmouseX, mouseX, t);
    let y = lerp(pmouseY, mouseY, t);
    
    if (crystals.length < MAX_CRYSTALS) {
      let c = {
        x: x,
        y: y - height,
        size: random(5, 15),
        baseSize: random(5, 15),
        hue: random(200, 250),
        brightness: 70,
        pulsePhase: frameCount * 0.02 + x * 0.01,
        pulseSpeed: random(0.005, 0.02),
        speed: 0.3,
        growthRate: 0.2
      };
      crystals.push(c);
    }
  }
}

function mousePressed() {
  // Start audio if needed (for future expansion)
  // userStartAudio();
}
