let structures = [];
let time = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  noStroke();
  colorMode(HSB, 360, 100, 100, 1);

  // Create multiple complex structures
  for (let i = 0; i < 5; i++) {
    structures.push({
      x: random(-200, 200),
      y: random(-100, 100),
      z: random(-300, 300),
      size: random(50, 150),
      rotation: random(TWO_PI),
      speed: random(0.005, 0.02),
      color: color(random(20, 40), 60, 80, 0.7)
    });
  }
}

function draw() {
  background(0, 0, 10, 0.1);
  time += 0.01;

  // Camera movement
  let camX = sin(time * 0.2) * 200;
  let camY = cos(time * 0.3) * 100;
  camera(camX, camY, (height / 2.0) / tan(PI * 30.0 / 180.0), 0, 0, 0, 0, 1, 0);

  // Draw each structure
  for (let s of structures) {
    push();
    translate(s.x, s.y, s.z);
    rotateY(s.rotation + time * s.speed);
    rotateX(time * 0.1);
    
    // Create an impossible architecture-like mesh
    let segments = 8;
    let radius = s.size / 2;
    let height = s.size;

    fill(s.color);
    
    for (let i = 0; i < segments; i++) {
      let angle = TWO_PI * i / segments;
      let nextAngle = TWO_PI * (i + 1) / segments;

      let x1 = cos(angle) * radius;
      let y1 = sin(angle) * radius;
      let x2 = cos(nextAngle) * radius;
      let y2 = sin(nextAngle) * radius;

      // Draw a segment of the structure
      beginShape(TRIANGLES);
      vertex(x1, -height/2, 0);
      vertex(x2, -height/2, 0);
      vertex(0, height/2, 0);

      vertex(x1, height/2, 0);
      vertex(x2, height/2, 0);
      vertex(0, -height/2, 0);
      
      endShape();
    }

    // Add some floating planes
    for (let j = 0; j < 4; j++) {
      let planeSize = s.size * (0.5 + sin(time + j) * 0.3);
      let offset = sin(time * 0.5 + j) * 20;
      
      push();
      rotateZ(time * 0.1 + j);
      translate(0, 0, offset);
      fill(s.color);
      rectMode(CENTER);
      rect(0, 0, planeSize, planeSize * 0.2);
      pop();
    }

    pop();
  }
}
