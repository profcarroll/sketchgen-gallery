let blooms = [];
let springiness = 0.02;
let waveSpeed = 0.005;
let waveMagnitude = 0.5;

class Bloom {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(20, 60);
    this.color = color(random(180, 255), random(50, 150), random(100, 200), 200);
    this.originalColor = this.color;
    this.vx = 0;
    this.vy = 0;
    this.pulse = 0;
    this.pulseSpeed = random(0.005, 0.02);
    this.pulseDirection = 1;
    this.foliage = [];
    this.initFoliage();
    this.waveOffset = random(TWO_PI);
  }

  initFoliage() {
    for (let i = 0; i < 5; i++) {
      this.foliage.push({
        angle: random(TWO_PI),
        distance: random(20, 40),
        size: random(5, 15)
      });
    }
  }

  update(time) {
    // Gentle wave motion
    let wave = sin(time * waveSpeed + this.waveOffset) * waveMagnitude;
    this.x += wave * 0.5;
    
    // Slow floating motion
    let dx = (windowWidth / 2 - this.x) * springiness;
    let dy = (windowHeight / 2 - this.y) * springiness;

    this.vx += dx;
    this.vy += dy;

    // Add some random motion
    this.vx += random(-0.05, 0.05);
    this.vy += random(-0.05, 0.05);

    // Apply velocity to position
    this.x += this.vx;
    this.y += this.vy;

    // Dampen velocity
    this.vx *= 0.98;
    this.vy *= 0.98;

    // Pulsing effect
    this.pulse += this.pulseSpeed * this.pulseDirection;
    if (this.pulse > 1 || this.pulse < 0) {
      this.pulseDirection *= -1;
    }

    // Boundary check and bounce
    if (this.x < 0 || this.x > windowWidth) {
      this.vx *= -0.8;
      this.x = constrain(this.x, 0, windowWidth);
    }
    if (this.y < 0 || this.y > windowHeight) {
      this.vy *= -0.8;
      this.y = constrain(this.y, 0, windowHeight);
    }
  }

  display() {
    push();
    translate(this.x, this.y);

    // Draw foliage
    for (let f of this.foliage) {
      let fx = cos(f.angle) * f.distance;
      let fy = sin(f.angle) * f.distance;
      fill(30, 120, 30);
      noStroke();
      ellipse(fx, fy, f.size, f.size);
    }

    // Draw bloom with pulsing effect
    let pulseSize = this.size * (1 + this.pulse * 0.3);
    fill(this.originalColor);
    noStroke();

    // Draw multiple layers for organic feel
    for (let i = 0; i < 5; i++) {
      let layerSize = pulseSize * (1 - i * 0.15);
      ellipse(0, 0, layerSize, layerSize);
    }

    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Create initial blooms
  for (let i = 0; i < 300; i++) {
    let x = random(width);
    let y = random(height);
    blooms.push(new Bloom(x, y));
  }
}

function draw() {
  background(240, 245, 250);

  // Update and display all blooms
  for (let bloom of blooms) {
    bloom.update(frameCount);
    bloom.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
