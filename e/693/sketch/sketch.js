let planets = [];
let sun;
let cameraAngle = 0;
let isRunning = true;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  sun = {
    x: 0,
    y: 0,
    z: 0,
    radius: 30,
    color: color(40, 100, 100)
  };

  // Create planets with orbits
  for (let i = 0; i < 8; i++) {
    let angle = random(TWO_PI);
    let distance = random(100, 300);
    let radius = random(5, 15);
    let speed = random(0.002, 0.01);
    let colorHue = random(360);
    let hasRings = random() > 0.7;

    planets.push({
      angle: angle,
      distance: distance,
      radius: radius,
      speed: speed,
      color: color(colorHue, 80, 90),
      rings: hasRings ? {
        innerRadius: radius * 1.5,
        outerRadius: radius * 2.5,
        color: color(colorHue, 60, 80, 0.7)
      } : null
    });
  }
}

function draw() {
  background(0);
  ambientLight(30);

  // Camera rotation
  cameraAngle += 0.002;
  let camX = sin(cameraAngle) * 500;
  let camZ = cos(cameraAngle) * 500;
  camera(camX, 0, camZ, 0, 0, 0, 0, 1, 0);

  // Draw sun
  push();
  fill(sun.color);
  noStroke();
  sphere(sun.radius);
  pointLight(255, 255, 255, 0, 0, 0);
  pop();

  // Draw orbit paths
  stroke(255, 10);
  noFill();
  for (let planet of planets) {
    beginShape();
    for (let i = 0; i <= 64; i++) {
      let angle = map(i, 0, 64, 0, TWO_PI);
      let x = cos(angle) * planet.distance;
      let z = sin(angle) * planet.distance;
      vertex(x, 0, z);
    }
    endShape(CLOSE);
  }

  // Draw planets
  for (let planet of planets) {
    planet.angle += planet.speed;
    let x = cos(planet.angle) * planet.distance;
    let z = sin(planet.angle) * planet.distance;

    push();
    translate(x, 0, z);
    fill(planet.color);
    noStroke();
    sphere(planet.radius);

    // Draw rings if planet has them
    if (planet.rings) {
      stroke(planet.rings.color);
      noFill();
      ellipse(0, 0, planet.rings.outerRadius * 2, planet.rings.outerRadius * 2);
      ellipse(0, 0, planet.rings.innerRadius * 2, planet.rings.innerRadius * 2);
    }
    pop();
  }

  if (!isRunning) {
    noLoop();
  }
}

function mousePressed() {
  isRunning = !isRunning;
  if (isRunning) {
    loop();
  } else {
    noLoop();
  }
}
