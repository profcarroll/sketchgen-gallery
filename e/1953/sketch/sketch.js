let arteries = [];
let particles = [];
let tapestryTexture;

class Artery {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);
    this.size = random(5, 15);
    this.segments = [];
    this.glow = random(0.5, 1);
    this.color = color(
      random(200, 255),
      random(50, 150),
      random(50, 100),
      200
    );
    this.growth = 0;
    this.maxGrowth = random(0.5, 1);
    
    // Create initial segments
    for (let i = 0; i < 8; i++) {
      let angle = map(i, 0, 8, 0, TWO_PI);
      let segX = cos(angle) * this.size;
      let segY = sin(angle) * this.size;
      this.segments.push(createVector(segX, segY, 0));
    }
  }

  update() {
    // Slowly grow the artery
    if (this.growth < this.maxGrowth) {
      this.growth += 0.001;
    }
    
    // Random pulsing effect
    this.glow = 0.5 + sin(millis() * 0.002 + this.pos.x * 0.01) * 0.3;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    
    // Draw the main artery
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), 150 * this.glow);
    
    beginShape();
    for (let i = 0; i < this.segments.length; i++) {
      let seg = this.segments[i];
      vertex(seg.x, seg.y, seg.z);
    }
    endShape(CLOSE);
    
    // Draw pulsing veins
    stroke(red(this.color), green(this.color), blue(this.color), 200 * this.glow);
    strokeWeight(1);
    noFill();
    beginShape();
    for (let i = 0; i < this.segments.length; i++) {
      let seg = this.segments[i];
      vertex(seg.x, seg.y, seg.z);
    }
    endShape(CLOSE);
    
    pop();
  }

  shed() {
    // Create particles that peel off
    for (let i = 0; i < 3; i++) {
      let angle = random(TWO_PI);
      let vel = createVector(cos(angle), sin(angle), 0).mult(random(1, 3));
      particles.push(new Particle(this.pos.x, this.pos.y, this.pos.z, vel));
    }
    
    // Remove segments to simulate peeling
    if (this.segments.length > 4) {
      this.segments.splice(floor(random(this.segments.length)), 1);
    }
  }
}

class Particle {
  constructor(x, y, z, velocity) {
    this.pos = createVector(x, y, z);
    this.vel = velocity;
    this.life = 255;
    this.size = random(0.5, 2);
    this.color = color(
      random(200, 255),
      random(100, 200),
      random(50, 100),
      200
    );
  }

  update() {
    this.pos.add(this.vel);
    this.vel.mult(0.95);
    this.life -= 1;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.life);
    sphere(this.size);
    
    pop();
  }

  isDead() {
    return this.life <= 0;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30);
  
  // Create initial arteries
  for (let i = 0; i < 15; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-300, 300);
    arteries.push(new Artery(x, y, z));
  }
}

function draw() {
  background(20, 15, 10);
  
  // Add lighting
  pointLight(200, 180, 160, 0, 0, 300);
  ambientLight(30, 25, 20);
  
  // Camera movement for dynamic view
  let time = millis() * 0.0003;
  camera(
    sin(time) * width/4,
    sin(time*0.7) * height/4,
    cos(time) * 800,
    0, 0, 0,
    0, 1, 0
  );
  
  // Update and display arteries
  for (let i = arteries.length - 1; i >= 0; i--) {
    let artery = arteries[i];
    artery.update();
    artery.display();
    
    // Randomly shed material
    if (random() < 0.005) {
      artery.shed();
    }
  }
  
  // Update and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.display();
    
    if (p.isDead()) {
      particles.splice(i, 1);
    }
  }
  
  // Occasionally add new arteries to simulate continuous construction
  if (random() < 0.01) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-300, 300);
    arteries.push(new Artery(x, y, z));
  }
  
  // Remove old arteries
  if (arteries.length > 25) {
    arteries.shift();
  }
}
