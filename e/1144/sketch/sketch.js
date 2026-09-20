let sculptureRotation = 0;
let cubeRotation = 0;
let fragments = [];
let lines = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize fragments for the emerald glass tracery
  for (let i = 0; i < 200; i++) {
    fragments.push({
      pos: createVector(random(-50, 50), random(-50, 50), random(-50, 50)),
      size: random(2, 8),
      hue: random(120, 140), // emerald green hues
      saturation: random(70, 90),
      brightness: random(60, 90),
      target: createVector(random(-50, 50), random(-50, 50), random(-50, 50)),
      speed: random(0.01, 0.03)
    });
  }

  // Initialize connecting lines
  for (let i = 0; i < 500; i++) {
    lines.push({
      start: createVector(random(-100, 100), random(-100, 100), random(-100, 100)),
      end: createVector(random(-100, 100), random(-100, 100), random(-100, 100)),
      hue: random(200, 240), // blue hues for energy
      alpha: random(0.3, 0.7)
    });
  }
}

function draw() {
  background(0);
  noStroke();

  // Rotate the entire sculpture
  sculptureRotation += 0.002;
  rotateY(sculptureRotation);

  // Draw the rotating central cube with tracery
  cubeRotation += 0.01;
  push();
  rotateX(cubeRotation);
  rotateY(cubeRotation * 0.7);
  rotateZ(cubeRotation * 0.3);

  // Draw the main cube frame
  stroke(40, 50, 80); // muted copper
  strokeWeight(2);
  noFill();
  box(100);

  // Draw emerald glass tracery that fractures and reconnects
  drawTracery();

  pop();

  // Draw orbiting splines of tarnished copper
  drawOrbitingSplines();
}

function drawTracery() {
  // Update and display fragments
  for (let i = 0; i < fragments.length; i++) {
    let f = fragments[i];
    
    // Move fragment towards target
    f.pos.lerp(f.target, f.speed);
    
    // Occasionally reset target
    if (frameCount % 120 === 0) {
      f.target.set(random(-50, 50), random(-50, 50), random(-50, 50));
    }
    
    // Draw fragment
    push();
    translate(f.pos.x, f.pos.y, f.pos.z);
    fill(f.hue, f.saturation, f.brightness, 0.8);
    noStroke();
    sphere(f.size);
    pop();
    
    // Draw energy lines between fragments
    if (i > 0) {
      let prev = fragments[i - 1];
      stroke(200, 100, 100, 0.6); // electric blue
      strokeWeight(0.5);
      line(prev.pos.x, prev.pos.y, prev.pos.z, f.pos.x, f.pos.y, f.pos.z);
    }
  }

  // Draw pulsing energy lines
  for (let i = 0; i < lines.length; i++) {
    let l = lines[i];
    
    stroke(l.hue, 100, 100, l.alpha);
    strokeWeight(1);
    line(l.start.x, l.start.y, l.start.z, l.end.x, l.end.y, l.end.z);
  }
}

function drawOrbitingSplines() {
  // Draw orbiting splines of tarnished copper
  for (let i = 0; i < 6; i++) {
    let angle = (TWO_PI / 6) * i + sculptureRotation;
    let radius = 150;
    let x = cos(angle) * radius;
    let z = sin(angle) * radius;
    
    // Draw spline orbit
    push();
    translate(x, 0, z);
    rotateY(PI/2 - angle);
    stroke(40, 50, 80); // tarnished copper
    strokeWeight(1.5);
    noFill();
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.1) {
      let y = sin(a * 3) * 20;
      vertex(cos(a) * 30, y, sin(a) * 30);
    }
    endShape(CLOSE);
    pop();
  }

  // Draw glowing emerald splines
  for (let i = 0; i < 8; i++) {
    let angle = (TWO_PI / 8) * i + sculptureRotation * 1.2;
    let radius = 200;
    let x = cos(angle) * radius;
    let z = sin(angle) * radius;
    
    push();
    translate(x, 0, z);
    rotateY(PI/2 - angle);
    stroke(130, 80, 60); // emerald green
    strokeWeight(2);
    noFill();
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.1) {
      let y = cos(a * 4) * 15;
      vertex(cos(a) * 30, y, sin(a) * 30);
    }
    endShape(CLOSE);
    pop();
  }
}
