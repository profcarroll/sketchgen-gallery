let rings = [];
let numRings = 300;
let centerX, centerY;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  centerX = 0;
  centerY = 0;
  
  // Create rings with varying properties
  for (let i = 0; i < numRings; i++) {
    let angle = random(TWO_PI);
    let distance = random(100, 300);
    let radius = random(5, 15);
    let speed = random(0.002, 0.008);
    let tilt = random(0.1, 0.5);
    let hue = (i * 7) % 360;
    
    rings.push({
      angle: angle,
      distance: distance,
      radius: radius,
      speed: speed,
      tilt: tilt,
      hue: hue,
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 5, 1);
  
  // Center the view
  translate(0, 0, -300);
  
  // Rotate the entire scene slowly
  rotateY(time * 0.0002);
  
  for (let ring of rings) {
    // Update angle based on time and individual properties
    let angle = ring.angle + time * ring.speed + ring.phase;
    
    // Calculate position in 3D space
    let x = cos(angle) * ring.distance;
    let y = sin(angle) * ring.distance;
    let z = sin(time * 0.001 + ring.phase) * 50 * ring.tilt;
    
    push();
    translate(x, y, z);
    
    // Tilt the ring
    rotateX(ring.tilt * PI / 2);
    rotateY(angle);
    
    // Draw the ring with brass-like material
    fill(ring.hue, 30, 85, 1);
    stroke(ring.hue, 40, 95, 1);
    strokeWeight(0.5);
    
    // Draw a circle (ring)
    ellipse(0, 0, ring.radius * 2, ring.radius * 2);
    
    pop();
  }
  
  time += 1;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
