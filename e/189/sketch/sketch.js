let lattice = [];
let connections = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Create lattice points
  for (let i = 0; i < 200; i++) {
    lattice.push({
      x: random(width),
      y: random(height),
      z: random(-100, 100),
      ox: random(1000),
      oy: random(1000),
      oz: random(1000),
      size: random(2, 6)
    });
  }
  
  // Create connections
  for (let i = 0; i < lattice.length; i++) {
    for (let j = i + 1; j < lattice.length; j++) {
      let d = dist(lattice[i].x, lattice[i].y, lattice[j].x, lattice[j].y);
      if (d < 150) {
        connections.push({
          a: i,
          b: j,
          length: d,
          strength: random(0.5, 1)
        });
      }
    }
  }
}

function draw() {
  background(0);
  
  time += 0.002;
  
  // Update and display lattice points
  for (let i = 0; i < lattice.length; i++) {
    let p = lattice[i];
    
    // Animate position with noise
    let x = p.x + noise(p.ox, time) * 10 - 5;
    let y = p.y + noise(p.oy, time) * 10 - 5;
    let z = p.z + noise(p.oz, time) * 2 - 1;
    
    // Apply depth-based scaling
    let sz = map(z, -100, 100, p.size, p.size * 0.5);
    
    // Draw point with glow effect
    fill(200 + sin(time + i) * 50, 80, 90, 0.8);
    ellipse(x, y, sz, sz);
    
    // Store updated positions
    p.x = x;
    p.y = y;
    p.z = z;
    p.ox += 0.01;
    p.oy += 0.01;
    p.oz += 0.01;
  }
  
  // Draw connections with dynamic glow
  beginShape(LINES);
  for (let i = 0; i < connections.length; i++) {
    let c = connections[i];
    let a = lattice[c.a];
    let b = lattice[c.b];
    
    // Randomly break some connections occasionally
    if (random() < 0.001) {
      continue;
    }
    
    // Glow effect based on distance and time
    let alpha = map(dist(a.x, a.y, b.x, b.y), 0, 150, 0.8, 0.1);
    alpha *= sin(time * 2 + i) * 0.3 + 0.7;
    
    stroke(200 + sin(time + i) * 50, 80, 90, alpha);
    vertex(a.x, a.y);
    vertex(b.x, b.y);
  }
  endShape();
  
  // Occasionally add new connections
  if (random() < 0.01) {
    let i = floor(random(lattice.length));
    let j = floor(random(lattice.length));
    if (i !== j && dist(lattice[i].x, lattice[i].y, lattice[j].x, lattice[j].y) < 150) {
      connections.push({
        a: i,
        b: j,
        length: dist(lattice[i].x, lattice[i].y, lattice[j].x, lattice[j].y),
        strength: random(0.5, 1)
      });
    }
  }
  
  // Occasionally remove old connections
  if (random() < 0.005 && connections.length > 50) {
    let idx = floor(random(connections.length));
    connections.splice(idx, 1);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
