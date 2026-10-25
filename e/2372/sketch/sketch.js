let strata = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Create layered geological strata
  for (let i = 0; i < 20; i++) {
    strata.push({
      y: height * (i / 20),
      height: height / 20,
      hue: random(360),
      saturation: random(40, 80),
      lightness: random(20, 60),
      speed: random(0.001, 0.005),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  
  time += 0.01;
  
  // Draw each stratum with layered patterns
  for (let i = 0; i < strata.length; i++) {
    let s = strata[i];
    
    // Animate the stratum with wave motion
    let wave = sin(time * s.speed + s.phase) * 20;
    
    fill(s.hue, s.saturation, s.lightness, 0.8);
    
    // Draw a series of rectangles with varying widths and heights
    push();
    translate(0, s.y);
    
    let segmentCount = 100;
    for (let j = 0; j < segmentCount; j++) {
      let x = (j / segmentCount) * width;
      let segmentWidth = width / segmentCount;
      
      // Apply wave distortion
      let y = sin(x * 0.02 + time * 0.5) * 10;
      
      // Vary height based on position and time
      let segmentHeight = s.height + sin(time * 0.3 + x * 0.01) * 15;
      
      // Adjust color intensity over time
      let hue = (s.hue + time * 2 + j * 2) % 360;
      fill(hue, s.saturation, s.lightness, 0.7);
      
      rect(x, y, segmentWidth, segmentHeight);
    }
    
    pop();
  }
  
  // Add a central concrete structure that grows and decays
  let centerX = width / 2;
  let centerY = height / 2;
  let radius = 50 + sin(time * 3) * 30;
  
  // Draw the concrete structure with geometric forms
  for (let i = 0; i < 8; i++) {
    let angle = TWO_PI * i / 8;
    let x = centerX + cos(angle) * radius;
    let y = centerY + sin(angle) * radius;
    
    push();
    translate(x, y);
    rotate(time + angle);
    
    // Draw geometric shapes
    fill(200, 30, 15, 0.8);
    rectMode(CENTER);
    rect(0, 0, 20, 20, 4);
    
    pop();
  }
  
  // Add central core with varying intensity
  let coreSize = 30 + sin(time * 2) * 15;
  fill(180, 40, 20, 0.9);
  ellipse(centerX, centerY, coreSize);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
