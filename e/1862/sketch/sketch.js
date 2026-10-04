let rings = [];
const numRings = 15;
const baseRadius = 50;
const maxRadius = 600;
const contractionSpeed = 1.2;
const pulseSpeed = 0.03;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize rings with varying properties
  for (let i = 0; i < numRings; i++) {
    rings.push({
      radius: baseRadius + i * 40,
      speed: 0.003 + i * 0.0003,
      hueOffset: i * 20,
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
    
    // Add gentle pulsation
    const pulse = sin(frameCount * pulseSpeed + ring.phase) * 10;
    
    // Calculate hue with smooth shifting color cycle
    const hue = (frameCount * 0.5 + ring.hueOffset) % 360;
    
    // Draw multiple concentric circles per ring for depth
    stroke(hue, 80, 90, 0.8);
    noFill();
    
    const points = 120;
    const circleCount = 3;
    
    for (let j = 0; j < circleCount; j++) {
      const circleRadius = ring.radius + pulse + j * 15;
      
      beginShape();
      for (let a = 0; a < TWO_PI; a += TWO_PI / points) {
        // Apply gentle spiral offset
        const angle = a + ring.angleOffset * 0.3;
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
