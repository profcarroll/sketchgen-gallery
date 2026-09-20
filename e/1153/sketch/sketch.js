let t = 0;
let numPoints = 150;
let points = [];
let pillars = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  for (let i = 0; i < numPoints; i++) {
    let angle = (i / numPoints) * TWO_PI * 3 + random(-0.3, 0.3);
    let radius = 150 + random(50, 150);
    points.push({
      baseAngle: angle,
      radius: radius,
      speed: 0.008 + random(-0.003, 0.003),
      wobble: random(TWO_PI),
      height: 50 + random(100, 300)
    });
  }
  for (let i = 0; i < 300; i++) {
    pillars.push({
      pos: createVector(random(-width / 2, width / 2), random(-height / 2, height / 2)),
      baseHeight: 20 + random(50, 150),
      speed: 0.01 + random(-0.005, 0.005),
      timeOffset: random(TWO_PI)
    });
  }
}

function draw() {
  background(10, 10, 30);
  rotateX(-PI / 4);
  rotateY(t * 0.2);
  
  // Draw floor plane
  push();
  translate(0, 0, 0);
  rotateX(PI / 2);
  noStroke();
  fill(20, 30, 50);
  beginShape(QUADS);
  vertex(-width / 2, -height / 2);
  vertex(width / 2, -height / 2);
  vertex(width / 2, height / 2);
  vertex(-width / 2, height / 2);
  endShape();
  pop();

  // Draw arcs and pillars from points
  beginShape(POINTS);
  for (let p of points) {
    let angle = p.baseAngle + sin(t * p.speed + p.wobble) * 0.5;
    let x = cos(angle) * p.radius;
    let y = sin(angle) * p.radius * 0.3;
    let z = p.height * sin(t * 0.5 + angle * 0.3);
    let h = p.height;
    
    // Draw glowing pillar
    let hue = map(sin(t + p.baseAngle), -1, 1, 180, 255);
    colorMode(HSB, 255);
    fill(hue, 200, 255, 150);
    
    for (let hSeg = 0; hSeg < h / 10; hSeg += 10) {
      push();
      translate(x, y, hSeg);
      rotateY(t * 0.2);
      box(6, 6, 8);
      pop();
    }
    
    vertex(x, y, 0);
  }
  endShape();
  colorMode(RGB, 255);

  // Draw vertical pillar lines
  stroke(255, 255, 255, 60);
  strokeWeight(1);
  for (let p of pillars) {
    let y = p.pos.y + sin(t * p.speed + p.timeOffset) * 20;
    let h = p.baseHeight + sin(t * p.speed * 0.7 + p.timeOffset) * 30;
    line(p.pos.x, p.pos.y - 50, y, p.pos.x, p.pos.y + h, y);
  }

  t += 0.02;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
