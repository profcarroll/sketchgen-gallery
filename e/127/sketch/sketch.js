let marble;
let funnel;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  marble = new Marble(0, -50, 0);
  funnel = new Funnel();
}

function draw() {
  background(0);
  orbitControl();
  
  // Light setup
  ambientLight(60);
  pointLight(255, 255, 255, 100, 100, 100);
  
  funnel.display();
  marble.update();
  marble.display();
}

class Marble {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);
    this.vel = createVector(0, 0, 0);
    this.acc = createVector(0, 0, 0);
    this.radius = 10;
    this.gravity = 0.2;
    this.friction = 0.98;
  }
  
  update() {
    // Apply gravity
    this.acc.y += this.gravity;
    
    // Update velocity and position
    this.vel.add(this.acc);
    this.vel.mult(this.friction);
    this.pos.add(this.vel);
    
    // Reset acceleration
    this.acc.mult(0);
    
    // Check collision with funnel walls
    let normal = funnel.getNormalAt(this.pos);
    if (normal) {
      // Move marble to surface
      let distance = this.radius;
      let surfacePos = createVector(
        this.pos.x + normal.x * distance,
        this.pos.y + normal.y * distance,
        this.pos.z + normal.z * distance
      );
      
      // Reflect velocity off surface
      let dot = this.vel.dot(normal);
      this.vel.sub(normal.copy().mult(2 * dot));
      
      // Move to surface
      this.pos = surfacePos;
    }
  }
  
  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    fill(255, 0, 0);
    sphere(this.radius);
    pop();
  }
}

class Funnel {
  constructor() {
    this.radius = 100;
    this.height = 200;
    this.slices = 32;
    this.stacks = 16;
  }
  
  display() {
    push();
    noStroke();
    fill(100, 100, 200, 150);
    
    // Draw funnel surface
    for (let i = 0; i < this.stacks; i++) {
      let y1 = map(i, 0, this.stacks - 1, 0, this.height);
      let r1 = map(y1, 0, this.height, this.radius, 0);
      
      let y2 = map(i + 1, 0, this.stacks - 1, 0, this.height);
      let r2 = map(y2, 0, this.height, this.radius, 0);
      
      beginShape(QUAD_STRIP);
      for (let j = 0; j <= this.slices; j++) {
        let angle = map(j, 0, this.slices, 0, TWO_PI);
        
        let x1 = r1 * cos(angle);
        let z1 = r1 * sin(angle);
        
        let x2 = r2 * cos(angle);
        let z2 = r2 * sin(angle);
        
        vertex(x1, y1, z1);
        vertex(x2, y2, z2);
      }
      endShape();
    }
    
    pop();
  }
  
  getNormalAt(pos) {
    // Simplified normal calculation for funnel surface
    let x = pos.x;
    let y = pos.y;
    let z = pos.z;
    
    // Calculate distance from center axis
    let distFromCenter = sqrt(x * x + z * z);
    
    // If inside funnel bounds, compute normal
    if (y >= 0 && y <= this.height && distFromCenter <= this.radius) {
      // Normal points toward the center of the funnel
      let nx = -x;
      let nz = -z;
      let ny = 0.5; // Adjust for funnel slope
      
      let length = sqrt(nx * nx + ny * ny + nz * nz);
      if (length > 0) {
        nx /= length;
        ny /= length;
        nz /= length;
        return createVector(nx, ny, nz);
      }
    }
    
    return null;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
