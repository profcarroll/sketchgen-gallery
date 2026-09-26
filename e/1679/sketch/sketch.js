let trails = [];
let numTrails = 1500;
let grid = {};

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize trails
  for (let i = 0; i < numTrails; i++) {
    trails.push({
      pos: createVector(random(width), random(height)),
      vel: p5.Vector.random2D().mult(random(0.5, 2)),
      hue: random(360),
      size: random(1, 3),
      life: random(100, 300),
      age: 0
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05); // Very subtle trail fading
  
  // Update and display trails
  for (let i = trails.length - 1; i >= 0; i--) {
    let t = trails[i];
    
    // Update position
    t.pos.add(t.vel);
    
    // Wrap around edges
    if (t.pos.x > width) t.pos.x = 0;
    if (t.pos.x < 0) t.pos.x = width;
    if (t.pos.y > height) t.pos.y = 0;
    if (t.pos.y < 0) t.pos.y = height;
    
    // Update age and life
    t.age++;
    t.life--;
    
    // Draw trail segment
    fill(t.hue, 100, 100, 0.8);
    ellipse(t.pos.x, t.pos.y, t.size);
    
    // Remove dead trails
    if (t.life <= 0) {
      trails.splice(i, 1);
      trails.push({
        pos: createVector(random(width), random(height)),
        vel: p5.Vector.random2D().mult(random(0.5, 2)),
        hue: random(360),
        size: random(1, 3),
        life: random(100, 300),
        age: 0
      });
    }
  }
  
  // Create stable lattice structures from intersections
  let gridSize = 40;
  // Clear grid
  for (let key in grid) {
    delete grid[key];
  }
  
  // Populate grid with trails
  for (let i = 0; i < trails.length; i++) {
    let trail = trails[i];
    let gridX = floor(trail.pos.x / gridSize);
    let gridY = floor(trail.pos.y / gridSize);
    
    let cellKey = `${gridX},${gridY}`;
    if (!grid[cellKey]) {
      grid[cellKey] = [];
    }
    grid[cellKey].push(trail);
  }
  
  // Check for dense intersections and form geometric lattices
  let latticeCount = 0;
  for (let key in grid) {
    if (latticeCount > 200) break; // Limit to avoid performance issues
    
    let neighbors = grid[key];
    if (neighbors.length > 3) { // Only if many trails intersect
      let center = createVector(0, 0);
      for (let n of neighbors) {
        center.add(n.pos);
      }
      center.div(neighbors.length);
      
      // Draw stable geometric structure
      noStroke();
      fill(255, 100, 100, 0.6);
      
      let shapeType = latticeCount % 3;
      push();
      translate(center.x, center.y);
      
      if (shapeType === 0) {
        // Triangle
        triangle(0, -20, -15, 15, 15, 15);
      } else if (shapeType === 1) {
        // Square
        rectMode(CENTER);
        rect(0, 0, 30, 30);
      } else {
        // Pentagon
        beginShape();
        for (let a = 0; a < TWO_PI; a += TWO_PI/5) {
          let x = 15 * cos(a);
          let y = 15 * sin(a);
          vertex(x, y);
        }
        endShape(CLOSE);
      }
      
      pop();
      latticeCount++;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
