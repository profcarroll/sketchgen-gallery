let cubeRotation = 0;
let orbitingOrbs = [];
let traceryPoints = [];

function setup() {
  createCanvas(600, 600, WEBGL);
  noStroke();

  // Create orbiting orbs
  for (let i = 0; i < 12; i++) {
    orbitingOrbs.push({
      angle: random(TWO_PI),
      distance: random(150, 250),
      size: random(10, 30),
      speed: random(0.005, 0.02),
      color: color(random(100, 255), random(100, 255), random(200, 255), 200)
    });
  }

  // Create tracery points for the emerald glass effect
  for (let i = 0; i < 200; i++) {
    traceryPoints.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(2, 8),
      speed: random(0.001, 0.005)
    });
  }
}

function draw() {
  background(0);
  
  // Rotate the entire scene
  cubeRotation += 0.005;
  rotateY(cubeRotation);
  
  // Draw central rotating cube with emerald glass effect
  push();
  fill(30, 100, 60, 180);
  stroke(255, 200);
  box(100);
  pop();

  // Draw orbiting orbs
  for (let orb of orbitingOrbs) {
    orb.angle += orb.speed;
    let x = cos(orb.angle) * orb.distance;
    let y = sin(orb.angle) * orb.distance;
    let z = sin(orb.angle * 0.5) * 100;

    push();
    translate(x, y, z);
    fill(orb.color);
    noStroke();
    sphere(orb.size);
    pop();
  }

  // Draw tracery lines and glowing particles
  stroke(255, 100);
  strokeWeight(1);
  beginShape(LINES);
  for (let i = 0; i < traceryPoints.length; i += 2) {
    let p1 = traceryPoints[i];
    let p2 = traceryPoints[(i + 1) % traceryPoints.length];
    vertex(p1.x, p1.y, p1.z);
    vertex(p2.x, p2.y, p2.z);
  }
  endShape();

  // Draw glowing particles
  noStroke();
  for (let point of traceryPoints) {
    point.z += point.speed;
    if (point.z > 100) point.z = -100;
    
    let brightness = map(sin(frameCount * 0.02 + point.z), -1, 1, 100, 255);
    fill(100, 255, 200, brightness);
    ellipse(point.x, point.y, point.size);
  }
}
