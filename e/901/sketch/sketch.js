function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noLoop();
}

function draw() {
  background(240, 5, 10);

  // Create a dense network of connections
  const connections = [];
  const density = 0.0005;
  const maxConnections = 300;

  // Generate points in a grid pattern with some randomness
  for (let x = 0; x < width; x += random(20, 40)) {
    for (let y = 0; y < height; y += random(20, 40)) {
      const px = x + random(-10, 10);
      const py = y + random(-10, 10);

      // Add some organic variation
      const offset = sin(px * 0.01) * cos(py * 0.01) * 30;
      const size = random(5, 20) + offset;

      // Draw a soft pastel blob
      noStroke();
      fill(random(200, 250), random(30, 60), random(70, 90), 0.7);
      ellipse(px, py, size);

      // Add to connection list
      connections.push({ x: px, y: py, size });
    }
  }

  // Draw connections between nearby points
  strokeWeight(0.5);
  beginShape(LINES);
  for (let i = 0; i < connections.length; i++) {
    const a = connections[i];
    for (let j = i + 1; j < connections.length; j++) {
      if (connections.length > maxConnections) break;
      
      const b = connections[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = sqrt(dx * dx + dy * dy);

      // Only connect nearby points
      if (distance < 150) {
        const alpha = map(distance, 0, 150, 0.3, 0);
        
        stroke(hue(a.size), saturation(a.size), brightness(a.size), alpha);
        vertex(a.x, a.y);
        vertex(b.x, b.y);
      }
    }
  }
  endShape();

  // Add some crystalline etchings
  noStroke();
  for (let i = 0; i < 50; i++) {
    const x = random(width);
    const y = random(height);
    const size = random(2, 8);
    
    fill(random(10, 40), random(30, 60), random(80, 95), 0.2);
    ellipse(x, y, size);
  }

  // Add a few deep jewel tones
  for (let i = 0; i < 20; i++) {
    const x = random(width);
    const y = random(height);
    const size = random(10, 30);
    
    fill(random(10, 30), random(70, 90), random(50, 80), 0.6);
    ellipse(x, y, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
