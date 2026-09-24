let corals = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Create initial coral structures
  for (let i = 0; i < 30; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(20, 60);
    let segments = floor(random(3, 6));
    corals.push(new Coral(x, y, size, segments));
  }
}

function draw() {
  background(10, 20, 30);

  time += 0.003;
  
  // Update and display corals
  for (let coral of corals) {
    coral.update();
    coral.display();
  }
}

class Coral {
  constructor(x, y, size, segments) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.segments = segments;
    this.angle = random(TWO_PI);
    this.growth = random(0.5, 1.5);
    this.baseHue = random(20, 60); // Initial pale hues
    this.baseSat = random(30, 60);
    this.baseBright = random(40, 70);
    this.pulse = random(0.5, 2.0);
    this.segmentsArray = [];
    
    // Precompute segment positions for smoother animation
    for (let i = 0; i < segments; i++) {
      this.segmentsArray.push({
        angle: i * TWO_PI / segments,
        length: random(0.5, 1.0)
      });
    }
  }

  update() {
    this.angle += 0.005 * this.growth;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    // Color transition over time
    let t = sin(time * 0.3 + this.size * 0.1) * 0.5 + 0.5;
    
    // Gradually shift from pale to vibrant
    let hue = lerp(this.baseHue, map(t, 0, 1, 200, 300), t);
    let sat = lerp(this.baseSat, map(t, 0, 1, 80, 100), t);
    let bright = lerp(this.baseBright, map(t, 0, 1, 60, 100), t);

    fill(hue, sat, bright);
    
    // Draw the coral structure with branching segments
    for (let i = 0; i < this.segments; i++) {
      let seg = this.segmentsArray[i];
      let nextSeg = this.segmentsArray[(i + 1) % this.segments];
      
      let a = seg.angle;
      let b = nextSeg.angle;
      
      let r1 = this.size * 0.3 * seg.length;
      let r2 = this.size * 0.5 * seg.length;
      let r3 = this.size * 0.8 * seg.length;
      let r4 = this.size * 1.0 * seg.length;

      beginShape();
      vertex(0, 0);
      vertex(r1 * cos(a), r1 * sin(a));
      vertex(r2 * cos(b), r2 * sin(b));
      vertex(r3 * cos(b), r3 * sin(b));
      vertex(r4 * cos(b), r4 * sin(b));
      vertex(r4 * cos(a), r4 * sin(a));
      endShape(CLOSE);
    }

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
