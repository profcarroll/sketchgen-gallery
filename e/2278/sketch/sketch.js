let shards = [];
let cracks = [];
let tidePhase = 0;
let isRupturing = false;

class Shard {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.size = random(20, 60);
    this.rotationX = random(TWO_PI);
    this.rotationY = random(TWO_PI);
    this.rotationZ = random(TWO_PI);
    this.rotationSpeed = random(0.01, 0.03);
    this.velocity = createVector(random(-1, 1), random(-1, 1), random(-1, 1));
    this.angularVelocity = random(0.005, 0.02);
    this.color = color(10, 10, 10, 200);
    this.shardType = int(random(3)); // 0: angular, 1: jagged, 2: smooth
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.z += this.velocity.z;
    
    this.rotationX += this.rotationSpeed * this.angularVelocity;
    this.rotationY += this.rotationSpeed * this.angularVelocity;
    this.rotationZ += this.rotationSpeed * this.angularVelocity;

    // Apply tide force
    let tideForce = sin(tidePhase) * 0.5;
    this.velocity.add(0, tideForce * 0.1, 0);
    
    // Boundary checks
    if (this.y > height / 2 + 100) {
      this.y = -height / 2 - 100;
      this.x = random(-width/2, width/2);
      this.z = random(-50, 50);
    }
  }

  display() {
    push();
    translate(this.x, this.y, this.z);
    rotateX(this.rotationX);
    rotateY(this.rotationY);
    rotateZ(this.rotationZ);

    noStroke();
    
    // Different shard styles
    if (this.shardType === 0) { // Angular
      fill(30, 30, 30, 200);
      box(this.size, this.size * 0.5, this.size * 0.7);
    } else if (this.shardType === 1) { // Jagged
      fill(15, 15, 15, 200);
      beginShape();
      for (let i = 0; i < 8; i++) {
        let angle = map(i, 0, 8, 0, TWO_PI);
        let radius = this.size * (0.7 + noise(this.x * 0.01, this.y * 0.01, frameCount * 0.01) * 0.3);
        vertex(cos(angle) * radius, sin(angle) * radius, 0);
      }
      endShape(CLOSE);
    } else { // Smooth
      fill(25, 25, 25, 200);
      sphere(this.size, 6, 4);
    }
    
    pop();
  }
}

class Crack {
  constructor() {
    this.segments = [];
    this.length = random(100, 300);
    this.x = random(-width/2, width/2);
    this.y = random(-height/2, height/2);
    this.z = random(-50, 50);
    this.growth = 0;
    this.maxGrowth = random(100, 300);
    this.angle = random(TWO_PI);
    
    // Create segments
    for (let i = 0; i < this.length; i++) {
      let segment = {
        x: this.x + cos(this.angle) * i,
        y: this.y + sin(this.angle) * i,
        z: this.z + random(-10, 10),
        width: random(2, 8)
      };
      this.segments.push(segment);
    }
  }

  update() {
    if (this.growth < this.maxGrowth) {
      this.growth += 1;
    }
    
    // Animate crack
    for (let i = 0; i < this.segments.length; i++) {
      let segment = this.segments[i];
      segment.z += sin(frameCount * 0.05 + i * 0.1) * 0.5;
    }
  }

  display() {
    push();
    stroke(255, 255, 255, 150);
    strokeWeight(2);
    noFill();
    
    beginShape();
    for (let i = 0; i < min(this.growth, this.segments.length); i++) {
      let segment = this.segments[i];
      vertex(segment.x, segment.y, segment.z);
    }
    endShape();
    pop();
  }
}

function setup() {
  createCanvas(800, 600, WEBGL);
  
  // Create shards
  for (let i = 0; i < 30; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-100, -50);
    shards.push(new Shard(x, y, z));
  }
  
  // Create initial cracks
  for (let i = 0; i < 8; i++) {
    cracks.push(new Crack());
  }
  
  frameRate(30);
}

function draw() {
  background(10, 10, 15);
  
  // Update tide phase
  tidePhase += 0.02;
  
  // Create lighting
  pointLight(255, 255, 255, -width/2, -height/2, 200);
  pointLight(200, 200, 200, width/2, height/2, -200);
  
  // Draw shards
  for (let shard of shards) {
    shard.update();
    shard.display();
  }
  
  // Draw cracks
  for (let crack of cracks) {
    crack.update();
    crack.display();
  }
  
  // Add ambient lighting
  ambientLight(30, 30, 30);
}

function mousePressed() {
  if (!isRupturing) {
    isRupturing = true;
    
    // Create a new crack at click position
    let newCrack = new Crack();
    cracks.push(newCrack);
    
    // Add force to nearby shards
    for (let shard of shards) {
      let d = dist(mouseX - width/2, mouseY - height/2, shard.x, shard.y);
      if (d < 150) {
        let force = p5.Vector.sub(createVector(shard.x, shard.y), createVector(mouseX - width/2, mouseY - height/2));
        force.normalize();
        force.mult(2);
        shard.velocity.add(force);
      }
    }
    
    setTimeout(() => { isRupturing = false; }, 1000);
  }
}
