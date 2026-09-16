let hexagonPoints;
let time = 0;
let curves = [];
let lattices = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create hexagon boundary points
  hexagonPoints = [];
  for (let i = 0; i < 6; i++) {
    const angle = TWO_PI * i / 6;
    hexagonPoints.push(createVector(
      width/2 + cos(angle) * min(width, height) * 0.4,
      height/2 + sin(angle) * min(width, height) * 0.4
    ));
  }
  
  // Initialize curves and lattices
  for (let i = 0; i < 50; i++) {
    curves.push({
      pos: createVector(random(width), random(height)),
      vel: p5.Vector.random2D().mult(random(0.5, 2)),
      size: random(10, 50),
      color: color(random(50, 100), random(150, 200), random(180, 255), 150)
    });
  }
  
  for (let i = 0; i < 30; i++) {
    lattices.push({
      pos: createVector(random(width), random(height)),
      size: random(20, 60),
      rotation: random(TWO_PI),
      color: color(random(100, 150), random(50, 100), random(180, 255), 100)
    });
  }
}

function draw() {
  background(10);
  
  time += 0.01;
  
  // Draw hexagon boundary
  push();
  stroke(200, 230, 255, 80);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let p of hexagonPoints) {
    vertex(p.x, p.y);
  }
  endShape(CLOSE);
  pop();
  
  // Update and draw curves
  for (let i = 0; i < curves.length; i++) {
    let c = curves[i];
    
    // Update position with noise
    c.pos.add(c.vel);
    
    // Bounce off hexagon edges using boundary checking
    if (!isInsideHexagon(c.pos)) {
      // Simple reflection
      c.vel.reflect(createVector(random(-1, 1), random(-1, 1)).normalize());
    }
    
    // Draw smooth globular spline
    push();
    translate(c.pos.x, c.pos.y);
    rotate(time * 0.5 + i);
    noStroke();
    fill(c.color);
    ellipse(0, 0, c.size, c.size * 0.6);
    pop();
  }
  
  // Update and draw lattices
  for (let i = 0; i < lattices.length; i++) {
    let l = lattices[i];
    
    l.rotation += 0.01;
    l.pos.x += sin(time * 0.2 + i) * 0.3;
    l.pos.y += cos(time * 0.2 + i) * 0.3;
    
    // Draw rigid lattice
    push();
    translate(l.pos.x, l.pos.y);
    rotate(l.rotation);
    stroke(l.color);
    strokeWeight(1);
    noFill();
    
    // Draw a geometric pattern (like a diamond grid)
    const sz = l.size;
    for (let x = -sz; x <= sz; x += sz/2) {
      line(x, -sz, x, sz);
      line(-sz, x, sz, x);
    }
    
    pop();
  }
}

function isInsideHexagon(p) {
  // Simple point-in-polygon test for hexagon
  let inside = true;
  for (let i = 0; i < 6; i++) {
    const a = hexagonPoints[i];
    const b = hexagonPoints[(i + 1) % 6];
    
    // Cross product to check side of line
    const cross = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
    if (cross > 0) {
      inside = false;
      break;
    }
  }
  return inside;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
