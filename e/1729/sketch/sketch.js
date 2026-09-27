let rings = [];
const numRings = 20;
const baseRadius = 40;
const maxRadius = 350;
const motionSpeed = 0.02;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize rings with varying colors and offsets
  for (let i = 0; i < numRings; i++) {
    const hue = (i * 18 + frameCount * 0.5) % 360;
    rings.push({
      hue: hue,
      radius: baseRadius + i * 12,
      speed: 0.003 + i * 0.0004,
      phase: random(TWO_PI),
      spiralSpeed: 0.001 + i * 0.0002
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05);
  
  // Center of canvas
  const cx = width / 2;
  const cy = height / 2;
  
  // Draw each ring
  for (let i = 0; i < rings.length; i++) {
    const ring = rings[i];
    
    // Update radius with pulsing motion
    const pulse = sin(frameCount * ring.speed + ring.phase) * 0.8;
    ring.radius += pulse;
    
    // Keep radius within bounds
    if (ring.radius < 10) ring.radius = baseRadius + i * 12;
    if (ring.radius > maxRadius) ring.radius = maxRadius;
    
    // Update color with shifting hue
    const hueShift = sin(frameCount * 0.005 + i * 0.1) * 10;
    const currentHue = (ring.hue + hueShift) % 360;
    
    // Update spiral motion
    const spiral = sin(frameCount * ring.spiralSpeed) * 0.3;
    const spiralRadius = ring.radius - spiral * 25;
    
    // Set color with slight variation and metallic shimmer
    stroke(currentHue, 80, 90, 0.7);
    noFill();
    
    // Draw multiple concentric circles per ring
    for (let j = 0; j < 4; j++) {
      const circleRadius = spiralRadius + j * 10;
      strokeWeight(1.5);
      
      // Use a phase offset to animate each ring differently
      const points = 80;
      
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
