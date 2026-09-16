let marble;
let container;
let gravity;
let isRunning = true;

function setup() {
  createCanvas(600, 600, WEBGL);
  marble = new Marble(0, -200, 0);
  container = new Container();
  gravity = createVector(0, 0.2, 0);
}

function draw() {
  background(30);
  noStroke();

  // Light setup
  ambientLight(60);
  pointLight(255, 255, 255, 0, -300, 0);
  pointLight(255, 255, 255, 300, 0, 0);

  // Draw container
  container.display();

  // Update and display marble
  marble.applyForce(gravity);
  marble.update();
  marble.checkContainer(container);
  marble.display();
}

class Marble {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);
    this.vel = createVector(0, 0, 0);
    this.acc = createVector(0, 0, 0);
    this.radius = 15;
    this.color = color(255, 100, 100);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  checkContainer(container) {
    // Simple container collision detection
    if (this.pos.y > container.baseY - this.radius) {
      this.pos.y = container.baseY - this.radius;
      this.vel.y *= -0.6; // Bounce with damping
      this.vel.x *= 0.95; // Friction
    }
    
    // Check funnel and slope boundaries
    if (this.pos.x > container.maxRadius || this.pos.x < -container.maxRadius) {
      this.vel.x *= -0.7;
    }
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    fill(this.color);
    sphere(this.radius);
    pop();
  }
}

class Container {
  constructor() {
    this.baseY = 200;
    this.maxRadius = 150;
    this.slopeAngle = PI / 4;
    this.halfHeight = 300;
    this.funnelDepth = 100;
    this.basinRadius = 180;
  }

  display() {
    // Funnel
    push();
    translate(0, -this.halfHeight/2, 0);
    rotateX(-PI/2);
    noStroke();
    fill(100, 150, 200);
    cylinder(this.maxRadius, this.funnelDepth, 32, 1);
    pop();

    // Slope
    push();
    translate(0, -this.halfHeight/2 + this.funnelDepth, 0);
    rotateX(-PI/2);
    fill(80, 120, 180);
    cylinder(this.maxRadius * 0.7, this.halfHeight - this.funnelDepth, 32, 1);
    pop();

    // Basin
    push();
    translate(0, this.baseY, 0);
    rotateX(-PI/2);
    fill(60, 100, 150);
    cylinder(this.basinRadius, 20, 32, 1);
    pop();
  }
}
