let cube;
let splines = [];
let particles = [];
let time = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create central rotating cube
  cube = createGraphics(200, 200);
  cube.colorMode(HSB, 360, 100, 100, 1);
  cube.background(0, 0, 0, 0);
  cube.fill(30, 80, 90);
  cube.stroke(20, 70, 80);
  cube.strokeWeight(2);

  // Create splines
  for (let i = 0; i < 6; i++) {
    let angle = (TWO_PI / 6) * i;
    let x = cos(angle) * 150;
    let y = sin(angle) * 150;
    let z = 0;
    splines.push({ x, y, z, angle });
  }

  // Create particles for glowing effect
  for (let i = 0; i < 200; i++) {
    particles.push({
      x: random(-300, 300),
      y: random(-300, 300),
      z: random(-300, 300),
      size: random(1, 4),
      speed: random(0.001, 0.005)
    });
  }
}

function draw() {
  background(0);
  noStroke();
  time += 0.002;

  // Rotate the entire scene
  rotateY(time * 0.2);
  rotateX(sin(time * 0.3) * 0.1);

  // Draw central cube
  push();
  translate(0, 0, -50);
  rotateZ(time * 0.5);
  rotateX(time * 0.3);
  rotateY(time * 0.2);
  fill(30, 80, 90);
  stroke(20, 70, 80);
  strokeWeight(1);
  box(100);
  pop();

  // Draw orbiting splines
  for (let i = 0; i < splines.length; i++) {
    let s = splines[i];
    let angle = time * 0.3 + s.angle;
    let x = cos(angle) * 200;
    let y = sin(angle) * 200;
    let z = sin(time * 0.5 + i) * 50;

    push();
    translate(x, y, z);
    rotateZ(angle);
    
    // Draw emerald glass spline
    fill(130, 80, 60, 0.7);
    stroke(120, 90, 80);
    strokeWeight(0.5);
    
    beginShape();
    for (let j = 0; j < 50; j++) {
      let a = map(j, 0, 49, 0, TWO_PI * 2);
      let r = 30 + sin(a * 3 + time) * 10;
      let px = cos(a) * r;
      let py = sin(a) * r;
      vertex(px, py, 0);
    }
    endShape(CLOSE);

    // Draw internal energy veins
    stroke(140, 90, 95);
    strokeWeight(1);
    for (let j = 0; j < 30; j++) {
      let a1 = map(j, 0, 29, 0, TWO_PI * 2);
      let a2 = a1 + PI / 4;
      let r1 = 25 + sin(a1 * 2 + time) * 5;
      let r2 = 35 + sin(a2 * 2 + time) * 5;
      let px1 = cos(a1) * r1;
      let py1 = sin(a1) * r1;
      let px2 = cos(a2) * r2;
      let py2 = sin(a2) * r2;
      line(px1, py1, 0, px2, py2, 0);
    }
    pop();
  }

  // Draw glowing particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let x = p.x + sin(p.y * 0.01 + time * p.speed) * 20;
    let y = p.y + cos(p.z * 0.01 + time * p.speed) * 20;
    let z = p.z + sin(p.x * 0.01 + time * p.speed) * 20;

    push();
    translate(x, y, z);
    
    // Bioluminescent glow
    noStroke();
    fill(140, 90, 95, 0.8);
    sphere(p.size);
    pop();
  }

  // Draw crystalline growth structures
  for (let i = 0; i < 50; i++) {
    let angle = time + i * 0.2;
    let r = 100 + sin(time * 0.7 + i) * 30;
    let x = cos(angle) * r;
    let y = sin(angle) * r;
    let z = sin(time * 0.5 + i) * 40;

    push();
    translate(x, y, z);
    
    // Draw crystalline structure
    stroke(120, 80, 90);
    strokeWeight(0.5);
    noFill();
    beginShape();
    for (let j = 0; j < 12; j++) {
      let a = map(j, 0, 11, 0, TWO_PI);
      let r2 = 3 + sin(time * 2 + j) * 2;
      let px = cos(a) * r2;
      let py = sin(a) * r2;
      vertex(px, py, 0);
    }
    endShape(CLOSE);
    
    pop();
  }

  // Draw rotating emerald lattice
  for (let i = 0; i < 15; i++) {
    let angle = time * 0.3 + i * TWO_PI / 15;
    let r = 250;
    let x = cos(angle) * r;
    let y = sin(angle) * r;
    let z = sin(time * 0.5 + i) * 50;

    push();
    translate(x, y, z);
    rotateZ(time * 0.5 + i);
    
    // Draw lattice structure
    stroke(130, 80, 70);
    strokeWeight(1);
    noFill();
    beginShape();
    for (let j = 0; j < 24; j++) {
      let a = map(j, 0, 23, 0, TWO_PI * 2);
      let r2 = 20 + sin(time * 1.5 + a) * 5;
      let px = cos(a) * r2;
      let py = sin(a) * r2;
      vertex(px, py, 0);
    }
    endShape(CLOSE);
    
    pop();
  }

  // Draw central glowing core
  push();
  translate(0, 0, -50);
  noStroke();
  fill(140, 90, 95, 0.8);
  sphere(20);
  pop();

  // Draw subtle glow around cube
  for (let i = 0; i < 10; i++) {
    let angle = time * 0.3 + i * TWO_PI / 10;
    let r = 110;
    let x = cos(angle) * r;
    let y = sin(angle) * r;
    
    push();
    translate(x, y, -50);
    noStroke();
    fill(140, 90, 95, 0.2);
    sphere(5);
    pop();
  }
}
