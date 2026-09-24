let heartbeats = [];
let time = 0;
let glowStrength = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Generate a realistic EKG waveform pattern
  for (let i = 0; i < 1000; i++) {
    let x = i * 2;
    let y = 0;
    // Simulate heartbeats with peaks and irregularities
    if (i % 100 === 0) {
      y += random(50, 100);
    }
    if (i % 150 === 0) {
      y += random(-30, -10);
    }
    if (i % 200 === 0) {
      y += random(-20, 5);
    }
    heartbeats.push({ x, y });
  }
}

function draw() {
  background(0);
  
  // Animate the scrolling effect
  time += 2;
  
  // Create a glowing trail effect
  glowStrength = (sin(frameCount * 0.1) + 1) * 50;
  
  strokeWeight(3);
  noFill();
  
  beginShape();
  for (let i = 0; i < heartbeats.length; i++) {
    let x = heartbeats[i].x - time;
    let y = heartbeats[i].y;
    
    // Wrap around the canvas
    if (x < -100) x += width + 200;
    
    // Apply glow effect
    let alpha = map(x, 0, width, 50, 255);
    stroke(0, 255, 255, alpha);
    
    vertex(x, height/2 + y);
  }
  endShape();
  
  // Add neon glow
  drawingContext.shadowBlur = glowStrength;
  drawingContext.shadowColor = color(0, 255, 255);
  
  beginShape();
  for (let i = 0; i < heartbeats.length; i++) {
    let x = heartbeats[i].x - time;
    let y = heartbeats[i].y;
    
    if (x < -100) x += width + 200;
    
    vertex(x, height/2 + y);
  }
  endShape();
  
  drawingContext.shadowBlur = 0;
}
