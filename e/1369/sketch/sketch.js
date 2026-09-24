let shapes = [];
let colors = [];
let burst = false;
let burstCenter = { x: 0, y: 0 };
let burstRadius = 0;
let maxBurstRadius = 300;
let fieldTime = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize shapes
  for (let i = 0; i < 20; i++) {
    shapes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(50, 200),
      speed: random(0.005, 0.02),
      hue: random(360)
    });
  }
  
  // Initialize colors
  for (let i = 0; i < 100; i++) {
    colors.push(color(random(360), 80, 90));
  }
}

function draw() {
  background(0);
  
  if (burst) {
    // Draw burst effect
    let alpha = map(burstRadius, 0, maxBurstRadius, 1, 0);
    fill(255, alpha);
    sphere(burstRadius);
    
    // Update burst
    burstRadius += 8;
    if (burstRadius > maxBurstRadius) {
      burst = false;
      // Reset field with new configuration
      for (let i = 0; i < shapes.length; i++) {
        shapes[i].x = random(-width/2, width/2);
        shapes[i].y = random(-height/2, height/2);
        shapes[i].z = random(-100, 100);
        shapes[i].size = random(50, 200);
        shapes[i].hue = random(360);
      }
      fieldTime = 0;
    }
  } else {
    // Draw the fluid field
    fieldTime += 0.01;
    
    for (let i = 0; i < shapes.length; i++) {
      let s = shapes[i];
      
      // Update position with organic movement
      s.x += sin(fieldTime * s.speed) * 2;
      s.y += cos(fieldTime * s.speed) * 2;
      s.z += sin(fieldTime * s.speed * 0.5) * 1.5;
      
      // Update hue for color shifting
      s.hue = (s.hue + 0.2) % 360;
      
      // Draw shape with gradient
      push();
      translate(s.x, s.y, s.z);
      
      let c = color(s.hue, 80, 90, 0.7);
      fill(c);
      
      // Use different shapes based on index
      if (i % 3 === 0) {
        sphere(s.size);
      } else if (i % 3 === 1) {
        box(s.size);
      } else {
        torus(s.size, s.size * 0.4);
      }
      
      pop();
    }
    
    // Add some overlay for energy effect
    blendMode(ADD);
    for (let i = 0; i < 5; i++) {
      let size = map(i, 0, 4, 100, 300);
      let alpha = map(i, 0, 4, 0.1, 0.02);
      
      fill(200, 80, 90, alpha);
      sphere(size + sin(fieldTime * 0.5 + i) * 20);
    }
    blendMode(BLEND);
  }
}

function mousePressed() {
  if (!burst) {
    burst = true;
    burstCenter.x = 0;
    burstCenter.y = 0;
    burstRadius = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
