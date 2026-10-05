let rings = [];
const numRings = 12;
const baseRadius = 40;
const maxRadius = 500;
const growthSpeed = 0.3;
const pulseSpeed = 0.02;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize rings with varying properties
  for (let i = 0; i < numRings; i++) {
    rings.push({
      radius: baseRadius + i * 40,
      speed: 0.002 + i * 0.0002,
      hueOffset: i * 30,
      phase: random(TWO_PI),
      angleOffset: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.03);
  
  const cx = width / 2;
  const cy = height / 2;
  
  // Draw each ring
  for (let i = 0; i < rings.length; i++) {
    const ring = rings[i];
    
    // Update radius with steady growth
    ring.radius += growthSpeed;
    
    // Reset radius when it goes beyond max
    if (ring.radius > maxRadius) {
      ring.radius = baseRadius;
    }
    
    // Add gentle pulsation
    const pulse = sin(frameCount * pulseSpeed + ring.phase) * 8;
    
    // Calculate hue with smooth shifting color cycle
    const hue = (frameCount * 0.4 + ring.hueOffset) % 360;
    
    // Draw multiple concentric circles per ring for depth
    stroke(hue, 70, 85, 0.7);
    noFill();
    
    const points = 100;
    const circleCount = 4;
    
    for (let j = 0; j < circleCount; j++) {
      const circleRadius = ring.radius + pulse + j * 12;
      
      beginShape();
      for (let a = 0; a < TWO_PI; a += TWO_PI / points) {
        // Apply gentle spiral offset
        const angle = a + ring.angleOffset * 0.2;
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
