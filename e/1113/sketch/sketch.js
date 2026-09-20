let events = [];
let maxEvents = 3;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  background(20, 20, 30);
}

function draw() {
  background(20, 20, 30, 5);
  
  for (let i = events.length - 1; i >= 0; i--) {
    let e = events[i];
    e.update();
    e.show();
    if (e.finished()) {
      events.splice(i, 1);
    }
  }
  
  // spawn new events randomly
  if (random() < 0.02 && events.length < maxEvents) {
    events.push(new SeismicEvent());
  }
}

class SeismicEvent {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.age = 0;
    this.life = random(60, 120);
    this.baseRadius = random(30, 80);
    this.vertices = [];
    this.initVertices();
  }
  
  initVertices() {
    let count = 12;
    for (let i = 0; i < count; i++) {
      let angle = map(i, 0, count, 0, TWO_PI);
      let r = this.baseRadius * random(0.8, 1.2);
      this.vertices.push(createVector(cos(angle) * r, sin(angle) * r));
    }
  }
  
  update() {
    this.age++;
  }
  
  show() {
    let progress = this.age / this.life;
    if (progress > 1) progress = 1;
    
    // fading effect
    let alpha = map(progress, 0, 1, 80, 0);
    let hue = 200 + progress * 20;
    
    noFill();
    stroke(hue, 80, 90, alpha);
    strokeWeight(2);
    
    beginShape();
    for (let v of this.vertices) {
      let angle = atan2(v.y, v.x);
      let mag = dist(v.x, v.y, 0, 0);
      // rippling effect - outward movement with diminishing intensity
      let shrink = max(0, 1 - progress * 0.8);
      let pulse = sin(this.age * 0.1 + angle) * 5 * (1 - progress);
      let x = this.pos.x + v.x * shrink + pulse * cos(angle);
      let y = this.pos.y + v.y * shrink + pulse * sin(angle);
      vertex(x, y);
    }
    endShape();
    
    // draw blurred edges
    strokeWeight(1);
    stroke(hue, 80, 90, alpha * 0.3);
    beginShape();
    for (let v of this.vertices) {
      let angle = atan2(v.y, v.x);
      let mag = dist(v.x, v.y, 0, 0);
      let shrink = max(0, 1 - progress * 0.6);
      let spread = 10 * (1 - progress);
      let x = this.pos.x + v.x * shrink + spread * random(-1, 1);
      let y = this.pos.y + v.y * shrink + spread * random(-1, 1);
      vertex(x, y);
    }
    endShape();
  }
  
  finished() {
    return this.age > this.life;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
