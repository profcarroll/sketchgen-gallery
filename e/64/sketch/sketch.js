let stars = [];
let galaxyCenter;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  galaxyCenter = createVector(0, 0);

  // Create many stars with random positions and properties
  for (let i = 0; i < 1000; i++) {
    stars.push({
      pos: createVector(
        random(-width * 2, width * 2),
        random(-height * 2, height * 2),
        random(-1000, 1000)
      ),
      size: random(0.5, 3),
      brightness: random(50, 255),
      twinkleSpeed: random(0.01, 0.05),
      twinklePhase: random(TWO_PI)
    });
  }
}

function draw() {
  background(10, 10, 40);
  time += 0.002;

  // Camera movement for cosmic drift
  let camX = sin(time * 0.1) * 50;
  let camY = cos(time * 0.1) * 50;
  camera(0, 0, (height / 2.0) / tan(PI / 6), camX, camY, 0, 0, 1, 0);

  // Draw Milky Way glow
  drawMilkyWay();

  // Draw twinkling stars
  for (let star of stars) {
    let x = star.pos.x;
    let y = star.pos.y;
    let z = star.pos.z;

    // Move stars toward viewer to simulate depth
    z += time * 50;
    if (z > 1000) z -= 2000;

    let screenX = map(x, -width, width, -width / 2, width / 2);
    let screenY = map(y, -height, height, -height / 2, height / 2);
    let screenZ = map(z, -1000, 1000, -500, 500);

    // Adjust size based on depth
    let size = star.size * (1 + screenZ / 1000);
    let brightness = star.brightness + sin(time * star.twinkleSpeed + star.twinklePhase) * 50;

    push();
    translate(screenX, screenY, screenZ);
    noStroke();
    fill(255, 255, 255, brightness);
    sphere(size);
    pop();
  }

  // Occasionally add a supernova flare
  if (frameCount % 300 === 0) {
    let x = random(-width / 2, width / 2);
    let y = random(-height / 2, height / 2);
    let z = random(-1000, 1000);
    
    push();
    translate(x, y, z);
    noStroke();
    fill(255, 100, 0, 100);
    sphere(random(20, 40));
    pop();
  }
}

function drawMilkyWay() {
  // Draw a subtle glow representing the Milky Way
  noStroke();
  for (let i = 0; i < 500; i++) {
    let angle = random(TWO_PI);
    let radius = random(200, 800);
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    let z = random(-300, 300);
    
    let brightness = map(dist(x, y, 0, 0), 0, 800, 20, 100);
    fill(150, 180, 255, brightness);
    ellipse(x, y, 10, 10);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
