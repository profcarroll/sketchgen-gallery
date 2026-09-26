let kite;
let strings = [];
let stringCount = 30;

function setup() {
  createCanvas(windowWidth, windowHeight);
  kite = new Kite(width / 2, height / 2);
  
  // Initialize strings with random positions around the kite
  for (let i = 0; i < stringCount; i++) {
    let angle = random(TWO_PI);
    let distance = random(50, 150);
    let x = width / 2 + cos(angle) * distance;
    let y = height / 2 + sin(angle) * distance;
    
    strings.push({
      x: x,
      y: y,
      targetX: x,
      targetY: y,
      length: 0,
      angle: 0
    });
  }
}

function draw() {
  background(135, 206, 235); // Sky blue background

  if (mouseIsPressed) {
    kite.follow(mouseX, mouseY);
  }

  kite.update();
  kite.display();
  
  // Update and display strings
  updateStrings();
  displayStrings();
}

function updateStrings() {
  for (let i = 0; i < strings.length; i++) {
    let s = strings[i];
    
    // Move towards target with some easing
    s.x += (s.targetX - s.x) * 0.1;
    s.y += (s.targetY - s.y) * 0.1;
    
    // Update length and angle to kite
    let dx = s.x - kite.position.x;
    let dy = s.y - kite.position.y;
    s.length = sqrt(dx * dx + dy * dy);
    s.angle = atan2(dy, dx);
  }
}

function displayStrings() {
  stroke(255);
  strokeWeight(1);
  
  for (let i = 0; i < strings.length; i++) {
    let s = strings[i];
    
    // Only draw if the string is visible
    if (s.length > 1) {
      line(s.x, s.y, kite.position.x, kite.position.y);
    }
  }
}

class Kite {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.angle = 0;
    this.angularVelocity = 0;
    this.size = 30;
    this.color = color(random(100, 255), random(100, 255), random(100, 255));
  }

  follow(x, y) {
    let target = createVector(x, y);
    let desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(0.5);
    this.acceleration.add(desired);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);

    // Add some rotation for fluttering effect
    this.angularVelocity += random(-0.01, 0.01);
    this.angle += this.angularVelocity;
    this.angularVelocity *= 0.9; // Damping

    // Boundary checks
    if (this.position.x < 0) this.position.x = width;
    if (this.position.x > width) this.position.x = 0;
    if (this.position.y < 0) this.position.y = height;
    if (this.position.y > height) this.position.y = 0;
    
    // Update string targets
    for (let i = 0; i < strings.length; i++) {
      strings[i].targetX = this.position.x + random(-20, 20);
      strings[i].targetY = this.position.y + random(-20, 20);
    }
  }

  display() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.angle);

    // Draw kite body
    fill(this.color);
    noStroke();
    beginShape();
    vertex(0, -this.size);
    vertex(-this.size/2, this.size/2);
    vertex(0, this.size/3);
    vertex(this.size/2, this.size/2);
    endShape(CLOSE);

    // Draw kite string
    stroke(255);
    strokeWeight(1);
    line(0, 0, 0, -this.size * 1.5);

    pop();
  }

  reset() {
    this.velocity.mult(0);
    this.acceleration.mult(0);
    this.angularVelocity = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
