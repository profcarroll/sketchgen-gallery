let rays = [];
let structures = [];
let lightPos;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize light source
  lightPos = createVector(0, -height/2, width/2);

  // Create architectural structures (building façade)
  for (let i = 0; i < 20; i++) {
    let x = random(-width/3, width/3);
    let y = random(-height/4, height/4);
    let z = random(-width/4, width/4);
    let w = random(20, 80);
    let h = random(50, 150);
    let d = random(20, 60);
    structures.push({x, y, z, w, h, d});
  }

  // Create rays
  for (let i = 0; i < 300; i++) {
    let angle = random(TWO_PI);
    let dist = random(100, width/2);
    let x = lightPos.x + cos(angle) * dist;
    let y = lightPos.y + sin(angle) * dist;
    let z = random(-width/2, width/2);
    rays.push(createVector(x, y, z));
  }
}

function draw() {
  background(0);

  // Rotate the scene slowly for dynamic shadow effect
  rotateY(frameCount * 0.005);

  // Draw light source
  push();
  translate(lightPos.x, lightPos.y, lightPos.z);
  noStroke();
  fill(255, 100, 100);
  sphere(20);
  pop();

  // Draw structures
  for (let s of structures) {
    push();
    translate(s.x, s.y, s.z);
    noStroke();
    fill(180, 30, 50);
    box(s.w, s.h, s.d);
    pop();
  }

  // Calculate and draw shadows
  for (let ray of rays) {
    let shadow = calculateShadow(ray, lightPos);
    if (shadow) {
      push();
      stroke(0, 30);
      strokeWeight(1);
      line(ray.x, ray.y, ray.z, shadow.x, shadow.y, shadow.z);
      pop();
    }
  }
}

function calculateShadow(point, lightSource) {
  let direction = p5.Vector.sub(point, lightSource);
  direction.normalize();

  // Check for intersection with structures
  for (let s of structures) {
    // Simple AABB intersection test
    if (point.x > s.x - s.w/2 && point.x < s.x + s.w/2 &&
        point.y > s.y - s.h/2 && point.y < s.y + s.h/2 &&
        point.z > s.z - s.d/2 && point.z < s.z + s.d/2) {
      // Calculate shadow point by extending ray to far side of structure
      let closest = createVector(s.x, s.y, s.z);
      let dist = p5.Vector.dist(point, closest);
      let shadowPoint = p5.Vector.add(point, direction.copy().mult(dist * 10));
      return shadowPoint;
    }
  }

  // No intersection, ray continues to infinity
  return null;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
