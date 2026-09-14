function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  background(0, 0, 10);
  
  // Create a continuous curved path
  stroke(20, 80, 50);
  strokeWeight(8);
  noFill();
  
  beginShape();
  for (let i = 0; i <= 200; i++) {
    let angle = map(i, 0, 200, 0, TWO_PI * 3);
    let radius = 300 + sin(angle * 2) * 50;
    let x = radius * cos(angle);
    let y = radius * sin(angle);
    let z = sin(angle * 1.5) * 100;
    vertex(x, y, z);
  }
  endShape(CLOSE);
  
  // Create a sharp interruption in the curve
  push();
  translate(0, 0, -200);
  rotateZ(PI/4);
  stroke(0, 0, 0);
  strokeWeight(15);
  noFill();
  beginShape();
  for (let i = 0; i <= 50; i++) {
    let angle = map(i, 0, 50, 0, TWO_PI * 0.5);
    let radius = 300;
    let x = radius * cos(angle);
    let y = radius * sin(angle);
    let z = 0;
    vertex(x, y, z);
  }
  endShape(CLOSE);
  pop();
}
