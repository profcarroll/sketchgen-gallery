let img;
let particles = [];
let flowField;
let scl = 20;
let cols, rows;

function preload() {
  img = loadImage('https://picsum.photos/seed/chromatic/800/600');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = floor(width / scl);
  rows = floor(height / scl);
  flowField = new Array(cols * rows);
  
  img.loadPixels();
  for (let i = 0; i < flowField.length; i++) {
    let x = (i % cols) * scl;
    let y = floor(i / cols) * scl;
    let ix = floor(map(x, 0, width, 0, img.width - 1));
    let iy = floor(map(y, 0, height, 0, img.height - 1));
    let idx = (iy * img.width + ix) * 4;
    let lum = (img.pixels[idx] + img.pixels[idx + 1] + img.pixels[idx + 2]) / 3;
    let angle = map(lum, 0, 255, 0, TWO_PI);
    flowField[i] = p5.Vector.fromAngle(angle).mult(0.5);
  }
  
  for (let i = 0; i < 1200; i++) {
    particles[i] = new Particle();
  }
}

function draw() {
  background(0, 8);
  
  beginShape(POINTS);
  strokeWeight(1.5);
  
  for (let p of particles) {
    p.follow(flowField, cols, rows, scl);
    p.update();
    
    // Sample color from image
    let ix = floor(constrain(p.pos.x / width * img.width, 0, img.width - 1));
    let iy = floor(constrain(p.pos.y / height * img.height, 0, img.height - 1));
    let idx = (iy * img.width + ix) * 4;
    
    // Apply subtle color bleeding effect
    let r = img.pixels[idx];
    let g = img.pixels[idx + 1];
    let b = img.pixels[idx + 2];
    stroke(r, g, b, 180);
    
    point(p.pos.x, p.pos.y);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxspeed = 2;
  }
  
  follow(vectors, cols, rows, scl) {
    let x = floor(this.pos.x / scl);
    let y = floor(this.pos.y / scl);
    x = constrain(x, 0, cols - 1);
    y = constrain(y, 0, rows - 1);
    let index = x + y * cols;
    
    if (index >= 0 && index < vectors.length) {
      let force = vectors[index].copy();
      this.applyForce(force);
    }
  }
  
  applyForce(force) {
    this.acc.add(force);
  }
  
  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    
    // Toroidal wrapping
    this.pos.x = (this.pos.x + width) % width;
    this.pos.y = (this.pos.y + height) % height;
  }
}
