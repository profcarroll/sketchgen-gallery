let kite;
let windForce;
let mouseFollow;

function setup() {
  createCanvas(windowWidth, windowHeight);
  kite = new Kite(width / 2, height / 2);
  windForce = createVector(0, 0);
  mouseFollow = false;
}

function draw() {
  background(135, 206, 235); // Sky blue background

  // Simulate wind gusts
  windForce.x = sin(frameCount * 0.01) * 0.2;
  windForce.y = cos(frameCount * 0.015) * 0.1;

  if (mouseFollow) {
    kite.follow(mouseX, mouseY);
  }

  kite.applyWind(windForce);
  kite.update();
  kite.display();
}

function mousePressed() {
  // Start following mouse
  mouseFollow = true;
  kite.reset();
}

function mouseReleased() {
  mouseFollow = false;
}

class Kite {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.angle = 0;
    this.angularVelocity = 0;
    this.size = 30;
    this.color = color(random(255), random(255), random(255));
  }

  applyWind(wind) {
    this.acceleration.add(wind);
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
