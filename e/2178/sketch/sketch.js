let roots = [];
let paperTexture;
let pulseOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create newsprint texture
  paperTexture = createGraphics(width, height);
  paperTexture.noiseDetail(2, 0.5);
  paperTexture.loadPixels();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let noiseVal = paperTexture.noise(x * 0.01, y * 0.01) * 255;
      let gray = 220 + noiseVal * 0.3;
      paperTexture.set(x, y, color(gray));
    }
  }
  paperTexture.updatePixels();
  
  // Initialize root network
  for (let i = 0; i < 80; i++) {
    roots.push({
      x: random(width),
      y: random(height),
      size: random(2, 8),
      speed: random(0.01, 0.03),
      phase: random(TWO_PI),
      connections: []
    });
  }
  
  // Connect nearby roots
  for (let i = 0; i < roots.length; i++) {
    for (let j = i + 1; j < roots.length; j++) {
      let d = dist(roots[i].x, roots[i].y, roots[j].x, roots[j].y);
      if (d < 150) {
        roots[i].connections.push(j);
        if (roots[i].connections.length > 10) break;
      }
    }
  }
}

function draw() {
  // Draw textured background
  image(paperTexture, 0, 0);
  
  // Pulsing animation
  pulseOffset += 0.02;
  
  // Draw roots and connections
  for (let i = 0; i < roots.length; i++) {
    let root = roots[i];
    
    // Pulsing size effect
    let pulse = sin(frameCount * root.speed + root.phase) * 0.5 + 0.5;
    let size = root.size * (1 + pulse * 0.3);
    
    // Glow effect with warm color
    noStroke();
    fill(255, 200, 0, 150 * pulse);
    ellipse(root.x, root.y, size * 3, size * 3);
    
    // Main root
    fill(255, 150, 0, 200);
    ellipse(root.x, root.y, size, size);
    
    // Draw connections to nearby roots
    stroke(255, 180, 0, 80 * pulse);
    strokeWeight(0.5);
    for (let j = 0; j < root.connections.length; j++) {
      let otherRoot = roots[root.connections[j]];
      if (otherRoot) {
        line(root.x, root.y, otherRoot.x, otherRoot.y);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
