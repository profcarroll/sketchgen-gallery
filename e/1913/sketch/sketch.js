let beamAngle = 0;
let rotationSpeed = 0.02;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  // Create a dark ocean background that shifts with the beam
  background(200, 20, 10);

  // Draw the lighthouse tower
  drawLighthouse();

  // Update and draw the rotating beam
  beamAngle += rotationSpeed;
  drawBeam();
}

function drawLighthouse() {
  // Tower base (white)
  fill(0, 0, 95);
  noStroke();
  rectMode(CENTER);
  rect(width/2, height/2, 80, 300);

  // Tower top (blue)
  fill(240, 100, 60);
  rect(width/2, height/2 - 150, 60, 60);

  // Light house window
  fill(240, 100, 90);
  rect(width/2, height/2 - 130, 20, 30);

  // Light house light (beam source)
  fill(240, 100, 100);
  ellipse(width/2, height/2 - 170, 20, 20);
}

function drawBeam() {
  // Create a rotating beam using the angle
  push();
  translate(width/2, height/2);
  rotate(beamAngle);

  // Draw the beam as a large triangle with transparency
  noStroke();
  fill(240, 100, 100, 0.2);
  beginShape();
  vertex(0, 0);
  vertex(-300, -100);
  vertex(300, -100);
  endShape(CLOSE);

  // Add a bright inner beam
  fill(240, 100, 100, 0.7);
  beginShape();
  vertex(0, 0);
  vertex(-150, -50);
  vertex(150, -50);
  endShape(CLOSE);

  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
