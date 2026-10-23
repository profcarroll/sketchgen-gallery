let circuits = [];
let noiseScale = 0.02;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a grid of circuit patterns
  for (let x = 0; x < width; x += 80) {
    for (let y = 0; y < height; y += 80) {
      circuits.push({
        x: x,
        y: y,
        size: random(30, 60),
        hue: random(30, 60), // Warm copper tones
        speed: random(0.01, 0.03),
        phase: random(TWO_PI)
      });
    }
  }
}

function draw() {
  background(0);
  
  time += 0.01;
  
  // Draw newsprint texture
  drawNewsprint();
  
  // Draw glowing circuits
  strokeWeight(2);
  for (let i = 0; i < circuits.length; i++) {
    let c = circuits[i];
    
    // Animate circuit elements
    c.phase += c.speed;
    
    // Circuit trace glow
    let hue = (c.hue + time * 10) % 360;
    stroke(hue, 80, 100, 0.8);
    
    push();
    translate(c.x, c.y);
    
    // Draw copper wire pattern
    beginShape();
    for (let j = 0; j < 6; j++) {
      let angle = map(j, 0, 6, 0, TWO_PI);
      let xoff = cos(angle) * c.size;
      let yoff = sin(angle) * c.size;
      
      // Add noise to wire paths for organic feel
      let noiseX = noise(c.x * noiseScale, c.y * noiseScale, time * 0.5) * 20 - 10;
      let noiseY = noise((c.x + 1000) * noiseScale, (c.y + 1000) * noiseScale, time * 0.5) * 20 - 10;
      
      vertex(xoff + noiseX, yoff + noiseY);
    }
    endShape(CLOSE);
    
    // Draw inner circuit traces
    stroke(hue, 90, 100, 0.6);
    for (let j = 0; j < 3; j++) {
      let angle1 = map(j, 0, 3, 0, TWO_PI);
      let angle2 = map(j + 1, 0, 3, 0, TWO_PI);
      let x1 = cos(angle1) * c.size * 0.5;
      let y1 = sin(angle1) * c.size * 0.5;
      let x2 = cos(angle2) * c.size * 0.5;
      let y2 = sin(angle2) * c.size * 0.5;
      
      line(x1, y1, x2, y2);
    }
    
    // Add flowing data traces
    stroke(hue, 100, 100, 0.4);
    let traceSize = c.size * 0.3;
    for (let j = 0; j < 5; j++) {
      let angle = map(j, 0, 5, 0, TWO_PI);
      let xoff = cos(angle) * traceSize;
      let yoff = sin(angle) * traceSize;
      
      // Flowing animation
      let flow = (time * 2 + c.phase + j) % TWO_PI;
      let flowX = cos(flow) * traceSize * 0.5;
      let flowY = sin(flow) * traceSize * 0.5;
      
      line(xoff, yoff, xoff + flowX, yoff + flowY);
    }
    
    pop();
  }
  
  // Add dynamic data flows
  strokeWeight(1);
  for (let i = 0; i < 30; i++) {
    let x = (time * 50 + i * 200) % width;
    let y = sin(time * 0.7 + i * 0.3) * 100 + height/2;
    
    // Flowing data line
    stroke(200, 80, 100, 0.3);
    beginShape();
    for (let j = 0; j < 8; j++) {
      let angle = map(j, 0, 8, 0, TWO_PI);
      let xoff = cos(angle) * 15;
      let yoff = sin(angle) * 15;
      
      // Add flowing motion
      let flow = (time + i * 0.2 + j) % TWO_PI;
      let noiseX = cos(flow) * 10;
      let noiseY = sin(flow) * 10;
      
      vertex(x + xoff + noiseX, y + yoff + noiseY);
    }
    endShape(CLOSE);
  }
}

function drawNewsprint() {
  // Draw subtle newsprint texture
  noStroke();
  fill(20, 5, 95, 0.1);
  for (let i = 0; i < 500; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(0.5, 2);
    ellipse(x, y, size, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
