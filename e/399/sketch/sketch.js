let particles = [];
let structure;
let time = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create a complex geometric structure
  structure = createShape();
  
  // Initialize particles for decay effect
  for (let i = 0; i < 200; i++) {
    particles.push({
      pos: p5.Vector.random3D().mult(200),
      vel: p5.Vector.random3D().mult(0.5),
      size: random(1, 5),
      hue: random(180, 240)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Camera movement
  rotateX(time * 0.1);
  rotateY(time * 0.2);
  translate(0, 0, -300);

  // Draw structure with shearing effect
  push();
  rotateZ(time);
  stroke(180, 80, 80, 0.7);
  noFill();
  beginShape();
  for (let i = 0; i < structure.length; i++) {
    let v = structure[i];
    vertex(v.x, v.y, v.z);
  }
  endShape(CLOSE);
  pop();

  // Draw particles
  for (let p of particles) {
    p.pos.add(p.vel);
    
    // Apply gravitational pull towards center
    let dir = p5.Vector.sub(createVector(0, 0, 0), p.pos);
    dir.normalize();
    dir.mult(0.01);
    p.vel.add(dir);

    // Draw particle
    push();
    translate(p.pos.x, p.pos.y, p.pos.z);
    noStroke();
    fill(p.hue, 80, 90, 0.7);
    sphere(p.size);
    pop();
  }

  // Add some recursive fractal effect to structure
  for (let i = 0; i < 5; i++) {
    push();
    rotateX(time * 0.3 + i * 0.5);
    rotateY(time * 0.2 + i * 0.3);
    scale(1 + sin(time + i) * 0.2);
    stroke(200, 70, 70, 0.4);
    noFill();
    beginShape();
    for (let j = 0; j < structure.length; j++) {
      let v = structure[j];
      vertex(v.x, v.y, v.z);
    }
    endShape(CLOSE);
    pop();
  }
}

function createShape() {
  let shape = [];
  let radius = 150;
  let sides = 8;
  let layers = 3;

  for (let l = 0; l < layers; l++) {
    let layerOffset = l * 30 - 30;
    for (let i = 0; i < sides; i++) {
      let angle = TWO_PI * i / sides + time * 0.1;
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      let z = layerOffset;
      
      // Add some distortion to make it look like stress
      x += sin(time + i) * 20;
      y += cos(time + i) * 20;
      
      shape.push(createVector(x, y, z));
    }
  }
  return shape;
}
