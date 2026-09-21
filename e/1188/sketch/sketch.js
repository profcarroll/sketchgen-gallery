// Particle for the ice rink effect
class Particle {
  constructor() {
    // Start near the center with small random offset
    this.pos = createVector(width / 2 + random(-10, 10), height / 2 + random(-10, 10));
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.aging = 0;
    this.size = random(2, 5);
    this.maxAge = random(100, 200);
    this.height = 0; // Height of pillar
  }

  update() {
    this.pos.add(this.vel);
    this.aging++;
    
    // Increase pillar height over time
    if (this.height < 100) {
      this.height += 0.5;
    }
    
    // Wrap around edges
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
  }

  finished() {
    return this.aging > this.maxAge;
  }
}

let particles = [];
let pillars = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // Reduce sphere detail for performance
  // noLoop(); // Uncomment for static image
  frameRate(30);
}

function draw() {
  background(0, 5, 20);
  
  // Camera setup
  resetMatrix();
  translate(-width / 2, -height / 2, 0);
  
  // Add new particles
  if (frameCount % 5 === 0) {
    particles.push(new Particle());
  }
  
  // Update and show particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    
    // Draw the particle trail (line from current to previous position)
    stroke(255, 200);
    strokeWeight(1);
    line(p.pos.x, p.pos.y, 0, p.pos.x, p.pos.y, -p.height);
    
    if (p.finished()) {
      // Convert to pillar when particle finishes
      pillars.push({
        pos: p.pos.copy(),
        height: p.height,
        aging: p.aging
      });
      particles.splice(i, 1);
    }
  }
  
  // Update and draw pillars
  for (let i = pillars.length - 1; i >= 0; i--) {
    let p = pillars[i];
    p.aging++;
    
    // Slowly fade pillars
    let alpha = 255 - p.aging * 0.5;
    
    push();
    translate(p.pos.x, p.pos.y, 0);
    // Draw a vertical pillar with glowing effect
    for (let j = 0; j < p.height; j += 5) {
      push();
      rotateX(-PI / 2);
      translate(0, j / 50 - p.height / 100, 0);
      // Thin glowing pillar
      ambientLight(50);
      directionalLight(255, 255, 255, 0, -1, 0);
      noStroke();
      fill(255, 200, 255, alpha);
      // Use points for performance - draw pillar as series of points
      box(3, 3, 3);
      pop();
    }
    pop();
    
    // Remove old pillars
    if (p.aging > 300) {
      pillars.splice(i, 1);
    }
  }
  
  // Limit total count
  if (particles.length > 500) particles.splice(0, 100);
  if (pillars.length > 200) pillars.splice(0, 100);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
