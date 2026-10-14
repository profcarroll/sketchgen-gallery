let sedimentLayers = [];
let crystals = [];
let particles = [];

class SedimentLayer {
  constructor(img, y) {
    this.img = img;
    this.y = y;
    this.opacity = random(30, 70);
    this.speed = random(0.005, 0.02);
    this.xOffset = random(1000);
    this.scale = random(0.8, 1.2);
  }

  update() {
    this.xOffset += this.speed;
  }

  display() {
    push();
    translate(width/2, this.y);
    scale(this.scale);
    tint(200, 180, 140, this.opacity);
    image(this.img, -this.img.width/2, -this.img.height/2);
    noTint();
    pop();
  }
}

class Crystal {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(2, 8);
    this.growth = random(0.005, 0.02);
    this.grow = false;
    this.opacity = random(30, 60);
    this.shimmer = 0;
    this.shimmerSpeed = random(0.02, 0.05);
  }

  update() {
    if (!this.grow) {
      this.grow = random() < 0.0005; // Lower chance to start growing
    }
    
    if (this.grow) {
      this.size += this.growth;
    }
    
    this.shimmer += this.shimmerSpeed;
  }

  display() {
    push();
    translate(this.x, this.y);
    noStroke();
    fill(255, 255, 255, this.opacity);
    ellipse(0, 0, this.size, this.size);
    
    // Add shimmer effect
    fill(255, 255, 255, sin(this.shimmer) * 30 + 30);
    ellipse(0, 0, this.size * 0.7, this.size * 0.7);
    pop();
  }
}

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = random(-20, -5);
    this.size = random(0.5, 1.5);
    this.speed = random(0.05, 0.3);
    this.opacity = random(10, 30);
    this.wobble = random(TWO_PI);
    this.wobbleSpeed = random(0.01, 0.02);
  }

  update() {
    this.y += this.speed;
    this.x += sin(this.wobble) * 0.1;
    this.wobble += this.wobbleSpeed;
    
    if (this.y > height + 10) {
      this.reset();
    }
  }

  display() {
    push();
    fill(180, 160, 120, this.opacity);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);
    pop();
  }
}

function preload() {
  // Load photographs for sediment layers
  photoImages = [];
  for (let i = 0; i < 3; i++) {
    photoImages.push(loadImage(`https://picsum.photos/seed/sediment${i}/800/600`));
  }
}

function setup() {
  createCanvas(800, 600);
  
  // Create sediment layers
  for (let i = 0; i < 4; i++) {
    let y = height * (i / 3);
    sedimentLayers.push(new SedimentLayer(photoImages[i % photoImages.length], y));
  }
  
  // Create crystals
  for (let i = 0; i < 15; i++) {
    crystals.push(new Crystal());
  }
  
  // Create mineral particles
  for (let i = 0; i < 200; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(245, 240, 230);
  
  // Display sediment layers
  for (let layer of sedimentLayers) {
    layer.update();
    layer.display();
  }
  
  // Update and display crystals
  for (let crystal of crystals) {
    crystal.update();
    crystal.display();
  }
  
  // Update and display particles
  for (let particle of particles) {
    particle.update();
    particle.display();
  }
}
