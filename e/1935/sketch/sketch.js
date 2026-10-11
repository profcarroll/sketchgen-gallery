let layers = [];
let faultLines = [];
let time = 0;
let upliftSpeed = 0.02;
let stressIntensity = 0;

class RockLayer {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.originalY = y;
    this.slipAmount = 0;
    this.slipDirection = random() > 0.5 ? 1 : -1;
  }

  update() {
    // Apply slow uplift
    this.y -= upliftSpeed;
    
    // Apply tectonic stress (random slippage)
    if (random() < 0.02) {
      this.slipAmount = random(-3, 3);
    }
    
    // Gradually return to normal position
    this.slipAmount *= 0.95;
  }

  display() {
    push();
    translate(0, this.slipAmount);
    fill(this.color);
    noStroke();
    rect(this.x, this.y, this.width, this.height);
    pop();
  }
}

class FaultLine {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.gougeParticles = [];
    this.generateGouge();
  }

  generateGouge() {
    // Create fault gouge particles
    for (let i = 0; i < 50; i++) {
      let t = random();
      let x = lerp(this.x1, this.x2, t);
      let y = lerp(this.y1, this.y2, t);
      this.gougeParticles.push({
        x: x,
        y: y,
        size: random(1, 3),
        opacity: random(50, 150)
      });
    }
  }

  update() {
    // Random movement of gouge particles
    for (let particle of this.gougeParticles) {
      particle.x += random(-0.5, 0.5);
      particle.y += random(-0.3, 0.3);
    }
    
    // Occasionally shift the fault line
    if (random() < 0.01) {
      let shift = random(-2, 2);
      this.x1 += shift;
      this.x2 += shift;
    }
  }

  display() {
    stroke(100);
    strokeWeight(2);
    line(this.x1, this.y1, this.x2, this.y2);
    
    // Draw fault gouge
    noStroke();
    for (let particle of this.gougeParticles) {
      fill(150, 150, 150, particle.opacity);
      ellipse(particle.x, particle.y, particle.size);
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create rock layers
  let layerHeight = 40;
  let totalLayers = 20;
  
  for (let i = 0; i < totalLayers; i++) {
    let y = height - (i * layerHeight) - 50;
    let width = random(80, 120);
    let x = random(width, width + 50);
    
    // Create different rock types
    let hue = map(i, 0, totalLayers, 20, 30); // Warm colors for sedimentary
    if (i > totalLayers * 0.7) {
      hue = map(i, totalLayers * 0.7, totalLayers, 180, 240); // Cool colors for metamorphic
    }
    
    let saturation = random(30, 70);
    let brightness = random(40, 80);
    let colorValue = color(hue, saturation, brightness);
    
    layers.push(new RockLayer(x, y, width, layerHeight, colorValue));
  }
  
  // Create fault lines
  for (let i = 0; i < 8; i++) {
    let x1 = random(100, width - 100);
    let y1 = random(200, height - 150);
    let x2 = x1 + random(50, 150);
    let y2 = y1 + random(-50, 50);
    
    faultLines.push(new FaultLine(x1, y1, x2, y2));
  }
}

function draw() {
  background(220, 10, 90);
  
  time += 0.01;
  
  // Apply stress
  stressIntensity = sin(time * 0.5) * 0.3 + 0.7;
  
  // Update and display layers
  for (let layer of layers) {
    layer.update();
    layer.display();
  }
  
  // Update and display fault lines
  for (let fault of faultLines) {
    fault.update();
    fault.display();
  }
  
  // Draw mountain peaks
  fill(200, 30, 50);
  noStroke();
  beginShape();
  for (let i = 0; i < width; i += 10) {
    let y = height - 200 + sin(i * 0.02 + time) * 30;
    vertex(i, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
  
  // Draw some distant mountains
  fill(180, 20, 40);
  for (let i = 0; i < 5; i++) {
    let x = i * 300 + time * 0.5;
    let h = random(100, 200);
    triangle(x, height - 200, x + 50, height - 200 - h, x + 100, height - 200);
  }
  
  // Draw some vegetation
  fill(30, 80, 60);
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = height - 20;
    ellipse(x, y, random(2, 5));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
