let x = 0;
let points = [];
let maxDepth = 100;
let wavePhase = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  background(220);
  points.push(createVector(0, height / 2));
}

function draw() {
  background(220);

  wavePhase += 0.05;
  let pulse = sin(wavePhase * 2) * 0.5 + 0.5;
  let intensity = map(pulse, 0, 1, 20, 100);

  let hue = map(intensity, 0, 100, 180, 0);
  stroke(hue, 80, 100);
  noFill();
  beginShape();
  for (let v of points) {
    vertex(v.x, v.y);
  }
  endShape();

  let nextY = height / 2 + (sin(wavePhase * 3) * 30) * pulse;
  x += 2;
  if (x > width) {
    x = 0;
    points = [];
  }
  points.push(createVector(x, nextY));

  if (points.length > maxDepth) {
    points.shift();
  }
}
