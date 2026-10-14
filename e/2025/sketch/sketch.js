let particles = [];
let container;
let springHeight = 0;
let springVelocity = 0;
let springAcceleration = 0;
let layerHeight = 0;
let layers = [];

function setup() {
  createCanvas(400, 600, WEBGL);
  container = {
    width: width * 0.8,
    height: height * 0.8,
    depth: 200
  };
  
  // Initialize layers
  for (let i = 0; i < 10; i++) {
    layers.push({
      y: height * 0.7 - i * 30,
      color: color(100 + i * 10, 150 + i * 5, 200 + i * 2, 150),
      height: 30
    });
  }
  
  noStroke();
}

function draw() {
  background(10, 15, 60);
  
  // Update spring physics
  springAcceleration = -0.02 * springHeight;
  springVelocity += springAcceleration;
  springHeight += springVelocity;
  
  // Apply spring recoil to layer height
  layerHeight = map(sin(frameCount * 0.03), -1, 1, 0, 5);
  
  // Draw container
  push();
  translate(0, 0, -100);
  fill(30, 40, 100, 80);
  box(container.width, container.height, container.depth);
  pop();
  
  // Draw sedimentary layers
  for (let i = 0; i < layers.length; i++) {
    let layer = layers[i];
    push();
    translate(0, layer.y, 0);
    fill(layer.color);
    plane(container.width * 0.9, layer.height);
    pop();
  }
  
  // Update and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.display();
    
    if (p.isFinished()) {
      particles.splice(i, 1);
    }
  }
  
  // Add new particles periodically
  if (frameCount % 3 === 0 && particles.length < 200) {
    particles.push(new Particle());
  }
}

class Particle {
  constructor() {
    this.x = random(-container.width/2 + 20, container.width/2 - 20);
    this.y = -container.height/2 - 50;
    this.z = random(-container.depth/2 + 20, container.depth/2 - 20);
    this.size = random(1, 4);
    this.speed = random(0.5, 2);
    this.color = color(
      random(200, 255),
      random(200, 255),
      random(250, 255),
      200
    );
    this.angle = random(TWO_PI);
    this.rotationSpeed = random(-0.05, 0.05);
  }
  
  update() {
    // Apply spring recoil effect to vertical movement
    this.y += this.speed + springHeight * 0.1;
    
    // Add some horizontal drift
    this.x += sin(this.angle) * 0.2;
    this.z += cos(this.angle) * 0.2;
    
    // Update rotation
    this.angle += this.rotationSpeed;
    
    // Apply gravity and drag
    this.speed *= 0.98;
  }
  
  display() {
    push();
    translate(this.x, this.y, this.z);
    rotateX(this.angle);
    rotateY(this.angle * 0.5);
    fill(this.color);
    sphere(this.size);
    pop();
  }
  
  isFinished() {
    return this.y > container.height/2;
  }
}
