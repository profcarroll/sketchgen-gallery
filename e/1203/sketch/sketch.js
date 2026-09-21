let rings = [];
let numRings = 20;
let maxRadius;

function setup() {
  createCanvas(windowWidth, windowHeight);
  maxRadius = max(width, height) / 2;
  // Initialize rings with starting positions
  for (let i = 0; i < numRings; i++) {
    rings.push({
      radius: 0,
      speed: 0.5 + i * 0.1, // Each ring has a different initial speed
      color: color(255, 255, 255, 150),
      angle: 0
    });
  }
}

function draw() {
  background(0);
  
  // Update and draw rings
  for (let i = 0; i < rings.length; i++) {
    let ring = rings[i];
    
    // Accelerate the speed over time
    ring.speed += 0.005;
    
    // Update radius based on speed
    ring.radius += ring.speed;
    
    // Draw ring as a circle
    noFill();
    stroke(ring.color);
    strokeWeight(2);
    ellipse(width/2, height/2, ring.radius * 2);
    
    // Reset ring if it goes off screen
    if (ring.radius > maxRadius * 1.5) {
      ring.radius = 0;
      ring.speed = 0.5 + i * 0.1; // Reset speed
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  maxRadius = max(width, height) / 2;
}
