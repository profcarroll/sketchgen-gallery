let timer = 10;
let marblePos = { x: 0, y: 0, z: 0 };
let isRunning = false;
let raceCourse;
let finishLine;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  rectMode(CENTER);

  // Precompute race course geometry
  raceCourse = [];
  for (let i = 0; i < 20; i++) {
    const angle = map(i, 0, 19, 0, TWO_PI * 2);
    const radius = 150 + sin(angle * 3) * 50;
    const x = cos(angle) * radius;
    const z = sin(angle) * radius;
    raceCourse.push({ x, y: 0, z });
  }

  // Finish line
  finishLine = { x: 0, y: 0, z: -300 };
}

function draw() {
  background(40);
  ambientLight(100);
  pointLight(255, 255, 255, 0, 0, 300);

  // Camera
  const time = millis() / 1000;
  camera(
    sin(time * 0.2) * 500,
    200,
    cos(time * 0.2) * 500,
    0,
    0,
    0,
    0,
    1,
    0
  );

  // Draw race course
  push();
  translate(0, -50, 0);
  fill(60, 80, 120);
  beginShape(TRIANGLE_STRIP);
  for (let i = 0; i < raceCourse.length; i++) {
    const p1 = raceCourse[i];
    const p2 = raceCourse[(i + 1) % raceCourse.length];
    vertex(p1.x, p1.y, p1.z);
    vertex(p2.x, p2.y, p2.z);
  }
  endShape();

  // Finish line
  fill(255, 0, 0);
  push();
  translate(finishLine.x, finishLine.y, finishLine.z);
  box(200, 20, 20);
  pop();

  // Marble
  push();
  translate(marblePos.x, marblePos.y - 10, marblePos.z);
  fill(255, 200, 0);
  sphere(10);
  pop();

  // Countdown timer
  if (isRunning) {
    timer -= deltaTime / 1000;
    if (timer <= 0) {
      timer = 0;
      isRunning = false;
    }
  }

  // Draw UI
  push();
  translate(-width/2 + 50, -height/2 + 50);
  fill(255);
  textSize(32);
  text("Time: " + nf(timer, 0, 1), 0, 0);
  pop();

  // Move marble
  if (isRunning) {
    const speed = 0.5;
    marblePos.z += speed;
    if (marblePos.z > finishLine.z + 100) {
      marblePos.z = finishLine.z + 100;
    }
  }
}

function mousePressed() {
  isRunning = true;
  timer = 10;
}
