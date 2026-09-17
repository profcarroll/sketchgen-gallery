let shards = [];
let particles = [];
let stressLines = [];

class Shard {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);
    this.size = random(10, 30);
    this.rotation = random(TWO_PI);
    this.rotationSpeed = random(-0.02, 0.02);
    this.color = color(60, 180, 180, 180);
    this.health = 1;
    this.targetHealth = 1;
    this.shatterTime = 0;
  }

  update() {
    this.rotation += this.rotationSpeed;
    if (this.health < this.targetHealth) {
      this.health += 0.002;
    }
    if (this.health > this.targetHealth) {
      this.health -= 0.005;
    }
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    rotateZ(this.rotation);
    rotateX(this.rotation * 0.5);
    
    noStroke();
    fill(this.color);
    if (this.health < 1) {
      const alpha = map(this.health, 0, 1, 0, 180);
      fill(red(this.color), green(this.color), blue(this.color), alpha);
    }
    
    // Draw a crystal-like shape using a tetrahedron
    beginShape(TRIANGLES);
    vertex(0, -this.size, 0);
    vertex(this.size, this.size, 0);
    vertex(-this.size, this.size, 0);

    vertex(0, -this.size, 0);
    vertex(0, this.size, this.size);
    vertex(this.size, this.size, 0);

    vertex(0, -this.size, 0);
    vertex(-this.size, this.size, 0);
    vertex(0, this.size, this.size);

    vertex(0, -this.size, 0);
    vertex(0, this.size, -this.size);
    vertex(-this.size, this.size, 0);

    vertex(0, -this.size, 0);
    vertex(this.size, this.size, 0);
    vertex(0, this.size, -this.size);

    vertex(0, -this.size, 0);
    vertex(0, this.size, this.size);
    vertex(0, this.size, -this.size);
    endShape();
    
    pop();
  }

  shatter() {
    this.targetHealth = 0;
    this.shatterTime = millis();
    
    // Create particle effects
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle(this.pos.x, this.pos.y, this.pos.z));
    }
  }
}

class Particle {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);
    this.vel = p5.Vector.random3D().mult(random(0.5, 2));
    this.life = 255;
    this.size = random(1, 3);
  }

  update() {
    this.pos.add(this.vel);
    this.vel.mult(0.98);
    this.life -= 2;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    fill(100, 200, 200, this.life);
    sphere(this.size);
    pop();
  }

  isDead() {
    return this.life <= 0;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30);

  // Create initial shards
  for (let i = 0; i < 20; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-500, 500);
    shards.push(new Shard(x, y, z));
  }
}

function draw() {
  background(10, 20, 30);
  
  // Add some ambient lighting
  pointLight(150, 200, 200, 0, 0, 0);
  ambientLight(30, 50, 60);

  // Camera movement for dynamic view
  let time = millis() * 0.0005;
  camera(
    sin(time) * width/4,
    sin(time*0.7) * height/4,
    cos(time) * 800,
    0, 0, 0,
    0, 1, 0
  );

  // Update and display shards
  for (let i = shards.length - 1; i >= 0; i--) {
    let shard = shards[i];
    shard.update();
    shard.display();

    // Randomly trigger shattering
    if (random() < 0.0005 && shard.health > 0.5) {
      shard.shatter();
    }
  }

  // Update and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.display();

    if (p.isDead()) {
      particles.splice(i, 1);
    }
  }

  // Occasionally add new shards to simulate continuous construction
  if (random() < 0.02) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-500, 500);
    shards.push(new Shard(x, y, z));
  }

  // Remove old shards
  if (shards.length > 30) {
    shards.shift();
  }
}
