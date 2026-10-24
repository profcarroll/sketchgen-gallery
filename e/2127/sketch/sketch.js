let fragments = [];
let sedimentationTimer = 0;
let maxFragments = 500;
let particleSize = 2;

class Sediment {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);
    this.vel = createVector(0, 0, 0);
    this.acc = createVector(0, 0, 0);
    this.size = random(1, 4);
    this.color = color(random(180, 220), random(50, 80), random(70, 90), 150);
    this.rotation = random(TWO_PI);
    this.rotationSpeed = random(-0.01, 0.01);
    this.life = 1;
    this.targetZ = z;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    this.rotation += this.rotationSpeed;
    
    // Slowly fade out particles
    this.life -= 0.001;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    rotateZ(this.rotation);
    
    fill(this.color);
    noStroke();
    ellipse(0, 0, this.size, this.size);
    
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize with some base fragments
  for (let i = 0; i < 50; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-100, -50);
    fragments.push(new Sediment(x, y, z));
  }
}

function draw() {
  background(0, 0, 10, 20);
  
  // Slow camera movement for atmospheric effect
  let time = millis() / 5000;
  camera(0, 0, (height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0);
  rotateY(time * 0.05);
  
  // Add new fragments over time to simulate sedimentation
  sedimentationTimer++;
  if (sedimentationTimer > 20 && fragments.length < maxFragments) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = -200;
    fragments.push(new Sediment(x, y, z));
    sedimentationTimer = 0;
  }
  
  // Apply physics to each fragment
  for (let i = fragments.length - 1; i >= 0; i--) {
    let f = fragments[i];
    
    // Gravity
    f.applyForce(createVector(0, 0.05, 0));
    
    // Slow horizontal drift
    f.applyForce(createVector(random(-0.01, 0.01), 0, random(-0.01, 0.01)));
    
    // Apply forces
    f.update();
    
    // Draw fragment
    f.display();
    
    // Remove dead fragments
    if (f.life <= 0) {
      fragments.splice(i, 1);
    }
  }
  
  // Draw sediment layers in background
  drawSedimentLayers();
}

function drawSedimentLayers() {
  // Draw several translucent layers to simulate depth and sedimentation
  for (let i = 0; i < 5; i++) {
    let z = -150 - i * 30;
    let alpha = map(i, 0, 4, 20, 5);
    
    push();
    translate(0, 0, z);
    fill(180, 30, 80, alpha);
    noStroke();
    plane(width, height);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
