let track, debris, marbles, timer;
let raceStarted = false;
let startTime;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  // Initialize track sections
  track = [];
  for (let i = 0; i < 10; i++) {
    track.push({
      x: 0,
      y: 0,
      z: i * 200,
      width: 300,
      height: 10,
      depth: 200
    });
  }

  // Initialize debris
  debris = [];
  for (let i = 0; i < 200; i++) {
    debris.push({
      x: random(-150, 150),
      y: 0,
      z: random(0, 2000),
      size: random(2, 6),
      glow: random(0.5, 1)
    });
  }

  // Initialize marbles
  marbles = [];
  for (let i = 0; i < 3; i++) {
    marbles.push({
      x: 0,
      y: 0,
      z: 0,
      lane: i,
      speed: random(0.5, 1.5),
      color: color(random(100, 255), random(100, 255), random(100, 255))
    });
  }

  timer = 30;
  startTime = millis();
}

function draw() {
  background(0);
  ambientLight(50);
  pointLight(255, 255, 255, 0, -200, 100);

  // Camera movement
  let time = millis() / 1000;
  camera(0, -300, 800, 0, 0, 0, 0, 1, 0);

  // Draw track
  for (let section of track) {
    push();
    translate(section.x, section.y, section.z);
    fill(30, 30, 50);
    box(section.width, section.height, section.depth);
    pop();

    // Glowing path
    push();
    translate(section.x, section.y + 20, section.z);
    fill(0, 255, 255, 100);
    box(section.width * 0.8, 5, section.depth * 0.8);
    pop();
  }

  // Update and draw debris
  for (let d of debris) {
    // Move debris towards glowing path
    let targetX = 0;
    let targetZ = d.z;

    let dx = targetX - d.x;
    let dz = targetZ - d.z;

    d.x += dx * 0.01;
    d.z += dz * 0.01;

    // Draw debris
    push();
    translate(d.x, d.y, d.z);
    fill(255, 255, 255, d.glow * 255);
    sphere(d.size);
    pop();
  }

  // Update and draw marbles
  for (let m of marbles) {
    if (!raceStarted && timer <= 0) {
      raceStarted = true;
    }

    if (raceStarted) {
      m.z += m.speed * 2;
      m.x = sin(time * 0.5 + m.lane) * 100;
    }

    // Draw marble
    push();
    translate(m.x, m.y, m.z);
    fill(m.color);
    sphere(15);
    pop();
  }

  // Countdown timer
  let elapsed = (millis() - startTime) / 1000;
  timer = max(0, 30 - elapsed);

  if (timer <= 0) {
    noLoop();
  }

  // Draw timer overlay
  push();
  fill(255);
  textSize(48);
  textAlign(CENTER);
  text(nf(timer, 1, 1), 0, -height/2 + 60);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
