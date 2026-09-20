let particles1 = [];
let particles2 = [];
const numParticles = 100;
const separationDistance = 80;
const attractionStrength = 0.05;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize two streams of particles
  for (let i = 0; i < numParticles; i++) {
    particles1.push({
      x: random(width / 4),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      color: color(random(200, 255), random(100, 200), random(200, 255))
    });
    particles2.push({
      x: random(width * 3/4, width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      color: color(random(100, 200), random(200, 255), random(100, 200))
    });
  }
}

function draw() {
  background(10);

  // Update and display particles for stream 1
  for (let i = 0; i < particles1.length; i++) {
    let p = particles1[i];
    
    // Apply velocity
    p.x += p.vx;
    p.y += p.vy;

    // Boundary check
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    fill(p.color);
    noStroke();
    ellipse(p.x, p.y, 8);

    // Apply attraction to stream 2
    for (let j = 0; j < particles2.length; j++) {
      let other = particles2[j];
      let d = dist(p.x, p.y, other.x, other.y);
      
      if (d < separationDistance && d > 0) {
        let force = map(d, 0, separationDistance, 1, 0);
        let angle = atan2(p.y - other.y, p.x - other.x);
        
        p.vx += cos(angle) * force * attractionStrength;
        p.vy += sin(angle) * force * attractionStrength;
      }
    }
  }

  // Update and display particles for stream 2
  for (let i = 0; i < particles2.length; i++) {
    let p = particles2[i];
    
    // Apply velocity
    p.x += p.vx;
    p.y += p.vy;

    // Boundary check
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    fill(p.color);
    noStroke();
    ellipse(p.x, p.y, 8);

    // Apply attraction to stream 1
    for (let j = 0; j < particles1.length; j++) {
      let other = particles1[j];
      let d = dist(p.x, p.y, other.x, other.y);
      
      if (d < separationDistance && d > 0) {
        let force = map(d, 0, separationDistance, 1, 0);
        let angle = atan2(p.y - other.y, p.x - other.x);
        
        p.vx += cos(angle) * force * attractionStrength;
        p.vy += sin(angle) * force * attractionStrength;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
