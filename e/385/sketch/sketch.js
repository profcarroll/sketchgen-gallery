let planes = [];
let energyPaths = [];
let time = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  noStroke();

  // Create geometric planes
  for (let i = 0; i < 15; i++) {
    planes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      size: random(100, 300),
      rotX: random(TWO_PI),
      rotY: random(TWO_PI),
      rotZ: random(TWO_PI),
      speed: random(0.001, 0.005)
    });
  }

  // Create energy paths
  for (let i = 0; i < 20; i++) {
    energyPaths.push({
      points: [],
      color: color(0, 200, 100),
      speed: random(0.005, 0.02),
      size: random(2, 6)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Rotate the whole scene
  rotateY(time * 0.1);
  rotateX(time * 0.05);

  // Draw planes
  for (let plane of planes) {
    push();
    translate(plane.x, plane.y, plane.z);
    rotateX(plane.rotX + time * plane.speed);
    rotateY(plane.rotY + time * plane.speed * 1.2);
    rotateZ(plane.rotZ + time * plane.speed * 0.8);

    // Create a wavy effect
    let wave = sin(time * 2 + plane.x * 0.01) * 5;
    scale(1, 1 + wave * 0.1, 1);

    // Draw a crystalline structure
    fill(30, 40, 60, 180);
    box(plane.size);

    // Add glowing edges
    stroke(0, 255, 150, 100);
    strokeWeight(2);
    noFill();
    box(plane.size + 10);
    pop();
  }

  // Draw energy paths
  for (let path of energyPaths) {
    path.points.push(createVector(
      sin(time * path.speed + path.points.length * 0.1) * 300,
      cos(time * path.speed * 1.3 + path.points.length * 0.1) * 200,
      sin(time * path.speed * 0.7 + path.points.length * 0.1) * 150
    ));

    if (path.points.length > 100) {
      path.points.shift();
    }

    // Draw the energy pulse
    push();
    stroke(path.color);
    strokeWeight(path.size);
    noFill();

    beginShape();
    for (let i = 0; i < path.points.length; i++) {
      let point = path.points[i];
      vertex(point.x, point.y, point.z);
    }
    endShape();

    // Add light waves
    for (let i = 0; i < path.points.length; i += 5) {
      let point = path.points[i];
      let alpha = map(i, 0, path.points.length, 200, 0);
      fill(0, 255, 150, alpha);
      noStroke();
      push();
      translate(point.x, point.y, point.z);
      sphere(path.size * 0.5);
      pop();
    }
    pop();
  }

  // Add ambient particles for depth
  for (let i = 0; i < 200; i++) {
    let x = sin(time + i) * 400;
    let y = cos(time * 0.7 + i) * 300;
    let z = sin(time * 0.5 + i) * 200;
    fill(100, 255, 180, 100);
    noStroke();
    push();
    translate(x, y, z);
    sphere(1);
    pop();
  }
}
