let layers = [];
let time = 0;

class RockLayer {
  constructor(y, height, color) {
    this.y = y;
    this.height = height;
    this.color = color;
    this.offset = random(TWO_PI);
    this.speed = random(0.0005, 0.001);
    this.waveAmplitude = random(2, 8);
    this.waveFrequency = random(0.005, 0.02);
    this.fracturePoints = [];
    this.fractureIntensity = 0;
    this.slipAmount = 0;
  }

  update() {
    time += this.speed;
    let wave = sin(time + this.offset) * this.waveAmplitude;
    this.slipAmount = sin(time * 0.5 + this.offset) * 2;
    
    // Occasionally trigger fractures
    if (random() < 0.01) {
      this.fractureIntensity = random(0.5, 1);
      this.fracturePoints = [];
      let numPoints = floor(random(3, 8));
      for (let i = 0; i < numPoints; i++) {
        this.fracturePoints.push({
          x: random(width),
          y: this.y + random(this.height),
          size: random(5, 20)
        });
      }
    }
    
    if (this.fractureIntensity > 0) {
      this.fractureIntensity -= 0.02;
    }
  }

  display() {
    fill(this.color);
    noStroke();
    
    // Draw the base layer
    beginShape();
    vertex(0, this.y);
    for (let x = 0; x <= width; x += 20) {
      let y = this.y + this.height/2 + sin(x * this.waveFrequency + time) * this.waveAmplitude;
      vertex(x, y);
    }
    vertex(width, this.y);
    endShape(CLOSE);
    
    // Draw slip effect
    if (this.slipAmount !== 0) {
      stroke(this.color);
      strokeWeight(2);
      for (let x = 0; x <= width; x += 40) {
        let y1 = this.y + this.height/2;
        let y2 = y1 + this.slipAmount;
        line(x, y1, x, y2);
      }
    }
    
    // Draw fractures
    if (this.fractureIntensity > 0) {
      stroke(0, 30);
      strokeWeight(2);
      for (let point of this.fracturePoints) {
        let size = point.size * this.fractureIntensity;
        ellipse(point.x, point.y, size, size/2);
      }
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create rock layers with varying properties
  let totalHeight = height * 0.8;
  let numLayers = 15;
  let baseY = height * 0.1;
  
  for (let i = 0; i < numLayers; i++) {
    let y = baseY + (i / numLayers) * totalHeight;
    let layerHeight = totalHeight / numLayers;
    
    // Create colors based on depth and rock type
    let hue = map(i, 0, numLayers, 20, 40); // Warm earth tones
    let saturation = map(i, 0, numLayers, 30, 60);
    let brightness = map(i, 0, numLayers, 40, 70);
    
    // Add some variation to make it more natural
    hue += random(-5, 5);
    saturation += random(-10, 10);
    brightness += random(-10, 10);
    
    let layerColor = color(hue, saturation, brightness);
    layers.push(new RockLayer(y, layerHeight, layerColor));
  }
}

function draw() {
  background(20, 10, 10); // Deep, dark background
  
  // Update and display layers
  for (let layer of layers) {
    layer.update();
    layer.display();
  }
  
  // Draw surface features
  stroke(0, 20);
  strokeWeight(1);
  for (let x = 0; x < width; x += 30) {
    let y = height * 0.9 + sin(x * 0.01 + time) * 5;
    point(x, y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
