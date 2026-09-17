let sandPoints = [];
let shells = [];
let layers = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create sand mound
  for (let i = 0; i < 2000; i++) {
    let x = random(-width/3, width/3);
    let y = random(-height/4, height/4);
    let z = random(-50, 50);
    let r = random(2, 8);
    sandPoints.push({x, y, z, r});
  }

  // Create shells
  for (let i = 0; i < 300; i++) {
    let x = random(-width/3, width/3);
    let y = random(-height/4, height/4);
    let z = random(-50, 50);
    let size = random(1, 4);
    shells.push({x, y, z, size});
  }

  // Create geological layers
  for (let i = 0; i < 10; i++) {
    let h = map(i, 0, 9, -50, 50);
    layers.push(h);
  }
}

function draw() {
  background(220, 10, 95);

  // Camera movement
  rotateX(0.01);
  rotateY(0.02);

  // Draw geological layers
  stroke(100, 30, 70);
  noFill();
  for (let h of layers) {
    push();
    translate(0, 0, h);
    sphere(200, 8, 4);
    pop();
  }

  // Draw sand mound
  noStroke();
  fill(60, 20, 90);
  beginShape(POINTS);
  for (let p of sandPoints) {
    vertex(p.x, p.y, p.z);
  }
  endShape();

  // Draw shells
  fill(30, 10, 95);
  noStroke();
  for (let s of shells) {
    push();
    translate(s.x, s.y, s.z);
    sphere(s.size);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
