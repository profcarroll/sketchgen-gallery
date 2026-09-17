let fragments = [];
let connections = [];
let pulse = 0;
let collapseTimer = 0;
let isCollapsing = false;

class Fragment {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-1, 1);
    this.vy = random(-1, 1);
    this.size = random(5, 15);
    this.energy = random(0.5, 1);
  }

  update() {
    this.x += this.vx * this.energy;
    this.y += this.vy * this.energy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(frameCount * 0.02);
    fill(255, 200);
    noStroke();
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = map(i, 0, 6, 0, TWO_PI);
      let x = cos(angle) * this.size;
      let y = sin(angle) * this.size;
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }
}

function setup() {
  createCanvas(800, 600);
  for (let i = 0; i < 50; i++) {
    fragments.push(new Fragment(random(width), random(height)));
  }
}

function draw() {
  background(20);

  // Update and display fragments
  for (let frag of fragments) {
    frag.update();
    frag.display();
  }

  // Connect nearby fragments
  connections = [];
  for (let i = 0; i < fragments.length; i++) {
    for (let j = i + 1; j < fragments.length; j++) {
      let d = dist(fragments[i].x, fragments[i].y, fragments[j].x, fragments[j].y);
      if (d < 100) {
        connections.push([fragments[i], fragments[j]]);
      }
    }
  }

  // Draw connections
  stroke(255, 50);
  noFill();
  for (let [a, b] of connections) {
    line(a.x, a.y, b.x, b.y);
  }

  // Pulse effect
  pulse = (pulse + 0.05) % TWO_PI;
  let pulseSize = sin(pulse) * 2;
  for (let frag of fragments) {
    if (random() < 0.1) {
      fill(255, 100);
      noStroke();
      ellipse(frag.x, frag.y, frag.size + pulseSize);
    }
  }

  // Collapse trigger
  collapseTimer++;
  if (collapseTimer > 300 && !isCollapsing) {
    isCollapsing = true;
    for (let frag of fragments) {
      frag.vx += random(-2, 2);
      frag.vy += random(-2, 2);
    }
  }

  // Reset after collapse
  if (isCollapsing && collapseTimer > 350) {
    isCollapsing = false;
    collapseTimer = 0;
    for (let i = 0; i < fragments.length; i++) {
      fragments[i] = new Fragment(random(width), random(height));
    }
  }
}
