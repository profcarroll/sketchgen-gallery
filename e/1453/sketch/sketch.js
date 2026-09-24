let planets = [];
let stars = [];
let orbits = [];
let isAnimating = false;
let cameraAngle = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create a central star
  stars.push({
    x: 0,
    y: 0,
    z: 0,
    radius: 20,
    hue: 30,
    brightness: 100
  });

  // Create planets with different orbits and properties
  const planetData = [
    { distance: 60, size: 4, hue: 150, speed: 0.01 },
    { distance: 90, size: 3, hue: 200, speed: 0.008 },
    { distance: 120, size: 5, hue: 250, speed: 0.006 },
    { distance: 160, size: 6, hue: 300, speed: 0.005 },
    { distance: 200, size: 4, hue: 40, speed: 0.004 },
    { distance: 240, size: 7, hue: 100, speed: 0.003 }
  ];

  for (let i = 0; i < planetData.length; i++) {
    const data = planetData[i];
    planets.push({
      angle: random(TWO_PI),
      distance: data.distance,
      size: data.size,
      hue: data.hue,
      speed: data.speed,
      x: 0,
      y: 0,
      z: 0
    });
  }

  // Create orbital paths (lines)
  for (let i = 0; i < planets.length; i++) {
    orbits[i] = [];
    for (let j = 0; j < 100; j++) {
      const angle = map(j, 0, 99, 0, TWO_PI);
      const x = cos(angle) * planets[i].distance;
      const y = sin(angle) * planets[i].distance;
      orbits[i].push({ x, y });
    }
  }

  noLoop();
}

function draw() {
  background(0);

  // Set up lighting
  pointLight(255, 255, 255, 0, 0, 100);
  ambientLight(50);

  // Rotate camera slowly
  cameraAngle += 0.002;
  rotateY(cameraAngle);

  // Draw orbits
  stroke(255, 30);
  noFill();
  for (let i = 0; i < orbits.length; i++) {
    beginShape();
    for (let j = 0; j < orbits[i].length; j++) {
      const point = orbits[i][j];
      vertex(point.x, point.y, 0);
    }
    endShape(CLOSE);
  }

  // Draw star
  push();
  fill(stars[0].hue, 100, stars[0].brightness);
  noStroke();
  sphere(stars[0].radius);
  pop();

  // Draw planets only if animation started
  if (isAnimating) {
    for (let i = 0; i < planets.length; i++) {
      const planet = planets[i];
      planet.angle += planet.speed;

      planet.x = cos(planet.angle) * planet.distance;
      planet.y = sin(planet.angle) * planet.distance;

      push();
      translate(planet.x, planet.y, 0);
      fill(planet.hue, 80, 90);
      noStroke();
      sphere(planet.size);
      pop();
    }
  }
}

function mousePressed() {
  if (!isAnimating) {
    isAnimating = true;
    loop();
  }
}
