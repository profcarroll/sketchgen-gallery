let corals = [];
let currentMouseX = 0;
let currentMouseY = 0;
let isDragging = false;
let oceanCurrent = { x: 0, y: 0 };
let backgroundTexture;

class Coral {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.segments = [];
    this.color = color(
      random(200, 255),
      random(150, 200),
      random(100, 150),
      200
    );
    this.initSegments();
  }

  initSegments() {
    let numSegments = int(random(8, 15));
    for (let i = 0; i < numSegments; i++) {
      let angle = random(TWO_PI);
      let length = random(this.size * 0.3, this.size * 0.7);
      let segment = {
        x: 0,
        y: 0,
        angle: angle,
        length: length,
        width: random(2, 6),
        color: this.color,
      };
      this.segments.push(segment);
    }
  }

  update() {
    // Slow ocean current effect
    let currentStrength = 0.001;
    this.x += oceanCurrent.x * currentStrength;
    this.y += oceanCurrent.y * currentStrength;

    // Add some gentle sway
    let sway = sin(frameCount * 0.01 + this.x * 0.01) * 0.5;
    this.x += sway * 0.2;
  }

  display() {
    push();
    translate(this.x, this.y);
    
    noFill();
    stroke(this.color);
    strokeWeight(1);
    
    for (let segment of this.segments) {
      let endX = segment.length * cos(segment.angle);
      let endY = segment.length * sin(segment.angle);
      
      // Add slight curve to the branches
      let curve = map(noise(frameCount * 0.02 + segment.angle), 0, 1, -0.2, 0.2);
      endX += curve * segment.length * 0.3;
      endY += curve * segment.length * 0.3;
      
      line(0, 0, endX, endY);
    }
    
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  
  // Create background texture
  backgroundTexture = createGraphics(width, height);
  backgroundTexture.background(240, 245, 250);
  for (let i = 0; i < 5000; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(0.2, 1);
    backgroundTexture.noStroke();
    backgroundTexture.fill(230, 240, 250);
    backgroundTexture.ellipse(x, y, size, size);
  }
  
  // Create coral formations
  for (let i = 0; i < 30; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(30, 100);
    corals.push(new Coral(x, y, size));
  }
  
  oceanCurrent.x = random(-1, 1);
  oceanCurrent.y = random(-1, 1);
}

function draw() {
  image(backgroundTexture, 0, 0);
  
  // Update and display corals
  for (let coral of corals) {
    coral.update();
    coral.display();
  }
}

function mousePressed() {
  isDragging = true;
}

function mouseDragged() {
  if (isDragging) {
    let dx = mouseX - currentMouseX;
    let dy = mouseY - currentMouseY;
    
    // Apply force to nearby corals
    for (let coral of corals) {
      let d = dist(mouseX, mouseY, coral.x, coral.y);
      if (d < 150) {
        let force = map(d, 0, 150, 3, 0);
        coral.x += dx * force * 0.1;
        coral.y += dy * force * 0.1;
      }
    }
    
    currentMouseX = mouseX;
    currentMouseY = mouseY;
  }
}

function mouseReleased() {
  isDragging = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
