let forms = [];
let veins = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();

  // Create organic forms inspired by rhododendrons
  for (let i = 0; i < 20; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(80, 200);
    let form = new OrganicForm(x, y, size);
    forms.push(form);
  }

  // Create vein-like networks
  for (let i = 0; i < 150; i++) {
    let v = new Vein();
    veins.push(v);
  }
}

function draw() {
  background(245);

  // Draw veins first so they appear under forms
  strokeWeight(0.5);
  for (let vein of veins) {
    vein.display();
  }

  // Draw forms on top
  for (let form of forms) {
    form.display();
  }
}

class OrganicForm {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.segments = [];
    this.generateSegments();
  }

  generateSegments() {
    let numSegments = floor(random(8, 15));
    for (let i = 0; i < numSegments; i++) {
      let angle = map(i, 0, numSegments, 0, TWO_PI);
      let radius = random(this.size * 0.3, this.size * 0.9);
      let px = this.x + cos(angle) * radius;
      let py = this.y + sin(angle) * radius;
      this.segments.push({ x: px, y: py });
    }
  }

  display() {
    // Fill with saturated jewel tone
    fill(random(180, 255), random(80, 150), random(100, 180));
    noStroke();
    
    // Draw form as a complex organic shape
    beginShape();
    for (let seg of this.segments) {
      vertex(seg.x, seg.y);
    }
    endShape(CLOSE);

    // Add pastel highlight
    fill(255, 255, 255, 80);
    noStroke();
    beginShape();
    for (let i = 0; i < this.segments.length; i++) {
      let seg = this.segments[i];
      let nextSeg = this.segments[(i + 1) % this.segments.length];
      let midX = (seg.x + nextSeg.x) / 2;
      let midY = (seg.y + nextSeg.y) / 2;
      vertex(midX, midY);
    }
    endShape(CLOSE);
  }
}

class Vein {
  constructor() {
    this.points = [];
    this.generatePath();
  }

  generatePath() {
    let x = random(width);
    let y = random(height);
    let len = random(80, 200);
    
    for (let i = 0; i < len; i++) {
      if (i === 0) {
        this.points.push({x: x, y: y});
      } else {
        let last = this.points[this.points.length - 1];
        let angle = random(-0.5, 0.5);
        let dx = cos(angle) * random(3, 8);
        let dy = sin(angle) * random(3, 8);
        this.points.push({
          x: last.x + dx,
          y: last.y + dy
        });
      }
    }
  }

  display() {
    // Draw vein with etched crystalline clarity
    strokeWeight(random(0.3, 1));
    stroke(255, 255, 255, 100);
    
    beginShape();
    for (let p of this.points) {
      vertex(p.x, p.y);
    }
    endShape();
    
    // Add subtle color variation to veins
    strokeWeight(random(0.1, 0.3));
    stroke(
      random(200, 255),
      random(100, 180),
      random(100, 160),
      150
    );
    
    beginShape();
    for (let i = 0; i < this.points.length; i += 2) {
      vertex(this.points[i].x, this.points[i].y);
    }
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
