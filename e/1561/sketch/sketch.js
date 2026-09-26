let rings = [];
const numRings = 15;
const baseRadius = 50;
const maxRadius = 300;
const motionSpeed = 0.02;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize rings with varying colors and offsets
  for (let i = 0; i < numRings; i++) {
    const hue = (i * 24) % 360;
    rings.push({
      hue: hue,
      radius: baseRadius + i * 15,
      speed: 0.005 + i * 0.0005,
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 0);
  
  // Center of canvas
  const cx = width / 2;
  const cy = height / 2;
  
  // Draw each ring
  for (let i = 0; i < rings.length; i++) {
    const ring = rings[i];
    
    // Update radius with inward motion
    ring.radius += sin(frameCount * ring.speed + ring.phase) * 0.5;
    
    // Keep radius within bounds
    if (ring.radius < 10) ring.radius = baseRadius + i * 15;
    if (ring.radius > maxRadius) ring.radius = maxRadius;
    
    // Set color with slight variation
    stroke(ring.hue, 100, 100, 0.8);
    noFill();
    
    // Draw multiple concentric circles per ring
    for (let j = 0; j < 3; j++) {
      const circleRadius = ring.radius + j * 8;
      strokeWeight(2);
      
      // Use a phase offset to animate each ring differently
      const points = 60;
      
      beginShape();
      for (let a = 0; a < TWO_PI; a += TWO_PI / points) {
        const x = cx + cos(a) * circleRadius;
        const y = cy + sin(a) * circleRadius;
        vertex(x, y);
      }
      endShape(CLOSE);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
