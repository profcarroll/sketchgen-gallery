let arcs = [];
const numArcs = 20;
const maxRadius = 300;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize arcs with random properties
  for (let i = 0; i < numArcs; i++) {
    arcs.push({
      radius: random(50, maxRadius),
      angle: random(TWO_PI),
      speed: random(0.005, 0.02),
      hue: random(360),
      strokeWidth: random(1, 3)
    });
  }
}

function draw() {
  background(0, 0, 10);
  
  // Center of canvas
  const cx = width / 2;
  const cy = height / 2;
  
  // Draw each arc
  for (let i = 0; i < arcs.length; i++) {
    let arc = arcs[i];
    
    // Update angle and hue
    arc.angle += arc.speed;
    arc.hue = (arc.hue + 0.5) % 360;
    
    // Calculate pulsing radius
    const pulse = sin(frameCount * 0.02 + i) * 30 + 50;
    const currentRadius = arc.radius + pulse;
    
    // Draw the arc
    noFill();
    stroke(arc.hue, 80, 90, 0.7);
    strokeWeight(arc.strokeWidth);
    
    // Draw a segment of the arc
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.05) {
      const x = cx + cos(a + arc.angle) * currentRadius;
      const y = cy + sin(a + arc.angle) * currentRadius;
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
