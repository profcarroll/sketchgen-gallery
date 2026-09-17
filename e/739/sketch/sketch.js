let rings = [];
const maxRings = 20;
const palette = [0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 255];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize rings from center
  for (let i = 0; i < maxRings; i++) {
    rings.push({
      radius: 0,
      speed: random(0.2, 0.8),
      hue: palette[i % palette.length],
      alpha: random(50, 150)
    });
  }
}

function draw() {
  background(255);
  
  // Center of canvas
  const cx = width / 2;
  const cy = height / 2;

  // Update and draw rings
  for (let i = 0; i < rings.length; i++) {
    let ring = rings[i];
    
    // Expand/contract rhythmically
    ring.radius += sin(frameCount * 0.02 + i) * ring.speed;
    
    // Draw ring with grayscale color
    stroke(ring.hue);
    noFill();
    strokeWeight(1);
    ellipse(cx, cy, ring.radius * 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
