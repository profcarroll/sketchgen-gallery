let planes = [];
let time = 0;
const numPlanes = 15;
const colorShiftSpeed = 0.002;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create overlapping planes with varying sizes and positions
  for (let i = 0; i < numPlanes; i++) {
    planes.push({
      x: random(width),
      y: random(height),
      w: random(200, width * 1.5),
      h: random(200, height * 1.5),
      hue: random(360),
      saturation: random(80, 100),
      brightness: random(60, 90),
      alpha: random(0.4, 0.7)
    });
  }
}

function draw() {
  background(0, 0, 0, 1);
  
  // Update time for color shifting
  time += colorShiftSpeed;
  
  // Draw each plane with subtle color shift
  for (let i = 0; i < planes.length; i++) {
    let p = planes[i];
    
    // Shift hue over time
    p.hue = (p.hue + sin(time + i * 0.3) * 2) % 360;
    
    // Draw the plane with soft edges and transparency
    fill(p.hue, p.saturation, p.brightness, p.alpha);
    noStroke();
    rect(p.x, p.y, p.w, p.h, 20); // rounded corners for soft definition
    
    // Add a subtle border effect on outermost planes
    if (i === planes.length - 1) {
      stroke(p.hue, p.saturation * 0.8, p.brightness * 0.9, 0.5);
      noFill();
      rect(p.x, p.y, p.w, p.h, 20);
    }
  }
  
  // Add subtle vibrating vertical layers
  stroke(0, 0, 100, 0.03);
  noFill();
  for (let i = 0; i < 10; i++) {
    let x = map(i, 0, 9, 0, width);
    let wave = sin(time * 2 + i * 0.5) * 5;
    beginShape();
    for (let y = 0; y <= height; y += 10) {
      vertex(x + wave, y);
    }
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
