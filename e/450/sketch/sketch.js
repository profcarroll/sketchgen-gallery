let particles = [];
let structures = [];

function setup() {
  createCanvas(400, 400, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create particles
  for (let i = 0; i < 500; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-200, 200),
      size: random(1, 3),
      speed: random(0.1, 0.5)
    });
  }
  
  // Create structures
  for (let i = 0; i < 10; i++) {
    structures.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      size: random(20, 60),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.01, 0.01)
    });
  }
}

function draw() {
  background(0, 0, 10, 0.95);
  
  // Camera movement
  let time = millis() * 0.0002;
  camera(
    sin(time) * 300,
    sin(time * 0.7) * 100,
    cos(time) * 300 + 200,
    0, 0, 0,
    0, 1, 0
  );
  
  // Draw particles
  noStroke();
  fill(180, 50, 70, 0.6);
  beginShape(POINTS);
  for (let p of particles) {
    vertex(p.x, p.y, p.z);
    p.z += p.speed;
    if (p.z > 200) p.z = -200;
  }
  endShape();
  
  // Draw structures
  for (let s of structures) {
    push();
    translate(s.x, s.y, s.z);
    rotateY(s.rotation);
    s.rotation += s.rotationSpeed;
    
    // Draw fractured planes
    stroke(180, 50, 60, 0.7);
    noFill();
    beginShape();
    for (let i = 0; i < 4; i++) {
      let angle = TWO_PI * i / 4;
      let x = cos(angle) * s.size;
      let y = sin(angle) * s.size;
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    
    // Draw stress lines
    stroke(180, 50, 80, 0.3);
    for (let i = 0; i < 4; i++) {
      let angle1 = TWO_PI * i / 4;
      let angle2 = TWO_PI * (i + 1) / 4;
      let x1 = cos(angle1) * s.size;
      let y1 = sin(angle1) * s.size;
      let x2 = cos(angle2) * s.size;
      let y2 = sin(angle2) * s.size;
      line(x1, y1, 0, x2, y2, 0);
    }
    
    pop();
  }
}
