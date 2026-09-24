let rings = [];
const numRings = 15;
const baseRadius = 50;
const maxRadius = 300;
const pulseSpeed = 0.02;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize rings with varying colors and offsets
  for (let i = 0; i < numRings; i++) {
    const hue = (i * 24) % 360;
    const offset = random(TWO_PI);
    rings.push({
      hue: hue,
      offset: offset,
      baseRadius: baseRadius + i * 15
    });
  }
}

function draw() {
  background(0, 0, 0);
  
  // Center of canvas
  const cx = width / 2;
  const cy = height / 2;
  
  // Calculate pulse effect using sine wave
  const pulse = sin(frameCount * pulseSpeed) * 0.2 + 1;
  
  // Draw each ring
  for (let i = 0; i < rings.length; i++) {
    const ring = rings[i];
    const radius = ring.baseRadius * pulse;
    
    // Set color with slight variation
    stroke(ring.hue, 100, 100, 0.8);
    noFill();
    
    // Draw multiple concentric circles per ring
    for (let j = 0; j < 5; j++) {
      const circleRadius = radius + j * 8;
      strokeWeight(2);
      
      // Use a phase offset to animate each ring differently
      const phase = frameCount * 0.01 + ring.offset;
      const points = 60;
      
      beginShape();
      for (let a = 0; a < TWO_PI; a += TWO_PI / points) {
        const x = cx + cos(a + phase) * circleRadius;
        const y = cy + sin(a + phase) * circleRadius;
        vertex(x, y);
      }
      endShape(CLOSE);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
