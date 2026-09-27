let particles = [];
let time = 0;
let flowField;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize particles with fewer shapes for performance
  for (let i = 0; i < 800; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-1000, 1000),
      size: random(2, 8),
      speed: random(0.005, 0.03),
      angle: random(TWO_PI),
      hue: random(190, 230),
      opacity: random(0.05, 0.15),
      sway: random(0.002, 0.008),
      depth: random(1),
      clusterSize: 0
    });
  }
  
  // Create a flow field for current movement
  flowField = new Array(50 * 50);
  for (let i = 0; i < flowField.length; i++) {
    flowField[i] = random(TWO_PI);
  }
}

function draw() {
  background(210, 50, 15);
  
  time += 0.003;
  
  // Draw all particles as points for performance
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Get current field value based on particle position
    let fieldX = map(p.x, -width/2, width/2, 0, 49);
    let fieldY = map(p.y, -height/2, height/2, 0, 49);
    let fieldIndex = floor(fieldX) + floor(fieldY) * 50;
    
    if (fieldIndex >= 0 && fieldIndex < flowField.length) {
      let angle = flowField[fieldIndex];
      
      // Apply current field influence
      p.x += cos(angle) * p.speed;
      p.y += sin(angle) * p.speed;
      
      // Add some noise-based variation to the current
      let noiseFactor = 0.1;
      p.x += noise(p.x * 0.002, p.y * 0.002, time * 0.02) * noiseFactor;
      p.y += noise(p.x * 0.002 + 1000, p.y * 0.002 + 1000, time * 0.02) * noiseFactor;
    }
    
    // Add gentle sway and depth effect
    p.x += sin(time + p.y * 0.01 + p.depth) * p.sway;
    p.y += cos(time * 0.5 + p.x * 0.01 + p.depth) * p.sway * 0.5;
    
    // Wrap around edges
    if (p.x < -width/2 - p.size) p.x = width/2 + p.size;
    if (p.x > width/2 + p.size) p.x = -width/2 - p.size;
    if (p.y < -height/2 - p.size) p.y = height/2 + p.size;
    if (p.y > height/2 + p.size) p.y = -height/2 - p.size;
    
    // Add depth-based distortion
    let distortion = sin(time * 0.3 + p.x * 0.01) * 0.5;
    
    // Set particle color and size based on depth
    fill(p.hue, 70, 90, p.opacity);
    
    // Use vertex to draw particles as points
    vertex(p.x + distortion, p.y, p.z);
  }
  endShape();
  
  // Periodic cluster formation effect
  if (frameCount % 60 === 0) {
    // Create a temporary visual cluster effect
    for (let i = 0; i < 3; i++) {
      let clusterX = random(-width/2, width/2);
      let clusterY = random(-height/2, height/2);
      let size = random(100, 200);
      
      fill(190, 60, 95, 0.2);
      ellipse(clusterX, clusterY, size, size * 0.3);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
