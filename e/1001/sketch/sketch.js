let latticePoints = [];
let splines = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize lattice points in a hexagonal pattern
  const radius = min(width, height) * 0.4;
  const numPoints = 120;
  for (let i = 0; i < numPoints; i++) {
    const angle = TWO_PI * i / numPoints;
    const x = cos(angle) * radius;
    const y = sin(angle) * radius;
    latticePoints.push({ x, y, z: 0, originalX: x, originalY: y });
  }

  // Initialize splines
  for (let i = 0; i < 8; i++) {
    splines.push({
      points: [],
      hue: (i * 45) % 360,
      speed: random(0.002, 0.005),
      radius: random(0.3, 0.7)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Center the scene
  translate(0, 0, -500);

  // Rotate slowly
  rotateY(time * 0.1);
  rotateX(sin(time * 0.3) * 0.2);

  // Draw lattice structure
  drawLattice();

  // Draw splines
  drawSplines();
}

function drawLattice() {
  stroke(255, 30);
  noFill();
  beginShape(LINES);
  
  for (let i = 0; i < latticePoints.length; i++) {
    const p1 = latticePoints[i];
    const p2 = latticePoints[(i + 1) % latticePoints.length];
    
    // Apply dynamic force from the lattice
    const force = createVector(
      sin(time * 0.5 + i * 0.1) * 30,
      cos(time * 0.7 + i * 0.1) * 30,
      0
    );
    
    const x1 = p1.originalX + force.x;
    const y1 = p1.originalY + force.y;
    const x2 = p2.originalX + force.x;
    const y2 = p2.originalY + force.y;
    
    vertex(x1, y1, 0);
    vertex(x2, y2, 0);
  }
  
  endShape();
}

function drawSplines() {
  for (let s of splines) {
    beginShape();
    noFill();
    stroke(s.hue, 80, 90, 0.7);
    
    const numPoints = 100;
    for (let i = 0; i < numPoints; i++) {
      const angle = TWO_PI * i / numPoints;
      
      // Create flowing globular spline
      const radius = 200 * s.radius;
      const x = cos(angle + time * s.speed) * radius;
      const y = sin(angle + time * s.speed) * radius;
      const z = sin(angle * 3 + time * s.speed * 0.5) * 100;
      
      // Apply lattice forces
      let fx = 0, fy = 0;
      for (let p of latticePoints) {
        const dx = x - p.originalX;
        const dy = y - p.originalY;
        const d = sqrt(dx * dx + dy * dy);
        
        if (d < 150 && d > 10) {
          const force = map(d, 10, 150, 20, 0);
          fx += (dx / d) * force;
          fy += (dy / d) * force;
        }
      }
      
      vertex(x + fx, y + fy, z);
    }
    
    endShape(CLOSE);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
