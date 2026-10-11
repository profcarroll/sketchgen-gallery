let crystals = [];
let residues = [];
let grid = [];
let palette = [];

class Crystal {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.growth = 0;
    this.maxGrowth = random(50, 150);
    this.segments = [];
    this.growing = true;
    this.color = random(palette);
  }

  update() {
    if (this.growing && this.growth < this.maxGrowth) {
      this.growth += 0.5;
      
      // Add new segment
      let angle = random(TWO_PI);
      let length = random(5, 15);
      let endX = this.pos.x + cos(angle) * length;
      let endY = this.pos.y + sin(angle) * length;
      
      this.segments.push({
        start: createVector(this.pos.x, this.pos.y),
        end: createVector(endX, endY),
        life: 1
      });
    } else if (this.growing && this.growth >= this.maxGrowth) {
      this.growing = false;
    }

    // Update segment life
    for (let i = this.segments.length - 1; i >= 0; i--) {
      this.segments[i].life -= 0.01;
      if (this.segments[i].life <= 0) {
        this.segments.splice(i, 1);
      }
    }

    // Add residue
    if (frameCount % 5 === 0 && this.segments.length > 0) {
      let segment = random(this.segments);
      residues.push(new Residue(segment.end.x, segment.end.y, this.color));
    }
  }

  display() {
    noFill();
    stroke(this.color);
    strokeWeight(2);
    
    // Draw main crystal structure
    for (let seg of this.segments) {
      if (seg.life > 0.5) {
        let alpha = map(seg.life, 0.5, 1, 100, 255);
        stroke(red(this.color), green(this.color), blue(this.color), alpha);
        line(seg.start.x, seg.start.y, seg.end.x, seg.end.y);
      }
    }
    
    // Draw growth tip
    if (this.growing && this.segments.length > 0) {
      let lastSeg = this.segments[this.segments.length - 1];
      stroke(this.color);
      strokeWeight(3);
      point(lastSeg.end.x, lastSeg.end.y);
    }
  }
}

class Residue {
  constructor(x, y, color) {
    this.pos = createVector(x, y);
    this.life = 1;
    this.size = random(2, 5);
    this.color = color;
  }

  update() {
    this.life -= 0.01;
  }

  display() {
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.life * 200);
    ellipse(this.pos.x, this.pos.y, this.size * this.life);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);

  // Edo woodblock print palette
  palette = [
    color(255, 255, 255), // White
    color(180, 180, 180), // Light gray
    color(120, 120, 120), // Medium gray
    color(60, 60, 60),    // Dark gray
    color(255, 200, 200), // Pale pink
    color(255, 150, 150)  // Pink
  ];

  // Initialize crystals
  for (let i = 0; i < 5; i++) {
    crystals.push(new Crystal(random(width), random(height)));
  }

  // Grid for spatial hashing
  let cellSize = 80;
  let cols = ceil(width / cellSize);
  let rows = ceil(height / cellSize);
  grid = new Array(cols * rows).fill().map(() => []);
}

function draw() {
  background(10, 10, 20);

  // Update and display crystals
  for (let crystal of crystals) {
    crystal.update();
    crystal.display();
  }

  // Update and display residues
  for (let i = residues.length - 1; i >= 0; i--) {
    let r = residues[i];
    r.update();
    r.display();
    
    if (r.life <= 0) {
      residues.splice(i, 1);
    }
  }

  // Add new crystals occasionally
  if (frameCount % 200 === 0 && crystals.length < 15) {
    crystals.push(new Crystal(random(width), random(height)));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
