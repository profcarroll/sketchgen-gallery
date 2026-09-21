let particles1 = [];
let particles2 = [];
let trails1 = [];
let trails2 = [];
const numParticles = 100;
const trailLength = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize two streams of particles
  for (let i = 0; i < numParticles; i++) {
    particles1.push({
      x: random(width),
      y: random(height),
      vx: random(-1, 1),
      vy: random(-1, 1),
      hue: random(0, 60), // Red-orange
      size: random(2, 6)
    });
    
    particles2.push({
      x: random(width),
      y: random(height),
      vx: random(-1, 1),
      vy: random(-1, 1),
      hue: random(180, 240), // Blue-green
      size: random(2, 6)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05); // Semi-transparent background for trail effect
  
  // Update and display particles for stream 1
  for (let i = 0; i < particles1.length; i++) {
    let p = particles1[i];
    
    // Update position
    p.x += p.vx;
    p.y += p.vy;
    
    // Boundary check - wrap around
    if (p.x > width) p.x = 0;
    else if (p.x < 0) p.x = width;
    if (p.y > height) p.y = 0;
    else if (p.y < 0) p.y = height;
    
    // Add to trail
    trails1[i] = trails1[i] || [];
    trails1[i].push({x: p.x, y: p.y});
    if (trails1[i].length > trailLength) {
      trails1[i].shift();
    }
    
    // Draw trail
    noFill();
    stroke(p.hue, 80, 90, 0.3);
    beginShape();
    for (let j = 0; j < trails1[i].length; j++) {
      let t = trails1[i][j];
      vertex(t.x, t.y);
    }
    endShape();
    
    // Draw particle
    fill(p.hue, 80, 90);
    noStroke();
    ellipse(p.x, p.y, p.size);
  }
  
  // Update and display particles for stream 2
  for (let i = 0; i < particles2.length; i++) {
    let p = particles2[i];
    
    // Update position
    p.x += p.vx;
    p.y += p.vy;
    
    // Boundary check - wrap around
    if (p.x > width) p.x = 0;
    else if (p.x < 0) p.x = width;
    if (p.y > height) p.y = 0;
    else if (p.y < 0) p.y = height;
    
    // Add to trail
    trails2[i] = trails2[i] || [];
    trails2[i].push({x: p.x, y: p.y});
    if (trails2[i].length > trailLength) {
      trails2[i].shift();
    }
    
    // Draw trail
    noFill();
    stroke(p.hue, 80, 90, 0.3);
    beginShape();
    for (let j = 0; j < trails2[i].length; j++) {
      let t = trails2[i][j];
      vertex(t.x, t.y);
    }
    endShape();
    
    // Draw particle
    fill(p.hue, 80, 90);
    noStroke();
    ellipse(p.x, p.y, p.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
