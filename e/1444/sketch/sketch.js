let drones = [];
let isForming = false;
let searchlightAngle = 0;
let grid = [];

class Drone {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);
    this.vel = p5.Vector.random3D().mult(random(0.5, 1.5));
    this.acc = createVector(0, 0, 0);
    this.size = random(3, 6);
    this.color = color(random(100, 255), random(100, 255), 255);
    this.trail = [];
    this.maxTrail = 10;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // Add to trail
    this.trail.push(this.pos.copy());
    if (this.trail.length > this.maxTrail) {
      this.trail.shift();
    }
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    fill(this.color);
    sphere(this.size);

    // Draw trail
    beginShape(POINTS);
    for (let i = 0; i < this.trail.length; i++) {
      let alpha = map(i, 0, this.trail.length, 0, 255);
      fill(red(this.color), green(this.color), blue(this.color), alpha);
      vertex(0, 0, 0);
    }
    endShape();

    pop();
  }

  follow(mouse) {
    let desired = p5.Vector.sub(mouse, this.pos);
    let d = desired.mag();
    if (d < 100) {
      desired.setMag(map(d, 0, 100, 2, 0));
    } else {
      desired.setMag(1);
    }
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(0.2);
    this.applyForce(steer);
  }

  form(target) {
    if (target) {
      let desired = p5.Vector.sub(target, this.pos);
      desired.setMag(1);
      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(0.1);
      this.applyForce(steer);
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create initial drones
  for (let i = 0; i < 20; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-500, 500);
    drones.push(new Drone(x, y, z));
  }

  // Build spatial grid for neighbors
  grid = new Array(20).fill().map(() => new Array(20).fill().map(() => []));
}

function draw() {
  background(0);
  ambientLight(50);

  // Camera movement
  let time = millis() / 1000;
  let camX = sin(time * 0.2) * width/3;
  let camY = cos(time * 0.1) * height/3;
  camera(camX, camY, (height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0);

  // Update searchlight
  searchlightAngle += 0.01;

  // Mouse interaction
  let mouse = createVector(mouseX - width/2, mouseY - height/2, 0);
  
  if (isForming) {
    for (let drone of drones) {
      // Create a simple formation point
      let target = createVector(
        sin(time * 0.5) * 200,
        cos(time * 0.3) * 100,
        sin(time * 0.4) * 100
      );
      drone.form(target);
    }
  } else {
    for (let drone of drones) {
      drone.follow(mouse);
    }
  }

  // Update and display drones
  for (let drone of drones) {
    drone.update();
    drone.display();

    // Draw searchlight beam
    push();
    translate(drone.pos.x, drone.pos.y, drone.pos.z);
    rotateY(searchlightAngle);
    let lightColor = color(255, 255, 255, 100);
    fill(lightColor);
    noStroke();
    // Use a cone with low detail to avoid performance issues
    cone(100, 300, 4, 1); 
    pop();
  }

  // Draw harbor (simple representation)
  push();
  translate(0, height/2 - 50, 0);
  rotateX(PI/2);
  fill(30, 20, 10);
  plane(width * 2, 200);
  pop();

  // Draw cityscape buildings
  for (let i = 0; i < 30; i++) {
    let x = random(-width/2, width/2);
    let z = random(-500, -100);
    let h = random(50, 200);
    let w = random(10, 30);
    let d = random(10, 30);
    
    push();
    translate(x, h/2 - 200, z);
    fill(random(40, 80), random(50, 90), 30);
    box(w, h, d);
    pop();
  }
}

function mousePressed() {
  isForming = !isForming;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
