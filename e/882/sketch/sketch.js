let coreCube;
let orbitingGlobes = [];
let energyVeins = [];

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create the central rotating cube
  coreCube = new RotatingCube();
  
  // Create orbiting globes
  for (let i = 0; i < 8; i++) {
    orbitingGlobes.push(new OrbitingGlobe(i));
  }
  
  // Create energy veins
  for (let i = 0; i < 50; i++) {
    energyVeins.push(new EnergyVein());
  }
}

function draw() {
  background(0);
  
  // Rotate the entire scene
  rotateY(frameCount * 0.005);
  
  // Draw the core cube
  coreCube.update();
  coreCube.display();
  
  // Draw orbiting globes
  for (let globe of orbitingGlobes) {
    globe.update();
    globe.display();
  }
  
  // Draw energy veins
  for (let vein of energyVeins) {
    vein.update();
    vein.display();
  }
}

class RotatingCube {
  constructor() {
    this.size = 80;
    this.rotationX = 0;
    this.rotationY = 0;
  }
  
  update() {
    this.rotationX += 0.01;
    this.rotationY += 0.02;
  }
  
  display() {
    push();
    rotateX(this.rotationX);
    rotateY(this.rotationY);
    
    stroke(100, 80, 90);
    strokeWeight(2);
    noFill();
    
    box(this.size);
    pop();
  }
}

class OrbitingGlobe {
  constructor(index) {
    this.index = index;
    this.distance = 200 + random(100);
    this.angle = index * (TWO_PI / 8);
    this.speed = 0.005 + random(0.005);
    this.size = 40 + random(20);
    this.hue = 130 + random(30); // Emerald range
  }
  
  update() {
    this.angle += this.speed;
  }
  
  display() {
    push();
    translate(
      cos(this.angle) * this.distance,
      sin(this.angle) * this.distance,
      0
    );
    
    noStroke();
    fill(this.hue, 70, 80, 0.9);
    
    sphere(this.size);
    pop();
  }
}

class EnergyVein {
  constructor() {
    this.segments = [];
    this.length = 30;
    this.hue = 120 + random(20); // Green range
    this.saturation = 70 + random(20);
    this.brightness = 80 + random(10);
    
    for (let i = 0; i < this.length; i++) {
      let x = random(-50, 50);
      let y = random(-50, 50);
      let z = random(-50, 50);
      this.segments.push({x, y, z});
    }
  }
  
  update() {
    // Slowly shift the vein pattern
    for (let i = 0; i < this.length; i++) {
      this.segments[i].x += random(-1, 1) * 0.1;
      this.segments[i].y += random(-1, 1) * 0.1;
      this.segments[i].z += random(-1, 1) * 0.1;
    }
  }
  
  display() {
    push();
    stroke(this.hue, this.saturation, this.brightness, 0.7);
    strokeWeight(2);
    noFill();
    
    beginShape();
    for (let segment of this.segments) {
      vertex(segment.x, segment.y, segment.z);
    }
    endShape();
    
    pop();
  }
}
