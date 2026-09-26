let trails = [];
let numTrails = 300;
let flowField;
let intersections = [];

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
      size: random(2, 6),
      life: random(100, 300),
      age: 0
    });
  }
  
  // Create flow field for movement
  let cols = floor(width / 20);
  let rows = floor(height / 20);
  flowField = [];
  for (let y = 0; y < rows; y++) {
    flowField[y] = [];
    for (let x = 0; x < cols; x++) {
      flowField[y][x] = p5.Vector.random2D().mult(random(0.5, 2));
    }
  }
}

function draw() {
  background(0, 0, 0, 0.1); // Semi-transparent background for trail fading
  
  // Update and display trails
  for (let i = trails.length - 1; i >= 0; i--) {
    let t = trails[i];
    
    // Apply flow field influence
    let x = floor(t.pos.x / 20);
    let y = floor(t.pos.y / 20);
    if (x >= 0 && y >= 0 && x < flowField[0].length && y < flowField.length) {
      t.vel.add(flowField[y][x]);
    }
    
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
        size: random(2, 6),
        life: random(100, 300),
        age: 0
      });
    }
  }
  
  // Check for intersections and create geometric forms
  let maxChecks = 500;
  let checks = 0;
  for (let i = 0; i < trails.length; i++) {
    if (checks >= maxChecks) break;
    for (let j = i + 1; j < trails.length; j++) {
      if (checks >= maxChecks) break;
      checks++;
      
      let d = dist(trails[i].pos.x, trails[i].pos.y, trails[j].pos.x, trails[j].pos.y);
      if (d < 30) {
        // Create temporary intersection effect
        intersections.push({
          pos: createVector((trails[i].pos.x + trails[j].pos.x) / 2, (trails[i].pos.y + trails[j].pos.y) / 2),
          size: random(10, 30),
          life: random(50, 100),
          type: floor(random(3)) // 0=triangle, 1=square, 2=pentagon
        });
        
        // Draw connecting line
        stroke(255, 255, 255, 0.3);
        line(trails[i].pos.x, trails[i].pos.y, trails[j].pos.x, trails[j].pos.y);
      }
    }
  }
  
  // Update and display intersections
  for (let i = intersections.length - 1; i >= 0; i--) {
    let inter = intersections[i];
    inter.life--;
    
    if (inter.life <= 0) {
      intersections.splice(i, 1);
      continue;
    }
    
    noStroke();
    fill(255, 255, 255, 0.8 * (inter.life / 100));
    
    // Draw different geometric shapes based on type
    push();
    translate(inter.pos.x, inter.pos.y);
    if (inter.type === 0) {
      // Triangle
      triangle(0, -inter.size/2, 
               -inter.size/2, inter.size/2, 
               inter.size/2, inter.size/2);
    } else if (inter.type === 1) {
      // Square
      rectMode(CENTER);
      rect(0, 0, inter.size, inter.size);
    } else {
      // Pentagon
      beginShape();
      for (let a = 0; a < TWO_PI; a += TWO_PI/5) {
        let x = inter.size/2 * cos(a);
        let y = inter.size/2 * sin(a);
        vertex(x, y);
      }
      endShape(CLOSE);
    }
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
