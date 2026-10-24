let networkLines = [];
let spores = [];
let maxSpores = 1000;
let minSize = 2;
let maxSize = 8;
let networkDensity = 0.02;

class Spore {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);
    this.vel = p5.Vector.random3D().mult(random(1, 3));
    this.size = random(minSize, maxSize);
    this.color = color(random(200, 360), 100, 100, 0.8);
    this.life = 1;
    this.growthRate = random(0.01, 0.05);
    this.shockwaveRadius = 0;
    this.shockwaveMaxRadius = random(30, 60);
    this.shockwaveAlpha = 0.8;
    this.shockwaveSpeed = random(2, 5);
  }

  update() {
    this.pos.add(this.vel);
    this.life -= 0.005;
    
    // Grow shockwave
    if (this.shockwaveRadius < this.shockwaveMaxRadius) {
      this.shockwaveRadius += this.shockwaveSpeed;
    }
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    
    // Draw spore core
    fill(this.color);
    noStroke();
    sphere(this.size);
    
    // Draw shockwave
    if (this.shockwaveRadius < this.shockwaveMaxRadius) {
      noFill();
      stroke(this.color);
      strokeWeight(1);
      ellipse(0, 0, this.shockwaveRadius * 2);
    }
    
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Build fungal network
  buildNetwork();
}

function draw() {
  background(0, 0, 5, 25);
  
  // Camera movement for atmospheric effect
  let time = millis() / 3000;
  camera(0, 0, (height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0);
  rotateY(time * 0.02);
  
  // Draw fungal network
  drawNetwork();
  
  // Add new spores randomly
  if (spores.length < maxSpores && random() < 0.3) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = -150;
    spores.push(new Spore(x, y, z));
  }
  
  // Update and draw spores
  for (let i = spores.length - 1; i >= 0; i--) {
    let s = spores[i];
    s.update();
    s.display();
    
    if (s.life <= 0) {
      spores.splice(i, 1);
    }
  }
}

function buildNetwork() {
  // Create a network of lines representing fungal threads
  for (let i = 0; i < 500; i++) {
    let x1 = random(-width/2, width/2);
    let y1 = random(-height/2, height/2);
    let z1 = random(-200, -100);
    
    let x2 = x1 + random(-100, 100);
    let y2 = y1 + random(-100, 100);
    let z2 = z1 + random(-50, 50);
    
    networkLines.push({
      start: createVector(x1, y1, z1),
      end: createVector(x2, y2, z2)
    });
  }
}

function drawNetwork() {
  // Draw the fungal network
  for (let i = 0; i < networkLines.length; i++) {
    let line = networkLines[i];
    
    push();
    translate(line.start.x, line.start.y, line.start.z);
    
    let d = dist(line.start.x, line.start.y, line.start.z,
                 line.end.x, line.end.y, line.end.z);
    
    // Draw a thin tube along the line
    let dir = p5.Vector.sub(line.end, line.start);
    let angle = atan2(dir.y, dir.x);
    let rotY = asin(dir.z / d);
    
    rotateZ(angle);
    rotateX(rotY);
    
    fill(30, 20, 10, 0.7);
    noStroke();
    cylinder(2, d, 4, true);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
