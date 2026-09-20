let noodles = [];
const noodleCount = 3;
const segmentCount = 8;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  
  for (let i = 0; i < noodleCount; i++) {
    noodles.push(createNoodle());
  }
}

function draw() {
  let hue = (frameCount * 0.2) % 360;
  background(hue, 80, 90, 95);
  
  for (let n of noodles) {
    updateNoodle(n);
    drawNoodle(n);
  }
}

function createNoodle() {
  let points = [];
  for (let i = 0; i < segmentCount; i++) {
    points.push(createVector(
      random(width),
      random(height),
      random(-50, 50)
    ));
  }
  return { points, phase: random(TWO_PI) };
}

function updateNoodle(noodle) {
  noodle.phase += 0.01;
  
  for (let i = 0; i < noodle.points.length; i++) {
    let point = noodle.points[i];
    
    point.x += noise(point.x * 0.001, point.y * 0.001, noodle.phase) * 0.5 - 0.25;
    point.y += noise(point.y * 0.001, point.z * 0.001, noodle.phase + 0.3) * 0.5 - 0.25;
    point.z += noise(point.z * 0.01, point.x * 0.001, noodle.phase + 0.6) * 0.5 - 0.25;
    
    point.x = constrain(point.x, 0, width);
    point.y = constrain(point.y, 0, height);
    point.z = constrain(point.z, -50, 50);
  }
}

function drawNoodle(noodle) {
  noFill();
  stroke(45, 100, 100, 80);
  strokeWeight(3);
  
  beginShape();
  for (let p of noodle.points) {
    curveVertex(p.x, p.y + p.z * 0.1);
  }
  endShape();
  
  stroke(45, 100, 100, 40);
  strokeWeight(6);
  beginShape();
  for (let p of noodle.points) {
    curveVertex(p.x, p.y + p.z * 0.15);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
