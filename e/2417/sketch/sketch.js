let herds = [];
let noiseScale = 0.01;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a grid of herd patterns
  for (let x = 0; x < width; x += 120) {
    for (let y = 0; y < height; y += 120) {
      herds.push({
        x: x,
        y: y,
        size: random(40, 80),
        hue: random(10, 50), // Warm earth tones
        speed: random(0.005, 0.015),
        phase: random(TWO_PI),
        segments: floor(random(3, 7))
      });
    }
  }
}

function draw() {
  background(0);
  
  time += 0.005;
  
  // Draw tapestry texture
  drawTapestry();
  
  // Draw herds
  strokeWeight(2);
  for (let i = 0; i < herds.length; i++) {
    let h = herds[i];
    
    // Animate herd movement
    h.phase += h.speed;
    
    // Herd color
    let hue = (h.hue + time * 5) % 360;
    stroke(hue, 80, 100, 0.7);
    
    push();
    translate(h.x, h.y);
    
    // Draw organic herd shape
    beginShape();
    for (let j = 0; j < h.segments; j++) {
      let angle = map(j, 0, h.segments, 0, TWO_PI);
      let radius = h.size * (0.7 + noise((h.x + j * 100) * noiseScale, (h.y + j * 100) * noiseScale, time * 0.5) * 0.3);
      
      // Add noise to herd paths for organic feel
      let noiseX = noise((h.x + j * 100) * noiseScale, (h.y + j * 100) * noiseScale, time * 0.5) * 20 - 10;
      let noiseY = noise((h.x + j * 100 + 1000) * noiseScale, (h.y + j * 100 + 1000) * noiseScale, time * 0.5) * 20 - 10;
      
      let xoff = cos(angle) * radius + noiseX;
      let yoff = sin(angle) * radius + noiseY;
      
      vertex(xoff, yoff);
    }
    endShape(CLOSE);
    
    // Draw inner herd details
    stroke(hue, 90, 100, 0.5);
    for (let j = 0; j < h.segments; j++) {
      let angle1 = map(j, 0, h.segments, 0, TWO_PI);
      let angle2 = map(j + 1, 0, h.segments, 0, TWO_PI);
      
      let x1 = cos(angle1) * h.size * 0.5;
      let y1 = sin(angle1) * h.size * 0.5;
      let x2 = cos(angle2) * h.size * 0.5;
      let y2 = sin(angle2) * h.size * 0.5;
      
      line(x1, y1, x2, y2);
    }
    
    // Add flowing movement traces
    stroke(hue, 100, 100, 0.3);
    for (let j = 0; j < 8; j++) {
      let angle = map(j, 0, 8, 0, TWO_PI);
      let radius = h.size * 0.4;
      
      // Flowing animation
      let flow = (time * 1.5 + h.phase + j) % TWO_PI;
      let flowX = cos(flow) * radius * 0.3;
      let flowY = sin(flow) * radius * 0.3;
      
      let xoff = cos(angle) * radius;
      let yoff = sin(angle) * radius;
      
      line(xoff, yoff, xoff + flowX, yoff + flowY);
    }
    
    pop();
  }
  
  // Add dynamic movement flows
  strokeWeight(1);
  for (let i = 0; i < 50; i++) {
    let x = (time * 30 + i * 150) % width;
    let y = sin(time * 0.5 + i * 0.2) * 80 + height/2;
    
    // Flowing movement line
    stroke(200, 80, 100, 0.2);
    beginShape();
    for (let j = 0; j < 6; j++) {
      let angle = map(j, 0, 6, 0, TWO_PI);
      let xoff = cos(angle) * 10;
      let yoff = sin(angle) * 10;
      
      // Add flowing motion
      let flow = (time + i * 0.1 + j) % TWO_PI;
      let noiseX = cos(flow) * 5;
      let noiseY = sin(flow) * 5;
      
      vertex(x + xoff + noiseX, y + yoff + noiseY);
    }
    endShape(CLOSE);
  }
}

function drawTapestry() {
  // Draw subtle tapestry texture
  noStroke();
  fill(20, 10, 90, 0.1);
  for (let i = 0; i < 300; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(1, 3);
    ellipse(x, y, size, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
