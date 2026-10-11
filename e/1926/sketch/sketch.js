let pendulum;
let crystals = [];
let waterSurface;
let particles = [];

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize pendulum
  pendulum = {
    angle: PI / 4,
    length: 200,
    pivotX: 0,
    pivotY: -150,
    velocity: 0,
    acceleration: 0,
    hue: 280
  };

  // Create crystals
  for (let i = 0; i < 20; i++) {
    crystals.push({
      x: random(-300, 300),
      y: random(-200, -50),
      z: random(-100, 100),
      size: random(5, 20),
      hue: random(180, 240),
      saturation: random(60, 90),
      brightness: random(70, 90),
      rotationX: random(TWO_PI),
      rotationY: random(TWO_PI),
      rotationZ: random(TWO_PI),
      spinSpeed: random(0.01, 0.03)
    });
  }

  // Water surface particles
  for (let i = 0; i < 500; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: height/2 - 20,
      z: random(-100, 100),
      size: random(0.5, 3),
      speed: random(0.1, 0.5),
      offset: random(TWO_PI)
    });
  }

  waterSurface = new WaterSurface();
}

function draw() {
  background(220, 10, 10); // Deep blue-black

  // Update pendulum
  pendulum.acceleration = -0.001 * sin(pendulum.angle);
  pendulum.velocity += pendulum.acceleration;
  pendulum.angle += pendulum.velocity;

  // Apply pendulum effect to crystals
  for (let crystal of crystals) {
    let dx = crystal.x - pendulum.pivotX;
    let dy = crystal.y - pendulum.pivotY;
    let distance = sqrt(dx * dx + dy * dy);
    
    if (distance < pendulum.length) {
      let angle = atan2(dy, dx);
      let targetAngle = pendulum.angle + angle;
      
      crystal.x += sin(targetAngle) * 0.5;
      crystal.y += cos(targetAngle) * 0.5;
      
      // Pulsing effect
      crystal.brightness = 70 + 20 * sin(frameCount * 0.1 + distance * 0.02);
    }
  }

  // Draw pendulum
  push();
  translate(pendulum.pivotX, pendulum.pivotY);
  rotateZ(pendulum.angle);
  
  stroke(pendulum.hue, 80, 90);
  strokeWeight(3);
  line(0, 0, 0, pendulum.length, 0, 0);
  
  // Pendulum bob
  fill(pendulum.hue, 60, 70);
  noStroke();
  sphere(15);
  pop();

  // Draw crystals
  for (let crystal of crystals) {
    push();
    translate(crystal.x, crystal.y, crystal.z);
    
    rotateX(crystal.rotationX);
    rotateY(crystal.rotationY);
    rotateZ(crystal.rotationZ);
    
    crystal.rotationX += crystal.spinSpeed;
    crystal.rotationY += crystal.spinSpeed * 0.7;
    crystal.rotationZ += crystal.spinSpeed * 1.3;
    
    // Crystal structure
    fill(crystal.hue, crystal.saturation, crystal.brightness);
    noStroke();
    
    // Nested geometric forms
    for (let i = 0; i < 5; i++) {
      push();
      scale(1 - i * 0.2);
      sphere(crystal.size * (1 - i * 0.1), 8, 6);
      pop();
    }
    
    pop();
  }

  // Draw water surface
  waterSurface.update();
  waterSurface.display();
}

class WaterSurface {
  constructor() {
    this.points = [];
    for (let x = -width/2; x < width/2; x += 10) {
      this.points.push({
        x: x,
        y: height/2 - 20,
        z: random(-50, 50),
        baseY: height/2 - 20
      });
    }
  }

  update() {
    for (let point of this.points) {
      point.y = point.baseY + sin(frameCount * 0.02 + point.x * 0.01) * 5;
    }
  }

  display() {
    noFill();
    stroke(200, 30, 80, 0.7);
    strokeWeight(1);
    
    beginShape();
    for (let point of this.points) {
      vertex(point.x, point.y, point.z);
    }
    endShape();
  }
}
