let rings = [];
const numRings = 15;
const baseRadius = 30;
const maxRadius = 400;
const expansionSpeed = 0.05;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize rings with varying properties
  for (let i = 0; i < numRings; i++) {
    rings.push({
      radius: baseRadius + i * 20,
      speed: 0.002 + i * 0.0003,
      hueOffset: i * 24,
      phase: random(TWO_PI)
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
    
    // Update radius with steady expansion
    ring.radius += expansionSpeed;
    
    // Reset radius when it exceeds max
    if (ring.radius > maxRadius) {
      ring.radius = baseRadius + i * 20;
    }
    
    // Calculate hue with smooth shifting color cycle
    const hue = (frameCount * 0.5 + ring.hueOffset) % 360;
    
    // Draw multiple concentric circles per ring for depth
    stroke(hue, 90, 95, 0.7);
    noFill();
    
    const points = 80;
    const circleCount = 5;
    
    for (let j = 0; j < circleCount; j++) {
      const circleRadius = ring.radius + j * 15;
      
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
