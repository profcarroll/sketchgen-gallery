let pyramids = [];
let sediments = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create pyramids
  for (let i = 0; i < 8; i++) {
    pyramids.push({
      x: random(-width/2, width/2),
      y: height/2,
      z: random(-300, -1000),
      size: random(50, 150),
      rot: random(TWO_PI),
      color: color(random(200, 260), 80, 90, 0.7)
    });
  }

  // Create sediments
  for (let i = 0; i < 2000; i++) {
    sediments.push({
      x: random(-width/2, width/2),
      y: height/2,
      z: random(-1000, -100),
      size: random(0.5, 3),
      speed: random(0.1, 0.5),
      offset: random(TWO_PI)
    });
  }
}

function draw() {
  background(200, 10, 10); // Deep blue ocean
  time += 0.01;

  // Camera movement for immersive effect
  let cx = sin(time * 0.1) * 200;
  let cy = cos(time * 0.1) * 100;
  camera(0, 0, height/2 + 500, cx, cy, 0, 0, 1, 0);

  // Draw pyramids
  for (let p of pyramids) {
    push();
    translate(p.x, p.y, p.z);
    rotateY(p.rot + time * 0.2);
    rotateX(sin(time + p.x * 0.001) * 0.1);

    fill(p.color);
    noStroke();

    // Draw pyramid with multiple faces
    beginShape();
    vertex(0, -p.size/2, 0);
    vertex(-p.size/2, p.size/2, -p.size/2);
    vertex(p.size/2, p.size/2, -p.size/2);
    endShape(CLOSE);

    beginShape();
    vertex(0, -p.size/2, 0);
    vertex(p.size/2, p.size/2, -p.size/2);
    vertex(p.size/2, p.size/2, p.size/2);
    endShape(CLOSE);

    beginShape();
    vertex(0, -p.size/2, 0);
    vertex(p.size/2, p.size/2, p.size/2);
    vertex(-p.size/2, p.size/2, p.size/2);
    endShape(CLOSE);

    beginShape();
    vertex(0, -p.size/2, 0);
    vertex(-p.size/2, p.size/2, p.size/2);
    vertex(-p.size/2, p.size/2, -p.size/2);
    endShape(CLOSE);

    pop();
  }

  // Draw sediments
  noFill();
  stroke(180, 30, 90, 0.5);
  strokeWeight(1);

  beginShape(POINTS);
  for (let s of sediments) {
    let wave = sin(time * s.speed + s.offset) * 2;
    let x = s.x + wave;
    let y = s.y + sin(time * 0.2 + s.offset) * 3;
    let z = s.z + cos(time * 0.1 + s.offset) * 2;

    vertex(x, y, z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
