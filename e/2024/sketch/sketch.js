/**
 * Industrial Decay
 * A vast, desolate landscape of rusted steel floors, skeletal piping,
 * and dripping oxidized liquid.
 */

let pipes = [];
let droplets = [];
const PIPE_COUNT = 40;
const DROPLET_COUNT = 150;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Create the industrial floor (a large plane)
  // We'll use a grid of lines to simulate sheet steel texture
  
  // Initialize pipes
  for (let i = 0; i < PIPE_COUNT; i++) {
    pipes.push(new Pipe());
  }
  
  // Initialize droplets
  for (let i = 0; i < DROPLET_COUNT; i++) {
    droplets.push(new Droplet());
  }
}

function draw() {
  background(15, 12, 10); // Dark, gritty atmosphere

  // Lighting: Dim, directional light to highlight metallic edges
  ambientLight(30);
  directionalLight(80, 40, 30, 1, 1, -1); // Warm, rusty light
  pointLight(50, 50, 60, 0, -200, 200);

  // Camera: Slow cinematic pan
  let camX = sin(frameCount * 0.005) * 150;
  let camZ = cos(frameCount * 0.003) * 200;
  camera(camX, -150, camZ, 0, -100, 0, 0, 1, 0);

  // 1. Draw the Floor
  drawFloor();

  // 2. Draw Pipes (Skeletal frameworks)
  for (let p of pipes) {
    p.display();
  }

  // 3. Draw Droplets (Rhythmic decay)
  // Batching droplets as points/small spheres to respect budget
  drawDroplets();
}

function drawFloor() {
  push();
  rotateX(HALF_PI);
  translate(0, 0, -500);
  
  // Base plane for the floor
  noStroke();
  fill(40, 30, 25);
  plane(3000, 3000);

  // Grid lines for "sheet steel" texture
  stroke(60, 40, 30, 150);
  strokeWeight(1);
  for (let i = -1500; i <= 1500; i += 100) {
    line(i, -1500, i, 1500);
    line(-1500, i, 1500, i);
  }
  pop();
}

class Pipe {
  constructor() {
    this.reset();
    // Distribute across the expanse
    this.x = random(-1200, 1200);
    this.y = random(-200, -50);
    this.z = random(-1200, 600);
    this.length = random(400, 1000);
    this.r = random(5, 15);
    this.angle = random(TWO_PI);
    this.dir = createVector(random(-1, 1), random(-1, 1), random(-1, 1)).normalize();
  }

  reset() {
    this.rot = random(TWO_PI);
    this.rotVel = random(-0.01, 0.01);
  }

  display() {
    push();
    translate(this.x, this.y, this.z);
    rotateY(this.rot);
    rotateZ(this.angle);
    
    // Metallic/Rusted color
    stroke(70, 40, 30);
    strokeWeight(this.r);
    
    // A long line to represent the pipe segment
    // Using a cylinder-like line segment
    line(0, 0, 0, this.length, 0, 0);
    
    // Add some "joints" or skeletal connectors
    noStroke();
    fill(50, 30, 20);
    cylinder(this.r * 1.5, 10);
    
    pop();
    this.rot += this.rotVel;
  }
}

class Droplet {
  constructor() {
    this.reset();
  }

  reset() {
    // Pick a random pipe-ish area
    const p = pipes[floor(random(pipes.length))];
    this.startX = p.x;
    this.startY = p.y;
    this.startZ = p.z;
    
    this.x = this.startX;
    this.y = this.startY;
    this.z = this.startZ;
    
    this.speed = random(2, 5);
    this.life = 0;
    this.maxLife = random(60, 180);
    this.size = random(2, 4);
  }

  update() {
    this.y += this.speed;
    this.life++;
    
    // If it "hits" the floor or reaches max life
    if (this.y > 0 || this.life > this.maxLife) {
      this.reset();
    }
  }
}

function drawDroplets() {
  // Updating droplets
  for (let d of droplets) {
    d.update();
  }

  // Batch drawing droplets as small spheres/points
  // To stay within budget, we use a single loop and small geometry
  push();
  noStroke();
  fill(40, 60, 80, 180); // Dark, oily liquid color
  for (let d of droplets) {
    push();
    translate(d.x, d.y, d.z);
    sphere(d.size, 4, 4); // Low detail spheres
    pop();
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  try {
    if (typeof userStartAudio === 'function') {
      userStartAudio();
    }
  } catch (e) {}
}
