let roadPoints = [];
let numPoints = 8;
let cars = [];
let trackWidth = 60;
let maxCars = 15;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create winding road path
  let startX = width * 0.2;
  let startY = height * 0.5;
  
  roadPoints.push(createVector(startX, startY));
  
  for (let i = 0; i < numPoints; i++) {
    let prev = roadPoints[i];
    let angle = random(TWO_PI);
    let dist = random(150, 300);
    let newX = prev.x + cos(angle) * dist;
    let newY = prev.y + sin(angle) * dist;
    
    // Keep within bounds
    newX = constrain(newX, width * 0.1, width * 0.9);
    newY = constrain(newY, height * 0.2, height * 0.8);
    
    roadPoints.push(createVector(newX, newY));
  }
  
  // Initialize cars at various positions along the track
  for (let i = 0; i < maxCars; i++) {
    cars.push({
      t: random(0, 1),
      speed: random(0.5, 2.5),
      color: color(random(100, 255), random(50, 150), random(50, 200)),
      size: random(8, 15)
    });
  }
}

function draw() {
  background(200, 220, 180);
  
  // Draw green landscape
  fill(50, 150, 50);
  rect(0, height * 0.7, width, height);
  
  // Draw the road
  drawRoad();
  
  // Update and draw cars
  for (let car of cars) {
    car.t += car.speed * 0.002;
    if (car.t > 1) car.t -= 1;
    
    let pos = getPointOnPath(car.t);
    let nextPos = getPointOnPath(car.t + 0.01);
    let angle = p5.Vector.dist(pos, nextPos);
    
    drawCar(pos.x, pos.y, car.size, car.color, angle, car.t);
  }
}

function drawRoad() {
  // Draw road ribbon with width
  let detail = 20;
  
  beginShape();
  for (let i = 0; i <= detail; i++) {
    let t = i / detail;
    let point = getPointOnPath(t);
    let tangent = getTangent(t);
    
    // Offset perpendicular to tangent for road width
    let perp = createVector(-tangent.y, tangent.x);
    let offset = p5.Vector.mult(perp, trackWidth);
    
    let left = p5.Vector.add(point, offset);
    let right = p5.Vector.sub(point, offset);
    
    vertex(left.x, left.y);
  }
  endShape();
  
  beginShape();
  for (let i = detail; i >= 0; i--) {
    let t = i / detail;
    let point = getPointOnPath(t);
    let tangent = getTangent(t);
    
    let perp = createVector(-tangent.y, tangent.x);
    let offset = p5.Vector.mult(perp, trackWidth);
    
    let left = p5.Vector.add(point, offset);
    let right = p5.Vector.sub(point, offset);
    
    vertex(right.x, right.y);
  }
  endShape();
}

function getPointOnPath(t) {
  t = constrain(t, 0, 1);
  let segment = t * numPoints;
  let segIndex = floor(segment) % roadPoints.length;
  let localT = segment - floor(segment);
  
  let p0 = roadPoints[segIndex];
  let p1 = roadPoints[(segIndex + 1) % roadPoints.length];
  let p2 = roadPoints[(segIndex + 2) % roadPoints.length];
  let p3 = roadPoints[(segIndex + 3) % roadPoints.length];
  
  // Cubic Bezier interpolation
  let u = 1 - localT;
  let tt = u * u * u;
  let uu = 3 * u * u * localT;
  let uuua = 3 * u * localT * localT;
  let uuu = localT * localT * localT;
  
  let x = tt * p0.x + uu * p1.x + uuua * p2.x + uuu * p3.x;
  let y = tt * p0.y + uu * p1.y + uuua * p2.y + uuu * p3.y;
  
  return createVector(x, y);
}

function getTangent(t) {
  let delta = 0.01;
  let p1 = getPointOnPath(t - delta);
  let p2 = getPointOnPath(t + delta);
  let tangent = p5.Vector.sub(p2, p1);
  tangent.normalize();
  return tangent;
}

function drawCar(x, y, size, col, angle, t) {
  push();
  translate(x, y);
  
  // Perspective scaling
  let perspective = map(y, 0, height, 1, 0.3);
  let scaledSize = size * perspective;
  
  // Motion blur trail
  let prevT = max(t - 0.1, 0);
  let prevPos = getPointOnPath(prevT);
  let trailWeight = 2 * scaledSize;
  stroke(col);
  strokeWeight(trailWeight);
  line(prevPos.x, prevPos.y, x, y);
  
  // Car body
  noStroke();
  fill(col);
  let bodyLength = scaledSize * 3;
  let bodyHeight = scaledSize * 1.5;
  let angleRad = atan2(y - prevPos.y, x - prevPos.x);
  rotate(angleRad);
  
  rectMode(CENTER);
  rect(0, 0, bodyLength, bodyHeight, scaledSize * 0.3);
  
  // Driver area
  fill(255, 220, 100);
  rect(0, 0, scaledSize * 0.8, bodyHeight * 0.6, scaledSize * 0.2);
  
  // Windshield
  fill(100, 150, 220, 180);
  beginShape();
  vertex(-scaledSize * 0.4, -bodyHeight * 0.3);
  vertex(-scaledSize * 0.1, -bodyHeight * 0.3);
  vertex(0, -bodyHeight * 0.5);
  vertex(scaledSize * 0.1, -bodyHeight * 0.3);
  vertex(scaledSize * 0.4, -bodyHeight * 0.3);
  endShape(CLOSE);
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  // Optional: Add a new car on click
  if (frameCount % 100 < 5) {
    let t = random(0, 1);
    let pos = getPointOnPath(t);
    cars.push({
      t: t,
      speed: random(0.5, 2.5),
      color: color(random(100, 255), random(50, 150), random(50, 200)),
      size: random(8, 15)
    });
    
    // Keep car count capped
    if (cars.length > maxCars) {
      cars.splice(0, cars.length - maxCars);
    }
  }
}
