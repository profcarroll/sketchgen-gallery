let fft;
let amplitude;
let lines = [];
let hexagons = [];
let soundActive = false;

function setup() {
  createCanvas(400, 400);
  noFill();
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
  userStartAudio();
}

function draw() {
  background(10);

  if (soundActive) {
    let spectrum = fft.analyze();
    let bass = amplitude.getLevel();
    
    // Update line density and speed based on sound
    let density = map(bass, 0, 0.5, 50, 300);
    let speed = map(bass, 0, 0.5, 0.01, 0.05);
    
    // Update lines
    for (let i = 0; i < lines.length; i++) {
      lines[i].update(speed);
      lines[i].display();
    }
    
    // Reorganize into hexagonal patterns occasionally
    if (frameCount % 120 === 0) {
      generateHexagons(density);
    }
    
    // Draw hexagons if they exist
    for (let i = 0; i < hexagons.length; i++) {
      hexagons[i].display();
    }
  } else {
    // Default animation when no sound
    for (let i = 0; i < lines.length; i++) {
      lines[i].update(0.01);
      lines[i].display();
    }
  }

  // Add new lines occasionally
  if (frameCount % 3 === 0 && lines.length < 500) {
    lines.push(new Line());
  }
}

function mousePressed() {
  soundActive = true;
}

class Line {
  constructor() {
    this.start = createVector(random(width), random(height));
    this.end = createVector(random(width), random(height));
    this.angle = random(TWO_PI);
    this.speed = random(0.01, 0.05);
    this.length = random(20, 80);
    this.thickness = random(1, 3);
  }

  update(speed) {
    this.angle += speed;
    let dx = cos(this.angle) * this.length;
    let dy = sin(this.angle) * this.length;
    
    this.start.x = (this.start.x + dx) % width;
    this.start.y = (this.start.y + dy) % height;
    this.end.x = (this.end.x + dx) % width;
    this.end.y = (this.end.y + dy) % height;
  }

  display() {
    stroke(255, 100);
    strokeWeight(this.thickness);
    line(this.start.x, this.start.y, this.end.x, this.end.y);
  }
}

function generateHexagons(density) {
  hexagons = [];
  let size = 40;
  for (let x = 0; x < width; x += size * 1.5) {
    for (let y = 0; y < height; y += size * sqrt(3)) {
      if (random() > 1 - density/1000) {
        hexagons.push(new Hexagon(x, y, size));
      }
    }
  }
}

class Hexagon {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.rotation = random(TWO_PI);
    this.thickness = random(1, 2);
  }

  display() {
    stroke(255, 80);
    strokeWeight(this.thickness);
    noFill();
    
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = this.rotation + i * TWO_PI / 6;
      let px = this.x + cos(angle) * this.size;
      let py = this.y + sin(angle) * this.size;
      vertex(px, py);
    }
    endShape(CLOSE);
  }
}
