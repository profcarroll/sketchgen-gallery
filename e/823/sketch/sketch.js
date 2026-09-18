let bands = [];
let stripes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create main color bands
  for (let i = 0; i < 8; i++) {
    bands.push({
      y: random(height),
      speed: random(0.5, 2),
      hue: random(360),
      width: random(50, 150)
    });
  }
  
  // Create fine stripes
  for (let i = 0; i < 200; i++) {
    stripes.push({
      x: random(width),
      y: random(height),
      angle: random(TWO_PI),
      speed: random(0.1, 0.5),
      length: random(20, 80)
    });
  }
}

function draw() {
  background(0, 0, 10);
  
  // Update and draw bands
  for (let band of bands) {
    band.y += band.speed;
    if (band.y > height + 100) band.y = -100;
    
    fill(band.hue, 80, 90, 0.7);
    noStroke();
    rect(0, band.y, width, band.width);
    
    // Add a second band for more complexity
    fill((band.hue + 120) % 360, 80, 90, 0.5);
    rect(0, band.y - band.width/2, width, band.width/3);
  }
  
  // Update and draw stripes
  for (let stripe of stripes) {
    stripe.x += cos(stripe.angle) * stripe.speed;
    stripe.y += sin(stripe.angle) * stripe.speed;
    
    if (stripe.x < -10 || stripe.x > width + 10 || 
        stripe.y < -10 || stripe.y > height + 10) {
      stripe.x = random(width);
      stripe.y = random(height);
      stripe.angle = random(TWO_PI);
    }
    
    stroke(255, 20);
    strokeWeight(1);
    line(stripe.x, stripe.y, 
         stripe.x + cos(stripe.angle) * stripe.length,
         stripe.y + sin(stripe.angle) * stripe.length);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
