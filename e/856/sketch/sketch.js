let planes = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize planes with varying properties
  for (let i = 0; i < 5; i++) {
    planes.push({
      x: random(-width, width),
      y: random(-height, height),
      z: random(-200, 200),
      size: random(100, 300),
      angleX: random(TWO_PI),
      angleY: random(TWO_PI),
      speedX: random(-0.005, 0.005),
      speedY: random(-0.005, 0.005),
      speedZ: random(-0.002, 0.002),
      color: color(random(360), 80, 90)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Camera movement for dynamic perspective
  let camX = sin(time * 0.2) * 500;
  let camY = cos(time * 0.3) * 300;
  let camZ = sin(time * 0.1) * 400;

  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Draw each plane
  for (let i = 0; i < planes.length; i++) {
    let p = planes[i];

    // Update position and rotation
    p.x += p.speedX * 100;
    p.y += p.speedY * 100;
    p.z += p.speedZ * 100;

    p.angleX += 0.005;
    p.angleY += 0.003;

    // Wrap around edges
    if (p.x > width + 200) p.x = -200;
    if (p.x < -200) p.x = width + 200;
    if (p.y > height + 200) p.y = -200;
    if (p.y < -200) p.y = height + 200;

    // Draw the plane with dynamic facets
    push();
    translate(p.x, p.y, p.z);
    rotateX(p.angleX);
    rotateY(p.angleY);

    fill(p.color);
    noStroke();

    // Create a faceted surface using multiple polygons
    let facetSize = p.size / 10;
    let rows = floor(p.size / facetSize);
    let cols = floor(p.size / facetSize);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Create a warped rectangular facet
        let x1 = -p.size/2 + c * facetSize;
        let y1 = -p.size/2 + r * facetSize;
        let x2 = x1 + facetSize;
        let y2 = y1 + facetSize;

        // Apply wave distortion to facet shape
        let distort = sin(time + (r + c) * 0.3) * 10;
        let z1 = distort;
        let z2 = distort;
        let z3 = distort;
        let z4 = distort;

        beginShape();
        vertex(x1, y1, z1);
        vertex(x2, y1, z2);
        vertex(x2, y2, z3);
        vertex(x1, y2, z4);
        endShape(CLOSE);
      }
    }

    pop();
  }

  // Draw intersecting lines to enhance crystal effect
  stroke(255, 0.3);
  noFill();
  for (let i = 0; i < planes.length; i++) {
    let p1 = planes[i];
    for (let j = i + 1; j < planes.length; j++) {
      let p2 = planes[j];

      // Draw connecting lines between planes
      let dx = p2.x - p1.x;
      let dy = p2.y - p1.y;
      let dz = p2.z - p1.z;
      let dist = sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < 500) {
        beginShape(LINES);
        vertex(p1.x, p1.y, p1.z);
        vertex(p2.x, p2.y, p2.z);
        endShape();
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
