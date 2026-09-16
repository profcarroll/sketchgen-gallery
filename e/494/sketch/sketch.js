let stripes = [];
let colorPalette;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorPalette = [
    [255, 50, 50],   // Red
    [255, 150, 50],  // Orange
    [255, 255, 50],  // Yellow
    [50, 255, 50],   // Green
    [50, 150, 255],  // Blue
    [150, 50, 255]   // Purple
  ];
  
  // Initialize stripes with varying properties
  for (let i = 0; i < 20; i++) {
    stripes.push({
      angle: random(TWO_PI),
      speed: random(0.01, 0.03),
      size: random(50, 200),
      colorIndex: floor(random(colorPalette.length)),
      pulseSpeed: random(0.02, 0.05)
    });
  }
}

function draw() {
  background(0);
  
  time += 0.02;
  
  // Draw each stripe as a pulsing diagonal band
  for (let i = 0; i < stripes.length; i++) {
    let s = stripes[i];
    
    // Update pulse effect
    let pulse = sin(time * s.pulseSpeed) * 0.5 + 0.5;
    let scale = 1 + pulse * 0.8;
    
    // Calculate stripe position and size
    let x = width / 2;
    let y = height / 2;
    let w = s.size * scale;
    let h = w * 0.3; // Make stripes thinner
    
    push();
    translate(x, y);
    rotate(s.angle + time * s.speed);
    
    // Draw the stripe with gradient
    let c = colorPalette[s.colorIndex];
    fill(c[0], c[1], c[2], 200);
    noStroke();
    rect(-w/2, -h/2, w, h);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
