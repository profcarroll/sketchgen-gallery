let lights = [];
let gridLines = [];

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create grid lines
  for (let i = 0; i < 20; i++) {
    gridLines.push({
      x: map(i, 0, 19, 0, width),
      y: 0,
      w: 1,
      h: height
    });
  }
  
  // Create light streaks
  for (let i = 0; i < 500; i++) {
    lights.push({
      x: random(width),
      y: random(height),
      size: random(2, 8),
      speed: random(0.001, 0.005),
      angle: random(TWO_PI),
      hue: random(200, 260),
      sat: random(70, 90),
      bri: random(80, 100),
      alpha: random(0.3, 0.7)
    });
  }
}

function draw() {
  background(0, 0, 5); // Dark night sky
  
  // Draw grid lines
  stroke(200, 10, 80, 0.1);
  noFill();
  for (let line of gridLines) {
    rect(line.x, line.y, line.w, line.h);
  }
  
  // Update and draw light streaks
  for (let light of lights) {
    // Pulsate size
    light.size += sin(frameCount * light.speed) * 0.5;
    
    // Move along angle
    light.x += cos(light.angle) * 0.5;
    light.y += sin(light.angle) * 0.5;
    
    // Reset if out of bounds
    if (light.x < -10 || light.x > width + 10 || light.y < -10 || light.y > height + 10) {
      light.x = random(width);
      light.y = random(height);
      light.angle = random(TWO_PI);
    }
    
    // Draw glow
    fill(light.hue, light.sat, light.bri, light.alpha);
    noStroke();
    ellipse(light.x, light.y, light.size);
    
    // Draw streaks
    stroke(light.hue, light.sat, light.bri, light.alpha * 0.5);
    strokeWeight(1);
    line(light.x, light.y, light.x - cos(light.angle) * 20, light.y - sin(light.angle) * 20);
  }
  
  // Draw central structure
  push();
  translate(width/2, height/2);
  rotate(frameCount * 0.001);
  stroke(240, 80, 90, 0.3);
  noFill();
  for (let i = 0; i < 8; i++) {
    let angle = map(i, 0, 7, 0, TWO_PI);
    let x1 = cos(angle) * 200;
    let y1 = sin(angle) * 200;
    let x2 = cos(angle + PI) * 200;
    let y2 = sin(angle + PI) * 200;
    line(x1, y1, x2, y2);
  }
  pop();
}
