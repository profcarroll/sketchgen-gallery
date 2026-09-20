let particles1 = [];
let particles2 = [];
let numParticles = 150;
let separationForce = 0.05;
let attractionForce = 0.03;
let maxSpeed = 2;
let minDistance = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize two streams of particles
  for (let i = 0; i < numParticles; i++) {
    particles1.push({
      x: random(width/4),
      y: random(height),
      vx: random(-1, 1),
      vy: random(-1, 1),
      color: color(random(200, 255), random(100, 200), random(200, 255)),
      size: random(3, 7)
    });
    
    particles2.push({
      x: random(3*width/4, width),
      y: random(height),
      vx: random(-1, 1),
      vy: random(-1, 1),
      color: color(random(100, 200), random(200, 255), random(100, 200)),
      size: random(3, 7)
    });
  }
}

function draw() {
  background(10, 10, 20);
  
  // Update and display particles for both streams
  for (let i = 0; i < numParticles; i++) {
    updateParticle(particles1[i]);
    updateParticle(particles2[i]);
    
    displayParticle(particles1[i]);
    displayParticle(particles2[i]);
  }
  
  // Check for interaction between streams
  checkInteraction();
}

function updateParticle(p) {
  // Apply velocity
  p.x += p.vx;
  p.y += p.vy;
  
  // Bounce off edges
  if (p.x < 0 || p.x > width) p.vx *= -1;
  if (p.y < 0 || p.y > height) p.vy *= -1;
  
  // Normalize velocity and apply max speed
  let speed = sqrt(p.vx * p.vx + p.vy * p.vy);
  if (speed > maxSpeed) {
    p.vx = (p.vx / speed) * maxSpeed;
    p.vy = (p.vy / speed) * maxSpeed;
  }
}

function displayParticle(p) {
  fill(p.color);
  ellipse(p.x, p.y, p.size);
}

function checkInteraction() {
  // Check distance between each particle in stream 1 and each in stream 2
  for (let i = 0; i < numParticles; i++) {
    let p1 = particles1[i];
    let p2 = particles2[i];
    
    let dx = p1.x - p2.x;
    let dy = p1.y - p2.y;
    let distance = sqrt(dx * dx + dy * dy);
    
    if (distance < minDistance) {
      // Calculate attraction forces
      let forceX = dx * attractionForce;
      let forceY = dy * attractionForce;
      
      // Apply to both particles
      p1.vx -= forceX;
      p1.vy -= forceY;
      p2.vx += forceX;
      p2.vy += forceY;
      
      // Add a visual effect for interaction
      fill(255, 200);
      ellipse((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, 10);
    } else {
      // Apply repulsion if too close
      if (distance < minDistance * 2) {
        let forceX = dx * separationForce;
        let forceY = dy * separationForce;
        
        p1.vx += forceX;
        p1.vy += forceY;
        p2.vx -= forceX;
        p2.vy -= forceY;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
