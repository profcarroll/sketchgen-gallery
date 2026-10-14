let bands = [];
let stripes = [];
let maxBands = 12;
let maxStripes = 500;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize geometric bands
  for (let i = 0; i < maxBands; i++) {
    bands.push({
      x: random(width),
      y: random(height),
      size: random(100, 300),
      angle: random(TWO_PI),
      speed: random(0.002, 0.008),
      hue: random(360),
      strokeWeight: random(2, 6)
    });
  }
  
  // Initialize linear stripes
  for (let i = 0; i < maxStripes; i++) {
    stripes.push({
      x: random(width),
      y: random(height),
      length: random(50, 150),
      angle: random(TWO_PI),
      speed: random(0.01, 0.03),
      hue: random(360),
      alpha: random(0.3, 0.7)
    });
  }
}

function draw() {
  background(0, 0, 5, 0.02);
  
  time += 0.01;
  
  // Update and draw bands
  for (let i = 0; i < bands.length; i++) {
    let band = bands[i];
    
    // Animate band position and angle
    band.x += cos(band.angle) * band.speed * 100;
    band.y += sin(band.angle) * band.speed * 100;
    band.angle += (noise(band.x * 0.001, band.y * 0.001, time) - 0.5) * 0.02;
    
    // Keep bands within canvas
    if (band.x < -band.size || band.x > width + band.size ||
        band.y < -band.size || band.y > height + band.size) {
      band.x = random(width);
      band.y = random(height);
      band.angle = random(TWO_PI);
    }
    
    // Draw the band as a polygon
    push();
    translate(band.x, band.y);
    rotate(band.angle);
    fill(band.hue, 80, 90, 0.1);
    noStroke();
    beginShape();
    vertex(-band.size * 0.5, -band.size * 0.1);
    vertex(band.size * 0.5, -band.size * 0.1);
    vertex(band.size * 0.5, band.size * 0.1);
    vertex(-band.size * 0.5, band.size * 0.1);
    endShape(CLOSE);
    pop();
    
    // Draw sharp edges of the band
    stroke(band.hue, 80, 90, 0.8);
    strokeWeight(band.strokeWeight);
    line(
      band.x - cos(band.angle) * band.size * 0.5,
      band.y - sin(band.angle) * band.size * 0.5,
      band.x + cos(band.angle) * band.size * 0.5,
      band.y + sin(band.angle) * band.size * 0.5
    );
  }
  
  // Update and draw stripes
  for (let i = 0; i < stripes.length; i++) {
    let stripe = stripes[i];
    
    // Animate stripe position and angle
    stripe.x += cos(stripe.angle) * stripe.speed * 100;
    stripe.y += sin(stripe.angle) * stripe.speed * 100;
    stripe.angle += (noise(stripe.x * 0.001, stripe.y * 0.001, time) - 0.5) * 0.03;
    
    // Reset stripe if out of bounds
    if (stripe.x < -100 || stripe.x > width + 100 ||
        stripe.y < -100 || stripe.y > height + 100) {
      stripe.x = random(width);
      stripe.y = random(height);
      stripe.angle = random(TWO_PI);
    }
    
    // Draw the stripe
    stroke(stripe.hue, 80, 90, stripe.alpha);
    strokeWeight(1);
    line(
      stripe.x,
      stripe.y,
      stripe.x + cos(stripe.angle) * stripe.length,
      stripe.y + sin(stripe.angle) * stripe.length
    );
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
