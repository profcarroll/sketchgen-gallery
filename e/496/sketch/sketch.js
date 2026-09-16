let fields = [];
const numFields = 15;
const maxRadius = 300;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize fields with random properties
  for (let i = 0; i < numFields; i++) {
    fields.push({
      x: random(width),
      y: random(height),
      radius: random(100, maxRadius),
      hue: random(360),
      saturation: random(70, 90),
      brightness: random(60, 80),
      speed: random(0.001, 0.005),
      timeOffset: random(1000)
    });
  }
}

function draw() {
  background(0, 0, 0, 1);
  
  // Draw each field with soft blending
  for (let i = 0; i < fields.length; i++) {
    let f = fields[i];
    
    // Animate hue shift over time
    f.hue = (f.hue + f.speed * 20 + sin(frameCount * 0.001 + f.timeOffset) * 0.5) % 360;
    
    // Create soft gradient effect using multiple circles
    noStroke();
    fill(f.hue, f.saturation, f.brightness, 0.1);
    
    // Draw multiple overlapping circles to create diffusion
    for (let j = 0; j < 5; j++) {
      let radius = f.radius * (1 - j * 0.2);
      ellipse(f.x, f.y, radius * 2);
    }
  }
  
  // Add subtle layer blending between fields
  blendMode(DODGE);
  for (let i = 0; i < fields.length; i++) {
    let f = fields[i];
    fill(f.hue, f.saturation, f.brightness, 0.05);
    
    // Draw a few more circles to enhance the diffusion
    for (let j = 0; j < 3; j++) {
      let radius = f.radius * (1 - j * 0.3);
      ellipse(f.x + random(-20, 20), f.y + random(-20, 20), radius * 2);
    }
  }
  blendMode(BLEND);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
