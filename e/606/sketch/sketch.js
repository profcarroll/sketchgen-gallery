let stars = [];
let dustLanes = [];
let milkyWay;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create thousands of stars
  for (let i = 0; i < 5000; i++) {
    stars.push({
      x: random(-width * 2, width * 2),
      y: random(-height * 2, height * 2),
      z: random(-1000, 1000),
      size: random(0.5, 3),
      brightness: random(0.5, 1)
    });
  }

  // Create dust lanes with fractal patterns
  for (let i = 0; i < 20; i++) {
    dustLanes.push({
      angle: random(TWO_PI),
      speed: random(0.001, 0.005),
      thickness: random(5, 20),
      segments: []
    });
  }

  // Create a base Milky Way structure
  milkyWay = createGraphics(width, height);
  milkyWay.colorMode(HSB, 360, 100, 100, 1);
  milkyWay.background(0, 0, 0, 0);
  milkyWay.noiseSeed(42);
  for (let i = 0; i < 10000; i++) {
    let x = random(width);
    let y = random(height);
    let n = milkyWay.noise(x * 0.005, y * 0.005) * 0.5 + 0.5;
    if (n > 0.7) {
      milkyWay.stroke(230, 50, 100, n * 0.5);
      milkyWay.point(x, y);
    }
  }
}

function draw() {
  background(230, 50, 10); // Deep indigo
  time += 0.01;

  // Rotate the view
  rotateX(time * 0.05);
  rotateY(time * 0.03);

  // Draw stars
  beginShape(POINTS);
  for (let star of stars) {
    stroke(star.brightness * 255, 100, 100, 1);
    noStroke();
    point(star.x, star.y, star.z);
  }
  endShape();

  // Draw dust lanes
  for (let lane of dustLanes) {
    lane.angle += lane.speed;
    let segments = [];
    beginShape(LINES);
    for (let i = 0; i < 100; i++) {
      let angle = lane.angle + i * 0.2;
      let radius = 500 + sin(i * 0.3 + time) * 200;
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      let z = sin(i * 0.1 + time * 2) * 100;
      stroke(230, 40, 60, 0.2);
      vertex(x, y, z);
    }
    endShape();
  }

  // Draw Milky Way
  texture(milkyWay);
  plane(width * 2, height * 2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
