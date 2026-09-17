let marbles = [];
let trails = [];
let track;
let goal;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create track geometry
  track = createTrack();

  // Create marbles
  for (let i = 0; i < 8; i++) {
    marbles.push({
      pos: createVector(-200 + i * 60, 0, -200),
      vel: p5.Vector.random3D().mult(random(1, 3)),
      color: color(random(360), 80, 90),
      radius: 12,
      trail: []
    });
  }

  // Goal position
  goal = createVector(0, 0, 200);
}

function draw() {
  background(0);

  // Camera setup for isometric view
  camera(0, -300, 500, 0, 0, 0, 0, 1, 0);

  // Draw track
  drawTrack();

  // Update and draw marbles
  for (let marble of marbles) {
    updateMarble(marble);
    drawMarble(marble);
  }

  // Draw trails
  drawTrails();
}

function updateMarble(marble) {
  // Move marble
  marble.pos.add(marble.vel);

  // Add to trail
  marble.trail.push(createVector(marble.pos.x, marble.pos.y, marble.pos.z));
  if (marble.trail.length > 30) {
    marble.trail.shift();
  }

  // Simple collision with track boundaries (basic bounce)
  if (abs(marble.pos.x) > 250 || abs(marble.pos.z) > 250) {
    marble.vel.rotate(random(-0.1, 0.1));
  }
}

function drawMarble(marble) {
  push();
  translate(marble.pos.x, marble.pos.y, marble.pos.z);
  noStroke();
  fill(marble.color);
  sphere(marble.radius);
  pop();
}

function drawTrails() {
  // Draw all trails as glowing lines
  for (let marble of marbles) {
    if (marble.trail.length < 2) continue;

    beginShape(LINES);
    noFill();
    strokeWeight(2);
    for (let i = 0; i < marble.trail.length - 1; i++) {
      let pos1 = marble.trail[i];
      let pos2 = marble.trail[i + 1];
      
      // Fade trail
      let alpha = map(i, 0, marble.trail.length - 1, 0, 1);
      stroke(hue(marble.color), saturation(marble.color), brightness(marble.color), alpha * 0.8);
      
      vertex(pos1.x, pos1.y, pos1.z);
      vertex(pos2.x, pos2.y, pos2.z);
    }
    endShape();
  }
}

function drawTrack() {
  // Draw the racetrack with bright colors
  noStroke();
  fill(60, 80, 90); // Yellow track
  beginShape();
  vertex(-300, 0, -300);
  vertex(300, 0, -300);
  vertex(300, 0, 300);
  vertex(-300, 0, 300);
  endShape(CLOSE);

  // Draw goal area
  fill(240, 80, 90); // Blue goal
  beginShape();
  vertex(-100, 0, 250);
  vertex(100, 0, 250);
  vertex(100, 0, 300);
  vertex(-100, 0, 300);
  endShape(CLOSE);
}

function createTrack() {
  // Precompute track geometry
  let points = [];
  for (let i = 0; i < 8; i++) {
    points.push(createVector(
      cos(i * TWO_PI / 8) * 250,
      0,
      sin(i * TWO_PI / 8) * 250
    ));
  }
  return points;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
