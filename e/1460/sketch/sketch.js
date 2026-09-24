let trails = [];
let numTrails = 100;
let flowField;

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
      size: random(2, 8),
      life: random(100, 300)
    });
  }
  
  // Create flow field for movement
  flowField = [];
  let cols = floor(width / 20);
  let rows = floor(height / 20);
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
    
    // Reduce life
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
        size: random(2, 8),
        life: random(100, 300)
      });
    }
  }
  
  // Check for intersections and create geometric forms
  for (let i = 0; i < trails.length; i++) {
    for (let j = i + 1; j < trails.length; j++) {
      let d = dist(trails[i].pos.x, trails[i].pos.y, trails[j].pos.x, trails[j].pos.y);
      if (d < 30) {
        // Create temporary intersection effect
        fill(255, 255, 255, 0.7);
        ellipse(trails[i].pos.x, trails[i].pos.y, 10);
        ellipse(trails[j].pos.x, trails[j].pos.y, 10);
        
        // Draw connecting line
        stroke(255, 255, 255, 0.3);
        line(trails[i].pos.x, trails[i].pos.y, trails[j].pos.x, trails[j].pos.y);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
