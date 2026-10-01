let rings = [];
const numRings = 20;
const baseRadius = 50;
const maxRadius = 600;
const contractionSpeed = 0.8;
const spiralSpeed = 0.01;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize rings with varying properties
  for (let i = 0; i < numRings; i++) {
    rings.push({
      radius: baseRadius + i * 30,
      speed: 0.002 + i * 0.0005,
      hueOffset: i * 18,
      phase: random(TWO_PI),
      angleOffset: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05);
  
  const cx = width / 2;
  const cy = height / 2;
  
  // Draw each ring
  for (let i = 0; i < rings.length; i++) {
    const ring = rings[i];
    
    // Update radius with steady contraction
    ring.radius -= contractionSpeed;
    
    // Reset radius when it goes below base
    if (ring.radius < baseRadius) {
      ring.radius = maxRadius;
    }
    
    // Add spiral motion
    ring.angleOffset += spiralSpeed;
    
    // Calculate hue with smooth shifting color cycle
    const hue = (frameCount * 0.8 + ring.hueOffset) % 360;
    
    // Draw multiple concentric circles per ring for depth
    stroke(hue, 90, 95, 0.7);
    noFill();
    
    const points = 100;
    const circleCount = 4;
    
    for (let j = 0; j < circleCount; j++) {
      const circleRadius = ring.radius + j * 20;
      
      beginShape();
      for (let a = 0; a < TWO_PI; a += TWO_PI / points) {
        // Apply spiral offset
        const angle = a + ring.angleOffset * 0.5;
        const x = cx + cos(angle) * circleRadius;
        const y = cy + sin(angle) * circleRadius;
        vertex(x, y);
      }
      endShape(CLOSE);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
