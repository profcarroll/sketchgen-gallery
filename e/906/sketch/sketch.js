let rings = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(GRAY);
  noStroke();
  
  // Initialize rings
  for (let i = 0; i < 20; i++) {
    rings.push({
      radius: 0,
      maxRadius: max(width, height) * 0.8,
      speed: random(0.5, 2),
      opacity: random(30, 100)
    });
  }
}

function draw() {
  background(0);
  
  // Update and display rings
  for (let i = 0; i < rings.length; i++) {
    let ring = rings[i];
    
    // Update radius
    ring.radius += ring.speed;
    
    // Reset ring when it exceeds max radius
    if (ring.radius > ring.maxRadius) {
      ring.radius = 0;
      ring.opacity = random(30, 100);
    }
    
    // Draw ring with varying opacity and size
    let alpha = map(ring.radius, 0, ring.maxRadius, ring.opacity, 0);
    fill(alpha);
    
    ellipse(width/2, height/2, ring.radius * 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
