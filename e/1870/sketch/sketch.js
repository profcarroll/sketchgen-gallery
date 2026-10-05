let planets = [];
let stars = [];
let isAnimating = false;
let cameraAngle = 0;
let orbitPoints = [];
let trailPoints = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create a central star (Sun)
  stars.push({
    x: 0,
    y: 0,
    z: 0,
    radius: 20,
    hue: 30,
    brightness: 100
  });

  // Realistic scaled planets with orbital speeds and sizes based on relative scales
  const planetData = [
    { distance: 60, size: 2.5, hue: 150, speed: 0.01, rotationSpeed: 0.005, name: "Venus" },
    { distance: 90, size: 3.5, hue: 200, speed: 0.008, rotationSpeed: 0.004, name: "Earth" },
    { distance: 120, size: 4.0, hue: 250, speed: 0.006, rotationSpeed: 0.003, name: "Mars" },
    { distance: 160, size: 8.0, hue: 300, speed: 0.005, rotationSpeed: 0.002, name: "Jupiter" },
    { distance: 200, size: 6.5, hue: 40, speed: 0.004, rotationSpeed: 0.001, name: "Saturn" },
    { distance: 240, size: 5.0, hue: 100, speed: 0.003, rotationSpeed: 0.0005, name: "Uranus" },
    { distance: 280, size: 4.5, hue: 180, speed: 0.002, rotationSpeed: 0.0003, name: "Neptune" }
  ];

  for (let i = 0; i < planetData.length; i++) {
    const data = planetData[i];
    planets.push({
      angle: random(TWO_PI),
      distance: data.distance,
      size: data.size,
      hue: data.hue,
      speed: data.speed,
      rotationSpeed: data.rotationSpeed,
      x: 0,
      y: 0,
      z: 0,
      rotation: 0,
      name: data.name
    });
  }

  // Precompute orbit paths for glowing trails
  for (let i = 0; i < planets.length; i++) {
    orbitPoints[i] = [];
    for (let j = 0; j < 100; j++) {
      const angle = map(j, 0, 99, 0, TWO_PI);
      const x = cos(angle) * planets[i].distance;
      const y = sin(angle) * planets[i].distance;
      orbitPoints[i].push({ x, y });
    }
  }

  // Initialize trail points
  for (let i = 0; i < planets.length; i++) {
    trailPoints[i] = [];
    for (let j = 0; j < 50; j++) {
      trailPoints[i].push({ x: 0, y: 0 });
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
  for (let i = 0; i < orbitPoints.length; i++) {
    beginShape();
    for (let j = 0; j < orbitPoints[i].length; j++) {
      const point = orbitPoints[i][j];
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
      planet.rotation += planet.rotationSpeed;

      planet.x = cos(planet.angle) * planet.distance;
      planet.y = sin(planet.angle) * planet.distance;

      // Update trail points
      for (let j = trailPoints[i].length - 1; j > 0; j--) {
        trailPoints[i][j] = trailPoints[i][j - 1];
      }
      trailPoints[i][0] = { x: planet.x, y: planet.y };

      // Draw trail
      stroke(planet.hue, 80, 90, 0.5);
      noFill();
      beginShape();
      for (let j = 0; j < trailPoints[i].length; j++) {
        const point = trailPoints[i][j];
        vertex(point.x, point.y, 0);
      }
      endShape();

      push();
      translate(planet.x, planet.y, 0);
      rotateY(planet.rotation);
      fill(planet.hue, 80, 90);
      noStroke();
      sphere(planet.size);
      pop();
    }
  } else {
    // Draw a static view with no trails
    for (let i = 0; i < planets.length; i++) {
      const planet = planets[i];
      planet.x = cos(planet.angle) * planet.distance;
      planet.y = sin(planet.angle) * planet.distance;

      push();
      translate(planet.x, planet.y, 0);
      rotateY(planet.rotation);
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
