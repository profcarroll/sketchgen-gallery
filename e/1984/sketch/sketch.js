let particles = [];
let sludge;
let time = 0;

class Particle {
  constructor(x, y, size, isSolid) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.isSolid = isSolid;
    this.targetSize = size;
    this.color = color(random(100, 255), random(100, 255), random(100, 255));
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.5, 0.5);
    this.growthRate = random(0.001, 0.005);
    this.shrinkRate = random(0.001, 0.003);
    this.isMorphing = false;
    this.morphProgress = 0;
  }

  update() {
    if (this.isSolid) {
      // Solid particles move slowly and grow
      this.x += this.vx;
      this.y += this.vy;
      
      if (random() < 0.01) {
        this.vx = random(-0.5, 0.5);
        this.vy = random(-0.5, 0.5);
      }
      
      // Gradually shrink to amorphous form
      if (this.size > 2) {
        this.size -= this.shrinkRate;
      } else {
        this.isSolid = false;
      }
    } else {
      // Amorphous particles flow and grow
      this.x += random(-0.3, 0.3);
      this.y += random(-0.3, 0.3);
      
      if (this.size < 15) {
        this.size += this.growthRate;
      }
    }
    
    // Boundary check
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  draw() {
    noStroke();
    fill(this.color);
    
    if (this.isSolid) {
      // Draw solid particles with a crystalline look
      push();
      translate(this.x, this.y);
      rotate(time * 0.01);
      rectMode(CENTER);
      rect(0, 0, this.size, this.size);
      pop();
    } else {
      // Draw amorphous particles as soft blobs
      ellipse(this.x, this.y, this.size, this.size);
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial solid particles (puzzle pieces)
  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(8, 16);
    particles.push(new Particle(x, y, size, true));
  }
  
  // Create sludge background
  sludge = createGraphics(width, height);
  sludge.colorMode(HSB, 360, 100, 100, 1);
  sludge.background(200, 30, 80);
  
  // Add some initial sludge texture
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(2, 8);
    sludge.noStroke();
    sludge.fill(200, 30, 70, 0.3);
    sludge.ellipse(x, y, size, size);
  }
  
  // Add some texture to the sludge
  for (let i = 0; i < 500; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(1, 4);
    sludge.noStroke();
    sludge.fill(200, 30, 85, 0.2);
    sludge.ellipse(x, y, size, size);
  }
}

function draw() {
  background(200, 30, 80);
  
  // Draw the sludge background
  image(sludge, 0, 0);
  
  time++;
  
  // Update and draw particles
  for (let particle of particles) {
    particle.update();
    particle.draw();
  }
  
  // Occasionally transform solid particles into amorphous ones
  if (random() < 0.005) {
    let solidParticle = particles.filter(p => p.isSolid);
    if (solidParticle.length > 0) {
      let target = random(solidParticle);
      target.isSolid = false;
      target.size = 3;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
