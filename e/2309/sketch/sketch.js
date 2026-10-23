let layers = [];
let drips = [];
let slate;

function setup() {
  createCanvas(windowWidth, windowHeight);
  slate = createGraphics(width, height);
  slate.background(30, 40, 50);
  
  // Create geological layers
  for (let i = 0; i < 20; i++) {
    let y = map(i, 0, 19, height * 0.3, height * 0.8);
    let thickness = random(10, 40);
    let layerColor = color(
      random(220, 255),
      random(230, 255),
      random(240, 255)
    );
    layers.push({
      y: y,
      thickness: thickness,
      color: layerColor,
      offset: random(TWO_PI)
    });
  }
  
  // Create initial drips
  for (let i = 0; i < 50; i++) {
    drips.push(new Drip());
  }
}

function draw() {
  // Draw slate base
  image(slate, 0, 0);
  
  // Draw layers with subtle movement
  for (let layer of layers) {
    let y = layer.y + sin(frameCount * 0.005 + layer.offset) * 2;
    
    noStroke();
    fill(layer.color);
    rect(0, y, width, layer.thickness);
    
    // Add texture to layers
    stroke(200, 210, 220, 30);
    strokeWeight(1);
    for (let i = 0; i < 50; i++) {
      let x = random(width);
      let h = random(1, 3);
      line(x, y, x, y + h);
    }
  }
  
  // Update and display drips
  for (let i = drips.length - 1; i >= 0; i--) {
    drips[i].update();
    drips[i].display();
    
    if (drips[i].isDead()) {
      drips.splice(i, 1);
    }
  }
  
  // Add new drips occasionally
  if (frameCount % 10 === 0 && drips.length < 100) {
    drips.push(new Drip());
  }
}

class Drip {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = random(width);
    this.y = -10;
    this.size = random(2, 6);
    this.speed = random(0.5, 2);
    this.alpha = 255;
    this.color = color(
      random(200, 255),
      random(220, 255),
      random(240, 255)
    );
    this.growth = random(0.1, 0.3);
  }
  
  update() {
    // Drip falls
    this.y += this.speed;
    
    // Grow as it moves
    this.size += this.growth;
    
    // Fade out
    this.alpha -= 1;
    
    // Reset if off screen or dead
    if (this.y > height + 50 || this.alpha <= 0) {
      this.reset();
    }
  }
  
  display() {
    noStroke();
    fill(this.color, this.alpha);
    ellipse(this.x, this.y, this.size, this.size);
  }
  
  isDead() {
    return this.alpha <= 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
