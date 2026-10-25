let crystals = [];
let connections = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Generate a structured crystal lattice with precise interlocking
  for (let i = 0; i < 150; i++) {
    const x = random(-250, 250);
    const y = random(-250, 250);
    const z = random(-250, 250);
    
    crystals.push({
      x: x,
      y: y,
      z: z,
      size: random(8, 14),
      hue: random(30, 90),
      saturation: random(60, 80),
      brightness: random(70, 90),
      rotationX: random(TWO_PI),
      rotationY: random(TWO_PI),
      rotationZ: random(TWO_PI),
      speed: random(0.002, 0.005)
    });
  }
  
  // Precompute connections to form a lattice structure
  for (let i = 0; i < crystals.length; i++) {
    for (let j = i + 1; j < crystals.length; j++) {
      const c1 = crystals[i];
      const c2 = crystals[j];
      
      const dx = c1.x - c2.x;
      const dy = c1.y - c2.y;
      const dz = c1.z - c2.z;
      const distance = sqrt(dx * dx + dy * dy + dz * dz);
      
      // Create connections only for nearby crystals
      if (distance < 100) {
        connections.push({
          x1: c1.x,
          y1: c1.y,
          z1: c1.z,
          x2: c2.x,
          y2: c2.y,
          z2: c2.z,
          hue: (c1.hue + c2.hue) / 2
        });
      }
    }
  }
  
  // Limit connections to avoid performance issues
  connections = connections.slice(0, 500);
}

function draw() {
  background(0);
  
  // Static camera view
  rotateY(0.1);
  rotateX(0.05);
  
  // Draw crystal structures
  noStroke();
  for (let crystal of crystals) {
    push();
    
    translate(crystal.x, crystal.y, crystal.z);
    
    // Apply subtle rotation to maintain structure while giving organic feel
    rotateX(crystal.rotationX);
    rotateY(crystal.rotationY);
    rotateZ(crystal.rotationZ);
    
    // Draw a multi-faceted crystal using simple geometric forms
    fill(crystal.hue, crystal.saturation, crystal.brightness, 0.85);
    
    // Create interlocking structures using different shapes
    push();
    scale(1.0 + sin(frameCount * 0.01) * 0.05);
    sphere(crystal.size * 0.4, 4, 3); // Base sphere
    
    pop();
    push();
    rotateX(PI/4);
    rotateY(PI/4);
    scale(0.9 + cos(frameCount * 0.01) * 0.05);
    box(crystal.size * 1.0, crystal.size * 0.2, crystal.size * 1.0); // Prism
    
    pop();
    push();
    rotateZ(PI/6);
    scale(0.9 + sin(frameCount * 0.01) * 0.05);
    torus(crystal.size * 0.6, crystal.size * 0.2, 8, 4); // Toroidal structure
    
    pop();
    
    pop();
  }
  
  // Draw interconnections between crystals to suggest lattice
  noFill();
  strokeWeight(0.3);
  beginShape(LINES);
  for (let conn of connections) {
    stroke(conn.hue, 50, 80, 0.3);
    vertex(conn.x1, conn.y1, conn.z1);
    vertex(conn.x2, conn.y2, conn.z2);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
