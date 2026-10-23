let gears = [];
let papers = [];
let polyhedra = [];
let connections = [];

function setup() {
  createCanvas(800, 600);
  
  // Create overlapping paper sheets with cartography
  for (let i = 0; i < 5; i++) {
    papers.push({
      x: random(-100, 100),
      y: random(-100, 100),
      width: 600 + random(-50, 50),
      height: 400 + random(-50, 50),
      rotation: random(TWO_PI),
      opacity: random(0.2, 0.5)
    });
  }
  
  // Create interlocking gears
  for (let i = 0; i < 12; i++) {
    gears.push({
      x: width/2 + random(-200, 200),
      y: height/2 + random(-150, 150),
      radius: random(20, 50),
      rotation: random(TWO_PI),
      teeth: floor(random(8, 16)),
      speed: random(0.005, 0.02)
    });
  }
  
  // Create polyhedra that represent information transfer
  for (let i = 0; i < 8; i++) {
    polyhedra.push({
      x: width/2 + random(-200, 200),
      y: height/2 + random(-150, 150),
      size: random(30, 60),
      type: floor(random(3)), // 0 = tetrahedron, 1 = octahedron, 2 = icosahedron
      rotationX: random(TWO_PI),
      rotationY: random(TWO_PI),
      rotationZ: random(TWO_PI)
    });
  }
  
  // Pre-compute connections between polyhedra to avoid all-pairs loop
  for (let i = 0; i < polyhedra.length; i++) {
    for (let j = i + 1; j < polyhedra.length; j++) {
      const d = dist(polyhedra[i].x, polyhedra[i].y, polyhedra[j].x, polyhedra[j].y);
      if (d < 300) {
        connections.push({
          from: i,
          to: j,
          distance: d
        });
      }
    }
  }
}

function draw() {
  background(245);
  
  // Draw paper layers
  for (let paper of papers) {
    push();
    translate(paper.x, paper.y);
    rotate(paper.rotation);
    fill(250, 240, 230, paper.opacity * 255);
    noStroke();
    rect(-paper.width/2, -paper.height/2, paper.width, paper.height);
    
    // Add fine cartography details
    stroke(180, 160, 140);
    strokeWeight(0.5);
    for (let i = 0; i < 20; i++) {
      line(random(-paper.width/2, paper.width/2), 
           random(-paper.height/2, paper.height/2),
           random(-paper.width/2, paper.width/2),
           random(-paper.height/2, paper.height/2));
    }
    pop();
  }
  
  // Draw gears
  for (let gear of gears) {
    push();
    translate(gear.x, gear.y);
    rotate(gear.rotation);
    
    // Gear teeth
    stroke(80, 60, 40);
    strokeWeight(1);
    fill(220, 200, 180);
    ellipse(0, 0, gear.radius * 2);
    
    for (let i = 0; i < gear.teeth; i++) {
      const angle = TWO_PI * i / gear.teeth;
      const x1 = cos(angle) * gear.radius;
      const y1 = sin(angle) * gear.radius;
      const x2 = cos(angle) * (gear.radius * 0.8);
      const y2 = sin(angle) * (gear.radius * 0.8);
      
      line(x1, y1, x2, y2);
    }
    
    // Gear center
    fill(60, 50, 40);
    ellipse(0, 0, gear.radius * 0.3);
    pop();
    
    gear.rotation += gear.speed;
  }
  
  // Draw polyhedra using 2D projection instead of WEBGL
  for (let i = 0; i < polyhedra.length; i++) {
    let poly = polyhedra[i];
    
    push();
    translate(poly.x, poly.y);
    
    stroke(80, 60, 40);
    strokeWeight(1);
    fill(220, 200, 180, 150);
    
    if (poly.type === 0) {
      // Tetrahedron - simple 2D projection
      beginShape();
      vertex(0, -poly.size);
      vertex(poly.size, poly.size);
      vertex(-poly.size, poly.size);
      endShape(CLOSE);
      
      // Add bottom triangle
      beginShape();
      vertex(0, -poly.size);
      vertex(poly.size, poly.size);
      vertex(0, poly.size);
      endShape(CLOSE);
      
    } else if (poly.type === 1) {
      // Octahedron - simple 2D projection
      beginShape();
      vertex(0, -poly.size);
      vertex(poly.size, 0);
      vertex(0, poly.size);
      vertex(-poly.size, 0);
      endShape(CLOSE);
    } else {
      // Icosahedron - simple 2D projection
      beginShape();
      for (let j = 0; j < 5; j++) {
        const angle = TWO_PI * j / 5;
        const x = cos(angle) * poly.size;
        const y = sin(angle) * poly.size;
        vertex(x, y);
      }
      endShape(CLOSE);
    }
    
    pop();
    
    // Rotate slowly
    poly.rotationX += 0.003;
    poly.rotationY += 0.002;
    poly.rotationZ += 0.001;
  }
  
  // Draw connections between polyhedra (information transfer)
  stroke(180, 160, 140);
  strokeWeight(0.5);
  noFill();
  
  // Draw pre-computed connections
  for (let conn of connections) {
    const from = polyhedra[conn.from];
    const to = polyhedra[conn.to];
    line(from.x, from.y, to.x, to.y);
  }
}
