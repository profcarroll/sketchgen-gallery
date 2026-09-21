let particles = [];
let lattices = [];
let time = 0;
let tension = 0;
let discharge = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles
  for (let i = 0; i < 500; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-1, 1),
      vy: random(-1, 1),
      size: random(2, 8),
      hue: random(360),
      age: 0
    });
  }
  
  // Initialize lattices
  for (let i = 0; i < 10; i++) {
    lattices.push({
      centerX: random(width),
      centerY: random(height),
      radius: random(50, 200),
      rotation: random(TWO_PI),
      segments: floor(random(6, 12)),
      intensity: 0
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05); // Semi-transparent background for trail effect
  
  time += 0.01;
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Apply physics
    p.x += p.vx;
    p.y += p.vy;
    p.age++;
    
    // Boundary check
    if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      p.x = random(width);
      p.y = random(height);
      p.age = 0;
    }
    
    // Update hue based on age and position
    p.hue = (p.hue + 0.5) % 360;
    
    // Draw particle
    noStroke();
    fill(p.hue, 80, 90, 0.7);
    ellipse(p.x, p.y, p.size);
  }
  
  // Update and display lattices
  tension = 0;
  for (let i = 0; i < lattices.length; i++) {
    let lattice = lattices[i];
    
    // Update lattice parameters
    lattice.rotation += 0.002;
    lattice.radius = 150 + 50 * sin(time + i);
    lattice.intensity = map(sin(time * 2 + i), -1, 1, 0.3, 1);
    
    tension += lattice.intensity;
    
    // Draw lattice structure
    push();
    translate(lattice.centerX, lattice.centerY);
    rotate(lattice.rotation);
    
    stroke(200, 80, 90, 0.6);
    strokeWeight(1);
    noFill();
    
    // Draw polygon segments
    beginShape();
    for (let j = 0; j < lattice.segments; j++) {
      let angle = TWO_PI * j / lattice.segments;
      let x = lattice.radius * cos(angle);
      let y = lattice.radius * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Draw connecting lines
    strokeWeight(0.5);
    for (let j = 0; j < lattice.segments; j++) {
      let angle1 = TWO_PI * j / lattice.segments;
      let angle2 = TWO_PI * (j + 1) % lattice.segments / lattice.segments;
      
      let x1 = lattice.radius * cos(angle1);
      let y1 = lattice.radius * sin(angle1);
      let x2 = lattice.radius * cos(angle2);
      let y2 = lattice.radius * sin(angle2);
      
      line(x1, y1, x2, y2);
    }
    
    pop();
  }
  
  tension /= lattices.length;
  
  // Check for discharge condition
  if (tension > 0.95 && !discharge) {
    discharge = true;
    // Create explosion effect
    for (let i = 0; i < 200; i++) {
      particles.push({
        x: width/2,
        y: height/2,
        vx: random(-3, 3),
        vy: random(-3, 3),
        size: random(1, 5),
        hue: random(360),
        age: 0
      });
    }
  }
  
  // Handle discharge animation
  if (discharge) {
    for (let i = particles.length - 1; i >= 0; i--) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1; // Gravity effect
      p.size *= 0.97;
      
      if (p.size < 0.5) {
        particles.splice(i, 1);
      } else {
        noStroke();
        fill(p.hue, 80, 90, 0.7);
        ellipse(p.x, p.y, p.size);
      }
    }
    
    // Reset discharge after a while
    if (particles.length < 50) {
      discharge = false;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
