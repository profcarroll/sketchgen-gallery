let blooms = [];
let waterPatch;
let ripples = [];
let isRippling = false;

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
    this.clusterSize = random(3, 7);
    this.clusterOffset = [];
    for (let i = 0; i < this.clusterSize; i++) {
      this.clusterOffset.push({
        x: random(-20, 20),
        y: random(-20, 20)
      });
    }
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
    let wave = sin(time * 0.005 + this.waveOffset) * 0.5;
    this.x += wave * 0.5;
    
    let dx = (windowWidth / 2 - this.x) * 0.02;
    let dy = (windowHeight / 2 - this.y) * 0.02;

    this.vx += dx;
    this.vy += dy;

    this.vx += random(-0.05, 0.05);
    this.vy += random(-0.05, 0.05);

    this.x += this.vx;
    this.y += this.vy;

    this.vx *= 0.98;
    this.vy *= 0.98;

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

    for (let i = 0; i < 5; i++) {
      let layerSize = pulseSize * (1 - i * 0.15);
      ellipse(0, 0, layerSize, layerSize);
    }

    pop();
    
    // Draw cluster blooms
    for (let i = 0; i < this.clusterSize; i++) {
      push();
      translate(this.x + this.clusterOffset[i].x, this.y + this.clusterOffset[i].y);
      
      let pulseSize = this.size * (1 + this.pulse * 0.3) * 0.7;
      fill(this.originalColor);
      noStroke();
      ellipse(0, 0, pulseSize, pulseSize);
      
      pop();
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  waterPatch = {x: windowWidth / 2, y: windowHeight / 2, radius: windowHeight * 0.4};

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

  // Draw water patch with reflective effect
  fill(100, 150, 200, 80);
  noStroke();
  ellipse(waterPatch.x, waterPatch.y, waterPatch.radius * 2, waterPatch.radius * 2);

  // Draw ripples if any
  for (let i = ripples.length - 1; i >= 0; i--) {
    let ripple = ripples[i];
    ripple.radius += ripple.speed;
    ripple.alpha -= 2;
    
    if (ripple.alpha <= 0) {
      ripples.splice(i, 1);
    } else {
      stroke(255, 255, 255, ripple.alpha);
      noFill();
      ellipse(ripple.x, ripple.y, ripple.radius * 2);
    }
  }
}

function mousePressed() {
  // Only start ripples if not already rippling
  if (ripples.length === 0) {
    isRippling = true;
    ripples.push({
      x: windowWidth / 2,
      y: windowHeight / 2,
      radius: 0,
      speed: 3,
      alpha: 150
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
