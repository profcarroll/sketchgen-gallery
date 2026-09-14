let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  background(0, 0, 0, 1);
  time += 0.005;

  // Create a dense grid of rotating geometric forms
  for (let i = 0; i < 200; i++) {
    let x = map(i % 20, 0, 20, -width/2, width/2);
    let y = map(floor(i / 20), 0, 10, -height/2, height/2);

    push();
    translate(x, y, sin(time + i * 0.1) * 50);
    rotateZ(time * 0.3 + i * 0.05);
    rotateX(time * 0.2 + i * 0.03);
    rotateY(time * 0.1 + i * 0.07);

    // Draw a complex tessellating shape
    stroke((time * 20 + i * 10) % 360, 80, 90, 0.8);
    noFill();
    beginShape();
    for (let j = 0; j < 12; j++) {
      let angle = TWO_PI / 12 * j;
      let r = 20 + sin(time * 2 + j) * 10;
      let px = r * cos(angle);
      let py = r * sin(angle);
      vertex(px, py, sin(time + j * 0.5) * 10);
    }
    endShape(CLOSE);

    // Add inner distortion
    stroke((time * 20 + i * 10 + 180) % 360, 70, 80, 0.6);
    beginShape();
    for (let j = 0; j < 8; j++) {
      let angle = TWO_PI / 8 * j;
      let r = 8 + sin(time * 3 + j) * 5;
      let px = r * cos(angle);
      let py = r * sin(angle);
      vertex(px, py, cos(time + j * 0.3) * 5);
    }
    endShape(CLOSE);

    pop();
  }

  // Add a central swirling field
  push();
  rotateZ(time * 0.5);
  translate(0, 0, sin(time) * 20);
  stroke(200, 90, 100, 0.7);
  noFill();
  for (let i = 0; i < 100; i++) {
    let r = map(i, 0, 100, 0, 200);
    let angle = time + r * 0.1;
    let x = r * cos(angle);
    let y = r * sin(angle);
    let z = sin(time * 2 + r * 0.05) * 30;
    if (i === 0) beginShape();
    vertex(x, y, z);
  }
  endShape(CLOSE);
  pop();

  // Add subtle line patterns that evolve
  stroke(100, 70, 80, 0.4);
  noFill();
  for (let i = 0; i < 20; i++) {
    let a = time * 0.2 + i * 0.3;
    let r = 50 + sin(time * 0.5 + i) * 30;
    beginShape();
    for (let j = 0; j < 100; j++) {
      let angle = TWO_PI / 100 * j;
      let x = r * cos(angle + a);
      let y = r * sin(angle + a);
      let z = sin(time + angle * 3) * 20;
      vertex(x, y, z);
    }
    endShape(CLOSE);
  }
}
