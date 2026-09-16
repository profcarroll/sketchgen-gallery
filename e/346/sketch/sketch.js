let planes = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create initial planes with random positions and rotations
  for (let i = 0; i < 8; i++) {
    planes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      size: random(100, 300),
      rotX: random(TWO_PI),
      rotY: random(TWO_PI),
      rotZ: random(TWO_PI),
      speed: random(0.002, 0.005),
      hue: random(180, 240)
    });
  }
}

function draw() {
  background(0);
  noStroke();

  // Move camera around
  let camX = sin(time * 0.1) * 500;
  let camY = cos(time * 0.07) * 300;
  let camZ = sin(time * 0.05) * 400;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Draw each plane
  for (let i = 0; i < planes.length; i++) {
    let p = planes[i];
    
    push();
    translate(p.x, p.y, p.z);
    rotateX(p.rotX + time * p.speed);
    rotateY(p.rotY + time * p.speed * 1.3);
    rotateZ(p.rotZ + time * p.speed * 0.7);

    // Create a deformed grid of quads to simulate stress
    let segments = 8;
    let size = p.size;

    for (let x = 0; x < segments; x++) {
      for (let y = 0; y < segments; y++) {
        let px = map(x, 0, segments - 1, -size/2, size/2);
        let py = map(y, 0, segments - 1, -size/2, size/2);

        // Apply stress distortion
        let distortion = sin(time * 0.01 + x * 0.5) * cos(time * 0.01 + y * 0.5) * 20;
        let dx = px + distortion * 0.5;
        let dy = py + distortion;

        // Draw a quad with color based on position and hue
        fill(p.hue, 30, 60, 0.7);
        beginShape();
        vertex(dx - 10, dy - 10);
        vertex(dx + 10, dy - 10);
        vertex(dx + 10, dy + 10);
        vertex(dx - 10, dy + 10);
        endShape(CLOSE);

        // Add some sheared shards
        if (random() < 0.2) {
          fill(p.hue + 10, 40, 70, 0.8);
          beginShape();
          vertex(dx - 5, dy - 5);
          vertex(dx + 15, dy - 15);
          vertex(dx + 5, dy + 5);
          endShape(CLOSE);
        }
      }
    }

    pop();
  }

  time++;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
