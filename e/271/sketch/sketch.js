let planes = [];
let particles = [];

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create fractured geometric planes
  for (let i = 0; i < 8; i++) {
    planes.push({
      x: random(-200, 200),
      y: random(-200, 200),
      z: random(-300, 300),
      size: random(100, 200),
      rotX: random(TWO_PI),
      rotY: random(TWO_PI),
      rotZ: random(TWO_PI),
      speed: random(0.001, 0.005),
      decay: random(0.99, 0.999),
      color: color(random(180, 240), 50, 70, 0.8)
    });
  }

  // Create particles for mist effect
  for (let i = 0; i < 500; i++) {
    particles.push({
      x: random(-300, 300),
      y: random(-300, 300),
      z: random(-300, 300),
      speed: random(0.1, 0.5),
      size: random(1, 4)
    });
  }
}

function draw() {
  background(0, 0, 10);
  
  // Ambient teal lighting
  ambientLight(180, 60, 80);

  // Rotate the whole scene slowly
  rotateY(frameCount * 0.002);
  rotateX(sin(frameCount * 0.001) * 0.1);

  // Draw and update planes
  for (let i = 0; i < planes.length; i++) {
    let p = planes[i];

    push();
    translate(p.x, p.y, p.z);
    rotateX(p.rotX);
    rotateY(p.rotY);
    rotateZ(p.rotZ);

    // Apply decay to plane
    let size = p.size * p.decay;
    if (size < 5) {
      // Reset plane when it's nearly gone
      planes[i] = {
        x: random(-200, 200),
        y: random(-200, 200),
        z: random(-300, 300),
        size: random(100, 200),
        rotX: random(TWO_PI),
        rotY: random(TWO_PI),
        rotZ: random(TWO_PI),
        speed: random(0.001, 0.005),
        decay: random(0.99, 0.999),
        color: color(random(180, 240), 50, 70, 0.8)
      };
      p = planes[i];
    }

    // Draw plane with transparency
    fill(p.color);
    noStroke();
    plane(size, size);

    pop();

    // Update rotation for next frame
    p.rotX += p.speed;
    p.rotY += p.speed * 0.7;
    p.rotZ += p.speed * 1.3;
  }

  // Draw particles (mist effect)
  noFill();
  stroke(180, 50, 90, 0.2);
  strokeWeight(1);

  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let part = particles[i];
    vertex(part.x, part.y, part.z);
    
    // Update particle position
    part.x += sin(frameCount * 0.01 + i) * part.speed;
    part.y += cos(frameCount * 0.01 + i) * part.speed;
    part.z += sin(frameCount * 0.005 + i) * part.speed;
    
    // Reset particles that leave the scene
    if (abs(part.x) > 400 || abs(part.y) > 400 || abs(part.z) > 400) {
      part.x = random(-300, 300);
      part.y = random(-300, 300);
      part.z = random(-300, 300);
    }
  }
  endShape();
}
