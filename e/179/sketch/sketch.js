let marble;
let channel;
let ramp;
let camera;

function setup() {
  createCanvas(600, 600, WEBGL);
  marble = new Marble();
  channel = new Channel();
  ramp = new Ramp();
  camera = createCamera();
}

function draw() {
  background(20);
  
  // Camera follows the marble with a slight offset
  const camX = marble.position.x * 0.5;
  const camY = marble.position.y * 0.5 - 100;
  const camZ = marble.position.z * 0.5 + 300;
  camera.setPosition(camX, camY, camZ);
  camera.lookAt(marble.position.x, marble.position.y, marble.position.z);
  
  // Draw channel and ramp
  channel.display();
  ramp.display();
  
  // Update and display marble
  marble.update();
  marble.display();
}

class Marble {
  constructor() {
    this.radius = 10;
    this.position = createVector(0, -200, 0);
    this.velocity = createVector(0, 0, 0);
    this.acceleration = createVector(0, 0.2, 0);
    this.color = [200, 200, 255];
  }
  
  update() {
    // Apply gravity
    this.velocity.add(this.acceleration);
    
    // Update position
    this.position.add(this.velocity);
    
    // Simple collision with channel walls (cone shape)
    const distFromCenter = dist(this.position.x, this.position.z, 0, 0);
    const maxRadius = 150 - this.radius;
    
    if (distFromCenter > maxRadius) {
      // Reflect velocity
      const normal = createVector(this.position.x, 0, this.position.z).normalize();
      const dot = this.velocity.dot(normal);
      this.velocity.sub(normal.mult(2 * dot));
      
      // Push back inside
      const scale = maxRadius / distFromCenter;
      this.position.x *= scale;
      this.position.z *= scale;
    }
    
    // Check if marble hits the ramp
    if (this.position.y > 150) {
      this.velocity.y = -this.velocity.y * 0.7; // bounce
      this.velocity.x *= 0.9;
      this.velocity.z *= 0.9;
    }
  }
  
  display() {
    push();
    translate(this.position.x, this.position.y, this.position.z);
    noStroke();
    fill(this.color);
    sphere(this.radius);
    pop();
  }
}

class Channel {
  constructor() {
    this.height = 300;
    this.baseRadius = 150;
    this.topRadius = 80;
    this.segments = 32;
  }
  
  display() {
    push();
    stroke(200);
    noFill();
    
    beginShape();
    for (let i = 0; i < this.segments; i++) {
      const angle = map(i, 0, this.segments, 0, TWO_PI);
      const x = cos(angle) * this.baseRadius;
      const z = sin(angle) * this.baseRadius;
      vertex(x, -this.height/2, z);
    }
    endShape(CLOSE);
    
    beginShape();
    for (let i = 0; i < this.segments; i++) {
      const angle = map(i, 0, this.segments, 0, TWO_PI);
      const x = cos(angle) * this.topRadius;
      const z = sin(angle) * this.topRadius;
      vertex(x, this.height/2, z);
    }
    endShape(CLOSE);
    
    // Connect the sides
    for (let i = 0; i < this.segments; i++) {
      const angle = map(i, 0, this.segments, 0, TWO_PI);
      const x1 = cos(angle) * this.baseRadius;
      const z1 = sin(angle) * this.baseRadius;
      const x2 = cos(angle) * this.topRadius;
      const z2 = sin(angle) * this.topRadius;
      
      line(x1, -this.height/2, z1, x2, this.height/2, z2);
    }
    
    pop();
  }
}

class Ramp {
  constructor() {
    this.width = 300;
    this.length = 200;
    this.height = 150;
  }
  
  display() {
    push();
    stroke(150);
    fill(100, 120, 140);
    
    // Draw the ramp surface
    beginShape();
    vertex(-this.width/2, this.height, -this.length/2);
    vertex(this.width/2, this.height, -this.length/2);
    vertex(this.width/2, 0, this.length/2);
    vertex(-this.width/2, 0, this.length/2);
    endShape(CLOSE);
    
    // Draw the ramp sides
    beginShape();
    vertex(-this.width/2, 0, this.length/2);
    vertex(this.width/2, 0, this.length/2);
    vertex(this.width/2, this.height, -this.length/2);
    vertex(-this.width/2, this.height, -this.length/2);
    endShape(CLOSE);
    
    pop();
  }
}
