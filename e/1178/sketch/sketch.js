let ants = [];
let tunnels = [];
let sandTexture;
let hexSize = 30;
let hexHeight = hexSize * Math.sqrt(3);
let antCount = 150;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create sand texture
  sandTexture = createGraphics(width, height);
  sandTexture.colorMode(HSB, 360, 100, 100, 1);
  for (let i = 0; i < 5000; i++) {
    let x = random(width);
    let y = random(height);
    let sz = random(1, 3);
    let h = random(20, 40);
    let s = random(10, 30);
    let b = random(60, 80);
    sandTexture.noStroke();
    sandTexture.fill(h, s, b);
    sandTexture.ellipse(x, y, sz, sz);
  }
  
  // Generate hexagonal honeycomb pattern
  generateTunnels();
  
  // Create ants
  for (let i = 0; i < antCount; i++) {
    ants.push({
      x: random(width),
      y: random(height),
      vx: random(-1, 1),
      vy: random(-1, 1),
      size: random(2, 4),
      hue: random(0, 30), // Dark brown to black
      trail: []
    });
  }
}

function draw() {
  // Draw sand background
  image(sandTexture, 0, 0);
  
  // Draw tunnels (dark winding paths)
  stroke(20, 30, 15);
  strokeWeight(2);
  noFill();
  for (let tunnel of tunnels) {
    beginShape();
    for (let point of tunnel) {
      vertex(point.x, point.y);
    }
    endShape();
  }
  
  // Draw chambers (hexagons)
  fill(20, 30, 15, 0.3);
  stroke(20, 30, 15);
  strokeWeight(1);
  for (let i = 0; i < width / hexSize; i++) {
    for (let j = 0; j < height / hexHeight; j++) {
      let x = i * hexSize + (j % 2) * hexSize / 2;
      let y = j * hexHeight;
      if (x > 0 && x < width && y > 0 && y < height) {
        drawHex(x, y);
      }
    }
  }
  
  // Update and draw ants
  for (let ant of ants) {
    // Update position
    ant.x += ant.vx;
    ant.y += ant.vy;
    
    // Add to trail
    ant.trail.push({x: ant.x, y: ant.y});
    if (ant.trail.length > 10) {
      ant.trail.shift();
    }
    
    // Boundary check and bounce
    if (ant.x < 0 || ant.x > width) {
      ant.vx *= -1;
    }
    if (ant.y < 0 || ant.y > height) {
      ant.vy *= -1;
    }
    
    // Draw trail
    noFill();
    stroke(0, 0, 0, 0.3);
    strokeWeight(1);
    beginShape();
    for (let point of ant.trail) {
      vertex(point.x, point.y);
    }
    endShape();
    
    // Draw ant body
    fill(ant.hue, 80, 20);
    noStroke();
    ellipse(ant.x, ant.y, ant.size, ant.size);
  }
}

function generateTunnels() {
  // Create a few winding tunnel paths
  for (let i = 0; i < 15; i++) {
    let path = [];
    let x = random(width);
    let y = random(height);
    let segments = floor(random(20, 50));
    
    for (let j = 0; j < segments; j++) {
      x += random(-30, 30);
      y += random(-30, 30);
      
      // Keep within bounds
      x = constrain(x, 0, width);
      y = constrain(y, 0, height);
      
      path.push({x: x, y: y});
    }
    
    tunnels.push(path);
  }
}

function drawHex(x, y) {
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i;
    let px = x + hexSize * cos(angle);
    let py = y + hexSize * sin(angle);
    vertex(px, py);
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
