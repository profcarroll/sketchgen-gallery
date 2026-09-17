let splines = [];
let cube;
let time = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create central rotating cube
  cube = createGraphics(200, 200);
  cube.colorMode(HSB, 360, 100, 100, 1);
  cube.background(0, 0, 0, 0);

  // Generate splines
  for (let i = 0; i < 8; i++) {
    let points = [];
    let numPoints = 50;
    for (let j = 0; j < numPoints; j++) {
      let angle = map(j, 0, numPoints - 1, 0, TWO_PI);
      let radius = 100 + sin(time * 0.5 + angle) * 30;
      points.push({
        x: cos(angle) * radius,
        y: sin(angle) * radius,
        z: sin(time * 0.3 + angle) * 20
      });
    }
    splines.push(points);
  }
}

function draw() {
  background(0, 0, 10);

  // Rotate entire scene
  rotateX(time * 0.05);
  rotateY(time * 0.03);
  rotateZ(time * 0.02);

  // Draw central glowing cube
  push();
  translate(0, 0, 0);
  noStroke();
  fill(30, 80, 90, 0.5);
  box(150);
  pop();

  // Draw molten core inside cube
  push();
  translate(0, 0, 0);
  noStroke();
  fill(10, 100, 100, 0.8);
  sphere(50);
  pop();

  // Draw oxidized copper splines
  for (let i = 0; i < splines.length; i++) {
    let points = splines[i];
    push();
    rotateZ(i * TWO_PI / splines.length);
    stroke(30, 70, 30); // Oxidized copper color
    strokeWeight(2);
    noFill();
    beginShape();
    for (let j = 0; j < points.length; j++) {
      let p = points[j];
      vertex(p.x, p.y, p.z);
    }
    endShape(CLOSE);
    pop();
  }

  // Draw sea glass splines
  for (let i = 0; i < splines.length; i++) {
    let points = splines[i];
    push();
    rotateZ(i * TWO_PI / splines.length + PI/4);
    stroke(160, 50, 70); // Sea glass color
    strokeWeight(1);
    noFill();
    beginShape();
    for (let j = 0; j < points.length; j++) {
      let p = points[j];
      vertex(p.x, p.y, p.z);
    }
    endShape(CLOSE);
    pop();
  }

  time += 0.02;
}
