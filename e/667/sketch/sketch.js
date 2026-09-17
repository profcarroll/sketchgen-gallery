let planes = [];
let rays = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 1);

  // Create architectural planes
  for (let i = 0; i < 8; i++) {
    planes.push({
      x: random(-200, 200),
      y: random(-200, 200),
      z: random(-200, 200),
      size: random(100, 200),
      rotX: random(TWO_PI),
      rotY: random(TWO_PI),
      rotZ: random(TWO_PI),
      color: color(random(360), 0.8, 0.9)
    });
  }

  // Create rays
  for (let i = 0; i < 1000; i++) {
    rays.push({
      x: random(-400, 400),
      y: random(-400, 400),
      z: random(-400, 400),
      size: random(1, 3),
      speed: random(0.005, 0.02),
      color: color(random(360), 0.8, 1)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Camera movement
  let camX = sin(time * 0.1) * 400;
  let camY = cos(time * 0.2) * 200;
  let camZ = cos(time * 0.1) * 300;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Draw planes
  for (let plane of planes) {
    push();
    translate(plane.x, plane.y, plane.z);
    rotateX(plane.rotX + time * 0.2);
    rotateY(plane.rotY + time * 0.3);
    rotateZ(plane.rotZ + time * 0.1);
    
    noStroke();
    fill(plane.color);
    box(plane.size);
    pop();
  }

  // Draw rays
  beginShape(POINTS);
  for (let ray of rays) {
    ray.x += sin(time * ray.speed) * 2;
    ray.y += cos(time * ray.speed) * 2;
    ray.z += sin(time * ray.speed * 0.5) * 2;

    // Intersect with planes
    let hit = false;
    for (let plane of planes) {
      let d = dist(ray.x, ray.y, ray.z, plane.x, plane.y, plane.z);
      if (d < plane.size / 2) {
        hit = true;
        break;
      }
    }

    if (hit) {
      fill(ray.color);
      vertex(ray.x, ray.y, ray.z);
    }
  }
  endShape();

  // Create crystalline patterns
  beginShape(LINES);
  for (let i = 0; i < rays.length; i += 10) {
    let r1 = rays[i];
    let r2 = rays[(i + 1) % rays.length];

    if (dist(r1.x, r1.y, r1.z, r2.x, r2.y, r2.z) < 50) {
      stroke(r1.color);
      vertex(r1.x, r1.y, r1.z);
      vertex(r2.x, r2.y, r2.z);
    }
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
