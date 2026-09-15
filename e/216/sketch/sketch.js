let planes = [];
let seamVertices = [];

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create a series of large, intersecting planes
  for (let i = 0; i < 8; i++) {
    let plane = {
      x: random(-200, 200),
      y: random(-200, 200),
      z: random(-200, 200),
      size: random(300, 500),
      angle: random(TWO_PI),
      speed: random(0.001, 0.005),
      hue: random(80, 100)
    };
    planes.push(plane);
  }

  // Generate glowing seam vertices
  for (let i = 0; i < 2000; i++) {
    let x = random(-400, 400);
    let y = random(-400, 400);
    let z = random(-400, 400);
    seamVertices.push({x, y, z});
  }
}

function draw() {
  background(0);
  noStroke();

  // Animate planes
  for (let plane of planes) {
    plane.angle += plane.speed;
    push();
    translate(plane.x, plane.y, plane.z);
    rotateX(plane.angle);
    rotateY(plane.angle * 0.7);
    rotateZ(plane.angle * 0.3);
    
    // Create a large, distorted cube shape
    let s = plane.size;
    fill(plane.hue, 80, 90, 0.8);
    box(s, s, s);
    pop();
  }

  // Draw glowing seams
  stroke(100, 100, 80, 0.7);
  strokeWeight(2);
  noFill();
  
  beginShape(LINES);
  for (let i = 0; i < seamVertices.length; i += 2) {
    let v1 = seamVertices[i];
    let v2 = seamVertices[(i + 1) % seamVertices.length];
    vertex(v1.x, v1.y, v1.z);
    vertex(v2.x, v2.y, v2.z);
  }
  endShape();

  // Add subtle movement to seams
  for (let i = 0; i < seamVertices.length; i++) {
    let v = seamVertices[i];
    v.x += sin(frameCount * 0.01 + i) * 0.5;
    v.y += cos(frameCount * 0.01 + i) * 0.5;
    v.z += sin(frameCount * 0.007 + i) * 0.3;
  }
}
