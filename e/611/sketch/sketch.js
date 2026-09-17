let planets = [];
let sun;
let orbitTrails = [];

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create the Sun
  sun = {
    name: "Sun",
    radius: 30,
    color: color(40, 100, 100),
    rotationSpeed: 0.002,
    angle: 0,
    x: 0,
    y: 0,
    z: 0
  };

  // Create planets with varying properties
  planets = [
    { name: "Mercury", radius: 5, distance: 60, speed: 0.02, color: color(180, 50, 70), angle: random(TWO_PI) },
    { name: "Venus", radius: 8, distance: 90, speed: 0.015, color: color(30, 80, 80), angle: random(TWO_PI) },
    { name: "Earth", radius: 9, distance: 130, speed: 0.01, color: color(220, 70, 70), angle: random(TWO_PI) },
    { name: "Mars", radius: 7, distance: 170, speed: 0.008, color: color(0, 60, 70), angle: random(TWO_PI) },
    { name: "Jupiter", radius: 20, distance: 230, speed: 0.005, color: color(60, 70, 80), angle: random(TWO_PI) },
    { name: "Saturn", radius: 18, distance: 300, speed: 0.003, color: color(80, 70, 80), angle: random(TWO_PI) },
    { name: "Uranus", radius: 12, distance: 360, speed: 0.002, color: color(150, 70, 80), angle: random(TWO_PI) },
    { name: "Neptune", radius: 11, distance: 420, speed: 0.001, color: color(200, 70, 80), angle: random(TWO_PI) }
  ];

  // Initialize orbit trails
  for (let i = 0; i < planets.length; i++) {
    orbitTrails[i] = [];
  }
}

function draw() {
  background(0);
  noStroke();

  // Ambient light
  ambientLight(100);

  // Directional light from the Sun
  pointLight(255, 255, 255, sun.x, sun.y, sun.z);

  // Rotate the whole system
  rotateY(frameCount * 0.001);

  // Draw the Sun
  push();
  fill(sun.color);
  sphere(sun.radius);
  pop();

  // Update and draw planets
  for (let i = 0; i < planets.length; i++) {
    let p = planets[i];
    p.angle += p.speed;

    // Calculate planet position
    let x = cos(p.angle) * p.distance;
    let y = sin(p.angle) * p.distance;

    // Store trail points
    orbitTrails[i].push({ x, y });
    if (orbitTrails[i].length > 200) {
      orbitTrails[i].shift();
    }

    // Draw orbit trail
    push();
    stroke(p.color);
    strokeWeight(0.5);
    noFill();
    beginShape();
    for (let point of orbitTrails[i]) {
      vertex(point.x, point.y, 0);
    }
    endShape();
    pop();

    // Draw planet
    push();
    translate(x, y, 0);
    fill(p.color);
    sphere(p.radius);
    pop();
  }

  // Add some stars in the background
  drawStars();
}

function drawStars() {
  noStroke();
  fill(255);
  for (let i = 0; i < 100; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-300, -100);
    push();
    translate(x, y, z);
    sphere(1);
    pop();
  }
}

function mousePressed() {
  noLoop();
}
