// Track parameters
const TRACK_WIDTH = 6;
const TRACK_LENGTH = 200;
const CURVE_SPEED = 0.02;

// Car parameters
const CAR_SIZE = 3;
const NUM_CARS = 15;

let cars = [];
let trackPoints = [];
let trackNormals = [];
let carAngles = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30);
  
  // Generate track path
  generateTrack();
  
  // Initialize cars at different positions along track
  for (let i = 0; i < NUM_CARS; i++) {
    cars.push({
      t: map(i, 0, NUM_CARS - 1, 0, 1),
      hue: map(i, 0, NUM_CARS - 1, 0, 360),
      speed: 0.005 + random(0.002, 0.005)
    });
  }
}

function generateTrack() {
  trackPoints = [];
  trackNormals = [];
  
  // Create the Laguna Seca track with Corkscrew
  // Main straight
  for (let i = 0; i < 50; i++) {
    let t = i / 49;
    trackPoints.push(createVector(0, 0, lerp(-100, -50, t)));
  }
  
  // First chicane
  for (let i = 0; i < 20; i++) {
    let t = i / 19;
    let x = [-4, -3, 3, 4][floor(t * 4)];
    let z = lerp(-50, -60, t);
    trackPoints.push(createVector(x, 0, z));
  }
  
  // Ascending section
  for (let i = 0; i < 30; i++) {
    let t = i / 29;
    trackPoints.push(createVector(4 + t * 2, t * 5, lerp(-60, -70, t)));
  }
  
  // Corkscrew turn (hairpin + drop)
  let corkscrewCenter = createVector(10, 15, -70);
  let corkscrewRadius = 8;
  let corkscrewHeight = 15;
  
  for (let i = 0; i < 50; i++) {
    let angle = map(i, 0, 49, -PI / 2, PI * 2 - PI / 2);
    let radius = map(i, 0, 24, corkscrewRadius, corkscrewRadius * 0.3);
    let height = map(i, 0, 24, 0, -corkscrewHeight);
    let x = corkscrewCenter.x + cos(angle) * radius;
    let y = corkscrewCenter.y + height;
    let z = corkscrewCenter.z + sin(angle) * radius;
    trackPoints.push(createVector(x, y, z));
  }
  
  // Descending section
  for (let i = 0; i < 30; i++) {
    let t = i / 29;
    let angle = PI + t * PI;
    let x = 15 - t * 20;
    let y = 3 - t * 2;
    let z = -85 + t * 15;
    trackPoints.push(createVector(x, y, z));
  }
  
  // Calculate normals for track banking
  for (let i = 1; i < trackPoints.length - 1; i++) {
    let prev = trackPoints[i - 1].copy();
    let curr = trackPoints[i].copy();
    let next = trackPoints[i + 1].copy();
    let tan = p5.Vector.sub(next, prev).normalize();
    let normal = createVector(-tan.z, 0, tan.x);
    trackNormals.push(normal);
  }
  trackNormals.push(createVector(0, 0, 1));
  trackNormals.unshift(createVector(0, 0, 1));
}

function draw() {
  background(100, 150, 255);
  
  // Camera follows a point ahead on the track
  let camT = (frameCount * 0.001) % 1;
  let aheadT = min(camT + 0.1, 1);
  let camPos = getPointOnTrack(camT);
  camPos.add(createVector(random(-5, 5), random(-2, 3), random(-5, 5)));
  
  // Position camera
  camera(camPos.x, camPos.y + 10, camPos.z + 50,
         camPos.x, camPos.y, camPos.z,
         0, 1, 0);
  
  // Draw landscape hills
  drawHills();
  
  // Draw track
  drawTrack();
  
  // Update and draw cars
  for (let car of cars) {
    car.t = (car.t + car.speed) % 1;
    drawCar(car);
  }
}

function getPointOnTrack(t) {
  let totalLen = trackPoints.length;
  let idx = floor(t * (totalLen - 1));
  let fraction = (t * (totalLen - 1)) - idx;
  idx = constrain(idx, 0, totalLen - 1);
  let nextIdx = min(idx + 1, totalLen - 1);
  return p5.Vector.lerp(trackPoints[idx], trackPoints[nextIdx], fraction);
}

function drawHills() {
  // Green hills background
  push();
  noStroke();
  fill(34, 139, 34, 150);
  
  // Draw rolling hills
  for (let i = 0; i < 20; i++) {
    let x = random(-200, 200);
    let z = random(-150, 100);
    let size = random(20, 60);
    let y = random(0, 5);
    beginShape(POINTS);
    for (let px = x - size; px < x + size; px += 2) {
      for (let pz = z - size; pz < z + size; pz += 2) {
        let dx = (px - x) / size;
        let dz = (pz - z) / size;
        let dist = sqrt(dx * dx + dz * dz);
        if (dist < 0.7) {
          let py = y - (1 - dist) * size * 0.3;
          vertex(px, py, pz);
        }
      }
    }
    endShape();
  }
  pop();
}

function drawTrack() {
  push();
  stroke(100, 100, 100, 200);
  strokeWeight(TRACK_WIDTH);
  noFill();
  
  // Draw track ribbon
  beginShape();
  for (let p of trackPoints) {
    vertex(p.x, p.y - 0.1, p.z);
  }
  endShape();
  
  // Draw track with slight offset for double line
  beginShape();
  for (let p of trackPoints) {
    vertex(p.x, p.y - 0.1, p.z + TRACK_WIDTH);
  }
  endShape();
  
  pop();
}

function drawCar(car) {
  let pos = getPointOnTrack(car.t);
  let idx = floor(car.t * (trackPoints.length - 1));
  let idxNext = min(idx + 1, trackPoints.length - 2);
  let nextPt = trackPoints[idxNext];
  let dir = p5.Vector.sub(nextPt, pos).normalize();
  
  let angle = atan2(dir.x, dir.z);
  
  push();
  translate(pos.x, pos.y - 1, pos.z);
  rotateY(angle);
  
  // Car body
  noStroke();
  fill(car.hue, 80, 90);
  box(CAR_SIZE, CAR_SIZE * 0.6, CAR_SIZE * 1.5);
  
  // Car top
  fill(car.hue, 100, 100);
  translate(0, CAR_SIZE * 0.35, 0);
  box(CAR_SIZE * 0.9, CAR_SIZE * 0.2, CAR_SIZE * 1.3);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
