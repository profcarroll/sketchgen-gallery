let gradients = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a set of overlapping gradient layers
  for (let i = 0; i < 8; i++) {
    gradients.push({
      angle: random(TWO_PI),
      speed: random(0.002, 0.005),
      hueOffset: random(360),
      layer: i
    });
  }
}

function draw() {
  background(0);
  
  // Center of the canvas
  const cx = 0;
  const cy = 0;
  
  // Draw each gradient layer with its own rotation
  for (let i = 0; i < gradients.length; i++) {
    const g = gradients[i];
    
    // Update rotation angle
    g.angle += g.speed;
    
    // Set up the gradient
    push();
    rotate(g.angle);
    
    // Create a luminous gradient using multiple ellipses
    const numEllipses = 20;
    for (let j = 0; j < numEllipses; j++) {
      const size = map(j, 0, numEllipses - 1, width * 0.8, width * 0.1);
      const alpha = map(j, 0, numEllipses - 1, 0.2, 0.05);
      
      // Use hue offset to shift color across layers
      const hue = (g.hueOffset + j * 10) % 360;
      
      noStroke();
      fill(hue, 80, 90, alpha);
      
      ellipse(cx, cy, size, size);
    }
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
