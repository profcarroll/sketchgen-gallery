let crystals = [];
let orb;
let caveDepth = 0;
let depthDirection = 1;
let particles = [];

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create stalactites
  for (let i = 0; i < 20; i++) {
    crystals.push({
      x: random(width),
      y: random(-50, -10),
      size: random(5, 15),
      hue: random(180, 240),
      speed: random(0.01, 0.03),
      pulse: 0,
      pulseSpeed: random(0.02, 0.05)
    });
  }
  
  // Create glowing orb
  orb = {
    x: width/2,
    y: height/2,
    size: 20,
    hue: 60,
    saturation: 100,
    brightness: 100
  };
  
  // Create particles for cave floor
  for (let i = 0; i < 300; i++) {
    particles.push({
      x: random(width),
      y: height + random(-20, 0),
      size: random(0.5, 2),
      hue: random(200, 260),
      speed: random(0.1, 0.3)
    });
  }
}

function draw() {
  background(0);
  
  // Cave depth animation
  caveDepth += depthDirection * 0.2;
  if (caveDepth > 20 || caveDepth < -20) {
    depthDirection *= -1;
  }
  
  // Draw particles on floor
  for (let p of particles) {
    fill(p.hue, 50, 80, 0.7);
    noStroke();
    ellipse(p.x, p.y, p.size);
    
    p.y += p.speed;
    if (p.y > height + 20) {
      p.y = -20;
      p.x = random(width);
    }
  }
  
  // Draw crystals
  for (let c of crystals) {
    c.pulse += c.pulseSpeed;
    
    let pulseSize = sin(c.pulse) * 2;
    let brightness = 80 + sin(c.pulse) * 20;
    
    fill(c.hue, 80, brightness, 0.9);
    noStroke();
    
    // Draw crystal shape
    push();
    translate(c.x, c.y);
    rotate(frameCount * 0.01);
    
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI / 6 * i;
      let x = cos(angle) * (c.size + pulseSize);
      let y = sin(angle) * (c.size + pulseSize);
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Add inner glow
    fill(c.hue, 100, 100, 0.3);
    ellipse(0, 0, c.size * 0.8 + pulseSize * 0.5);
    
    pop();
    
    // Move crystal down
    c.y += c.speed;
    if (c.y > height + 50) {
      c.y = random(-50, -10);
      c.x = random(width);
    }
  }
  
  // Draw orb that follows mouse
  let targetX = mouseX;
  let targetY = mouseY;
  
  orb.x += (targetX - orb.x) * 0.05;
  orb.y += (targetY - orb.y) * 0.05;
  
  fill(orb.hue, orb.saturation, orb.brightness, 0.8);
  noStroke();
  ellipse(orb.x, orb.y, orb.size);
  
  // Add glow effect to orb
  for (let i = 0; i < 5; i++) {
    let alpha = 0.1 * (5 - i);
    fill(orb.hue, orb.saturation, orb.brightness, alpha);
    ellipse(orb.x, orb.y, orb.size + i * 10);
  }
  
  // Create shadows from crystals
  for (let c of crystals) {
    let shadowX = c.x;
    let shadowY = height - 50;
    
    fill(c.hue, 20, 20, 0.3);
    noStroke();
    ellipse(shadowX, shadowY, c.size * 2);
  }
  
  // Animate cave depth effect
  for (let i = 0; i < 10; i++) {
    let y = height/2 + caveDepth + i * 20;
    if (y > 0 && y < height) {
      stroke(0, 0, 0, 0.2);
      line(0, y, width, y);
    }
  }
}
