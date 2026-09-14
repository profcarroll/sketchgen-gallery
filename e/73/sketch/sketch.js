let lines = [];
let orbs = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create circuit lines
  for (let i = 0; i < 200; i++) {
    lines.push({
      start: createVector(
        random(-width, width),
        random(-height, height),
        random(-200, 200)
      ),
      end: createVector(
        random(-width, width),
        random(-height, height),
        random(-200, 200)
      ),
      hue: random(180, 240),
      alpha: random(0.3, 0.7)
    });
  }

  // Create data orbs
  for (let i = 0; i < 50; i++) {
    orbs.push({
      pos: createVector(
        random(-width, width),
        random(-height, height),
        random(-200, 200)
      ),
      vel: p5.Vector.random3D().mult(random(0.5, 2)),
      hue: random(0, 60),
      size: random(2, 6)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Rotate the entire scene
  rotateY(time * 0.1);
  rotateX(sin(time * 0.5) * 0.1);

  // Draw circuit lines
  for (let line of lines) {
    stroke(line.hue, 80, 90, line.alpha);
    strokeWeight(0.5);
    line3D(line.start, line.end);
  }

  // Update and draw orbs
  for (let orb of orbs) {
    // Move orb
    orb.pos.add(orb.vel);

    // Bounce off bounds
    if (abs(orb.pos.x) > width / 2) orb.vel.x *= -1;
    if (abs(orb.pos.y) > height / 2) orb.vel.y *= -1;
    if (abs(orb.pos.z) > 200) orb.vel.z *= -1;

    // Draw orb
    fill(orb.hue, 100, 100);
    noStroke();
    push();
    translate(orb.pos.x, orb.pos.y, orb.pos.z);
    sphere(orb.size);
    pop();
  }

  // Add subtle pulsing effect to lines
  for (let line of lines) {
    let pulse = sin(time * 2 + line.start.mag() * 0.01) * 0.3 + 0.7;
    stroke(line.hue, 80, 90, line.alpha * pulse);
    strokeWeight(0.5);
    line3D(line.start, line.end);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Helper function to draw 3D line
function line3D(a, b) {
  beginShape();
  vertex(a.x, a.y, a.z);
  vertex(b.x, b.y, b.z);
  endShape();
}
