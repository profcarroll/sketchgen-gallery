let lines = [];
let hueShift = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  colorMode(HSB, 100);
  
  // Create a lattice of points
  const spacing = 40;
  for (let x = 0; x < width; x += spacing) {
    for (let y = 0; y < height; y += spacing) {
      lines.push({
        x: x,
        y: y,
        connections: [],
        opacity: random(0.3, 1),
        active: true
      });
    }
  }

  // Connect each point to its neighbors
  for (let i = 0; i < lines.length; i++) {
    const p1 = lines[i];
    for (let j = i + 1; j < lines.length; j++) {
      const p2 = lines[j];
      const d = dist(p1.x, p1.y, p2.x, p2.y);
      
      // Connect if close enough
      if (d < spacing * 1.5) {
        p1.connections.push(j);
        p2.connections.push(i);
      }
    }
  }
}

function draw() {
  background(0);
  
  // Shift hue over time for color pulse
  hueShift = (hueShift + 0.3) % 100;
  
  // Draw connections with fading effect
  for (let i = 0; i < lines.length; i++) {
    const p1 = lines[i];
    
    if (!p1.active) continue;
    
    // Randomly deactivate some lines occasionally
    if (random() < 0.005) {
      p1.active = false;
      setTimeout(() => { p1.active = true; }, random(500, 2000));
    }
    
    for (let j = 0; j < p1.connections.length; j++) {
      const idx = p1.connections[j];
      const p2 = lines[idx];
      
      if (!p2.active) continue;
      
      // Draw line with dynamic color and opacity
      const c = color((hueShift + frameCount * 0.5 + i * 2) % 100, 100, 100, p1.opacity * 100);
      stroke(c);
      line(p1.x, p1.y, p2.x, p2.y);
    }
  }
  
  // Draw points with subtle glow
  for (let i = 0; i < lines.length; i++) {
    const p = lines[i];
    if (!p.active) continue;
    
    const c = color((hueShift + frameCount * 0.5 + i * 2) % 100, 100, 100, 80);
    fill(c);
    ellipse(p.x, p.y, 6, 6);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
