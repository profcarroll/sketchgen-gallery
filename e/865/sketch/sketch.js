let planes = [];
let time = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create a grid of intersecting planes
  for (let i = 0; i < 20; i++) {
    let plane = {
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      size: random(100, 300),
      rotX: random(TWO_PI),
      rotY: random(TWO_PI),
      rotZ: random(TWO_PI),
      speed: random(0.005, 0.02)
    };
    planes.push(plane);
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Ambient light
  noStroke();
  fill(0, 0, 0, 0.1);
  sphere(400);

  for (let i = 0; i < planes.length; i++) {
    let p = planes[i];

    // Update rotation
    p.rotX += p.speed;
    p.rotY += p.speed * 0.7;
    p.rotZ += p.speed * 1.3;

    push();
    translate(p.x, p.y, p.z);
    rotateX(p.rotX);
    rotateY(p.rotY);
    rotateZ(p.rotZ);

    // Emerald green glow
    let hue = (time * 20 + i * 20) % 360;
    let brightness = 80 + sin(time + i) * 20;

    fill(hue, 100, brightness, 0.7);
    stroke(hue, 100, 100, 0.9);

    // Draw a plane with warping effect
    beginShape(QUADS);
    for (let j = 0; j < 4; j++) {
      let angle = map(j, 0, 4, 0, TWO_PI);
      let x = cos(angle) * p.size;
      let y = sin(angle) * p.size;
      let z = sin(time + i + angle * 2) * 30;
      vertex(x, y, z);
    }
    endShape(CLOSE);

    pop();
  }

  // Create harmonic interference effect
  for (let i = 0; i < 500; i++) {
    let x = random(width);
    let y = random(height);
    let size = sin(time * 2 + i) * 3 + 5;
    let alpha = map(size, 2, 8, 0.1, 0.8);
    
    fill(160, 100, 90, alpha);
    noStroke();
    ellipse(x, y, size);
  }
}
