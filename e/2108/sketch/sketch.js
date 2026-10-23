let trails = [];
let numTrails = 1000;
let points = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize trails
  for (let i = 0; i < numTrails; i++) {
    trails.push({
      pos: createVector(random(-width/2), random(-height/2), random(-100, 100)),
      vel: p5.Vector.random3D().mult(random(0.5, 2)),
      hue: random(360),
      size: random(1, 3),
      life: random(100, 300),
      age: 0
    });
  }
  
  // Precompute point cloud
  points = new Array(numTrails);
  for (let i = 0; i < numTrails; i++) {
    points[i] = createVector(0, 0, 0);
  }
}

function draw() {
  background(0, 0, 0, 0.03); // Very subtle trail fading
  
  // Update and display trails
  for (let i = trails.length - 1; i >= 0; i--) {
    let t = trails[i];
    
    // Update position
    t.pos.add(t.vel);
    
    // Wrap around edges (in 3D)
    if (t.pos.x > width/2) t.pos.x = -width/2;
    if (t.pos.x < -width/2) t.pos.x = width/2;
    if (t.pos.y > height/2) t.pos.y = -height/2;
    if (t.pos.y < -height/2) t.pos.y = height/2;
    if (t.pos.z > 100) t.pos.z = -100;
    if (t.pos.z < -100) t.pos.z = 100;
    
    // Store position for point cloud
    points[i] = t.pos.copy();
  }
  
  // Draw all trails as a single point cloud
  beginShape(POINTS);
  for (let i = 0; i < points.length; i++) {
    let p = points[i];
    fill(trails[i].hue, 100, 100, 0.8);
    vertex(p.x, p.y, p.z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
