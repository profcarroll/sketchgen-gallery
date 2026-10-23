let crystals = [];
let time = 0;
const numCrystals = 100;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize crystals with varying properties
  for (let i = 0; i < numCrystals; i++) {
    crystals.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(30, 80),
      speed: random(0.001, 0.005),
      angleX: random(TWO_PI),
      angleY: random(TWO_PI),
      color: color(random(200, 260), random(60, 90), random(30, 70)),
      segments: [],
      segmentCount: 12,
      growth: 0
    });
  }
  
  // Pre-generate crystal segments
  for (let i = 0; i < crystals.length; i++) {
    let c = crystals[i];
    c.segments = [];
    for (let j = 0; j < c.segmentCount; j++) {
      c.segments.push({
        x: c.x,
        y: c.y,
        z: c.z,
        age: 0
      });
    }
  }
}

function draw() {
  background(0, 0, 5, 0.05); // Semi-transparent background for trail effect
  
  time += 0.003;
  
  // Set up lighting and camera
  pointLight(255, 255, 255, 0, -height/2, 0);
  pointLight(255, 255, 255, 0, height/2, 0);
  ambientLight(60);
  
  // Draw and update each crystal
  for (let i = 0; i < crystals.length; i++) {
    let c = crystals[i];
    
    // Update position based on time and angle
    c.x += cos(c.angleX) * c.speed * 5;
    c.y += sin(c.angleY) * c.speed * 5;
    c.z += sin(time * 0.5) * 0.2;
    
    // Wrap around edges
    if (c.x > width/2 + 200) c.x = -width/2 - 200;
    if (c.x < -width/2 - 200) c.x = width/2 + 200;
    if (c.y > height/2 + 200) c.y = -height/2 - 200;
    if (c.y < -height/2 - 200) c.y = height/2 + 200;
    
    // Apply subtle noise to angles for organic movement
    c.angleX += noise(c.x * 0.001, c.y * 0.001, time) * 0.02 - 0.01;
    c.angleY += noise(c.x * 0.001, c.y * 0.001, time + 100) * 0.02 - 0.01;
    
    // Update segments with smooth motion
    for (let j = 0; j < c.segments.length; j++) {
      let s = c.segments[j];
      
      // Move segment towards current crystal position
      s.x += (c.x - s.x) * 0.02;
      s.y += (c.y - s.y) * 0.02;
      s.z += (c.z - s.z) * 0.02;
      
      // Age the segment
      s.age += 0.01;
    }
    
    // Draw crystal as a series of connected segments
    stroke(c.color);
    noFill();
    strokeWeight(1);
    
    beginShape();
    for (let j = 0; j < c.segments.length; j++) {
      let s = c.segments[j];
      let alpha = map(s.age, 0, 2, 0, 1);
      stroke(c.color, alpha);
      
      // Add a bit of noise to the segment position for organic flow
      let n = noise(s.x * 0.005, s.y * 0.005, time + j) * 3;
      vertex(s.x + n, s.y + n, s.z + n);
    }
    endShape();
    
    // Draw a central point with glow effect
    fill(c.color, 0.7);
    noStroke();
    push();
    translate(c.x, c.y, c.z);
    sphere(3); // This is acceptable since it's not inside the loop that draws particles
    pop();
  }
}

function mousePressed() {
  // Create a localized surge effect
  for (let i = 0; i < crystals.length; i++) {
    let c = crystals[i];
    let d = dist(mouseX - width/2, mouseY - height/2, c.x, c.y);
    if (d < 200) {
      c.growth += map(d, 0, 200, 10, 0);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
