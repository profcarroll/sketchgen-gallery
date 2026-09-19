let stripes = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize stripes with varying properties
  for (let i = 0; i < 200; i++) {
    stripes.push({
      angle: random(TWO_PI),
      speed: random(0.005, 0.02),
      width: random(30, 100),
      hue: random(360),
      saturation: random(70, 100),
      brightness: random(70, 100),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  
  time += 0.01;
  
  // Draw each stripe as a polygon
  for (let i = 0; i < stripes.length; i++) {
    let s = stripes[i];
    
    // Update angle based on time and phase
    s.angle += s.speed * sin(time + s.phase);
    
    // Calculate vertices for the stripe
    let vertices = [];
    let segments = 10;
    let radius = max(width, height) * 1.5;
    
    for (let j = 0; j < segments; j++) {
      let a = s.angle + map(j, 0, segments - 1, 0, TWO_PI);
      let x = width / 2 + cos(a) * radius;
      let y = height / 2 + sin(a) * radius;
      vertices.push({x, y});
    }
    
    // Draw the stripe as a polygon
    fill(hue(s.hue), s.saturation, s.brightness);
    beginShape();
    for (let v of vertices) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
    
    // Update hue to create shifting colors
    s.hue = (s.hue + 0.5) % 360;
  }
  
  // Create a lattice-like effect by drawing overlapping patterns
  push();
  translate(width / 2, height / 2);
  rotate(time * 0.1);
  for (let i = 0; i < 50; i++) {
    let size = map(i, 0, 49, 50, 300);
    stroke(255, 30);
    noFill();
    ellipse(0, 0, size, size);
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
