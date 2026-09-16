let particles = [];
const center = { x: 0, y: 0 };
let orbitRadius = 200;
let isDragging = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  center.x = width / 2;
  center.y = height / 2;
  
  // Create particles
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: 0,
      vy: 0,
      angle: random(TWO_PI),
      radius: random(2, 6),
      color: color(random(100, 255), random(100, 255), random(200, 255), 200)
    });
  }
}

function draw() {
  background(10);
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Calculate distance to center
    let dx = center.x - p.x;
    let dy = center.y - p.y;
    let distance = sqrt(dx * dx + dy * dy);
    
    // Apply centripetal force (inverse square law)
    let force = 0.0005 * orbitRadius / (distance * distance + 100);
    p.vx += dx * force;
    p.vy += dy * force;
    
    // Add some randomness to keep motion fluid
    p.vx += random(-0.05, 0.05);
    p.vy += random(-0.05, 0.05);
    
    // Update position with velocity
    p.x += p.vx;
    p.y += p.vy;
    
    // Keep particles within bounds with wraparound
    if (p.x < -50) p.x = width + 50;
    if (p.x > width + 50) p.x = -50;
    if (p.y < -50) p.y = height + 50;
    if (p.y > height + 50) p.y = -50;
    
    // Draw particle
    noStroke();
    fill(p.color);
    ellipse(p.x, p.y, p.radius);
  }
}

function mousePressed() {
  // Set new center point on click
  center.x = mouseX;
  center.y = mouseY;
  isDragging = false;
}

function mouseDragged() {
  isDragging = true;
  // Adjust orbit radius based on vertical drag
  orbitRadius = constrain(orbitRadius + (mouseY - pmouseY) * 0.5, 50, 400);
}
