let bands = [];
let stripes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create geometric bands
  for (let i = 0; i < 8; i++) {
    bands.push({
      angle: random(TWO_PI),
      speed: random(0.002, 0.005),
      radius: random(100, 300),
      width: random(20, 60),
      hue: random(360)
    });
  }
  
  // Create fine stripes
  for (let i = 0; i < 200; i++) {
    stripes.push({
      x: random(width),
      y: random(height),
      angle: random(TWO_PI),
      length: random(100, 300),
      speed: random(0.005, 0.02)
    });
  }
}

function draw() {
  background(0, 0, 10);
  
  // Update and draw bands
  for (let band of bands) {
    band.angle += band.speed;
    
    push();
    translate(width/2, height/2);
    rotate(band.angle);
    
    // Draw a large geometric band with sharp edges
    fill(band.hue, 80, 90);
    noStroke();
    beginShape();
    vertex(-band.radius, -band.width/2);
    vertex(band.radius, -band.width/2);
    vertex(band.radius, band.width/2);
    vertex(-band.radius, band.width/2);
    endShape(CLOSE);
    
    // Add a boundary highlight
    stroke(0, 0, 100);
    strokeWeight(2);
    noFill();
    beginShape();
    vertex(-band.radius, -band.width/2);
    vertex(band.radius, -band.width/2);
    vertex(band.radius, band.width/2);
    vertex(-band.radius, band.width/2);
    endShape(CLOSE);
    pop();
  }
  
  // Update and draw stripes
  for (let stripe of stripes) {
    stripe.angle += stripe.speed;
    
    push();
    translate(stripe.x, stripe.y);
    rotate(stripe.angle);
    
    stroke(255, 100, 100, 0.7);
    strokeWeight(1);
    line(0, 0, stripe.length, 0);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
