let cubeRotation = 0;
let glassTracery = [];
let copperSplines = [];
let energyVeins = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create glass tracery components
  for (let i = 0; i < 8; i++) {
    glassTracery.push({
      angle: random(TWO_PI),
      radius: random(100, 200),
      size: random(5, 15),
      speed: random(0.001, 0.003)
    });
  }

  // Create copper splines
  for (let i = 0; i < 12; i++) {
    copperSplines.push({
      angle: random(TWO_PI),
      radius: random(80, 150),
      speed: random(0.002, 0.005)
    });
  }

  // Create energy veins
  for (let i = 0; i < 50; i++) {
    energyVeins.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(1, 3),
      speed: random(0.01, 0.03),
      hue: random(180, 240)
    });
  }
}

function draw() {
  background(0);
  noStroke();

  // Center the scene
  translate(0, 0, -300);

  // Rotate the entire sculpture
  cubeRotation += 0.005;
  rotateY(cubeRotation);

  // Draw central rotating cube
  push();
  rotateX(cubeRotation * 0.7);
  rotateZ(cubeRotation * 0.3);
  fill(0, 0, 20, 0.8);
  stroke(0, 0, 100, 0.9);
  strokeWeight(1);
  box(100);
  pop();

  // Draw glass tracery
  for (let i = 0; i < glassTracery.length; i++) {
    let t = glassTracery[i];
    let x = cos(t.angle) * t.radius;
    let y = sin(t.angle) * t.radius;
    let z = sin(t.angle * 2 + millis() * t.speed) * 30;

    push();
    translate(x, y, z);
    rotateY(millis() * t.speed * 0.5);
    fill(120, 80, 90, 0.7);
    stroke(120, 80, 100, 0.8);
    strokeWeight(0.5);
    sphere(t.size);
    pop();
  }

  // Draw copper splines
  for (let i = 0; i < copperSplines.length; i++) {
    let s = copperSplines[i];
    let x = cos(s.angle) * s.radius;
    let y = sin(s.angle) * s.radius;

    push();
    translate(x, y, 0);
    rotateY(millis() * s.speed);
    fill(30, 50, 60, 0.7);
    stroke(30, 60, 80, 0.8);
    strokeWeight(1);
    sphere(5);
    pop();
  }

  // Draw energy veins
  for (let i = 0; i < energyVeins.length; i++) {
    let v = energyVeins[i];
    let pulse = sin(millis() * v.speed) * 0.5 + 0.5;
    
    push();
    translate(v.x, v.y, v.z);
    noStroke();
    fill(v.hue, 100, 100, pulse * 0.8);
    sphere(v.size * pulse);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
