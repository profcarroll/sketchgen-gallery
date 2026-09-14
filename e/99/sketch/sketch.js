let planets = [];
let sun;
let isAnimating = false;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create the Sun
  sun = {
    radius: 50,
    color: color(40, 100, 100),
    light: createVector(0, 0, 0)
  };

  // Create planets with different properties
  planets.push({
    name: "Mercury",
    radius: 8,
    distance: 100,
    speed: 0.02,
    color: color(200, 50, 70),
    angle: random(TWO_PI)
  });

  planets.push({
    name: "Venus",
    radius: 14,
    distance: 150,
    speed: 0.015,
    color: color(30, 80, 90),
    angle: random(TWO_PI)
  });

  planets.push({
    name: "Earth",
    radius: 16,
    distance: 200,
    speed: 0.01,
    color: color(240, 100, 80),
    angle: random(TWO_PI)
  });

  planets.push({
    name: "Mars",
    radius: 12,
    distance: 250,
    speed: 0.008,
    color: color(0, 70, 80),
    angle: random(TWO_PI)
  });

  planets.push({
    name: "Jupiter",
    radius: 30,
    distance: 320,
    speed: 0.005,
    color: color(60, 90, 85),
    angle: random(TWO_PI)
  });

  planets.push({
    name: "Saturn",
    radius: 25,
    distance: 400,
    speed: 0.003,
    color: color(70, 80, 90),
    angle: random(TWO_PI),
    hasRings: true
  });

  planets.push({
    name: "Uranus",
    radius: 20,
    distance: 460,
    speed: 0.002,
    color: color(180, 90, 85),
    angle: random(TWO_PI)
  });

  planets.push({
    name: "Neptune",
    radius: 18,
    distance: 520,
    speed: 0.001,
    color: color(240, 90, 85),
    angle: random(TWO_PI)
  });
}

function draw() {
  background(0);
  
  // Ambient light
  ambientLight(30);

  // Dynamic lighting from sun
  pointLight(255, 255, 255, sun.light.x, sun.light.y, sun.light.z);

  // Rotate the whole system slowly
  rotateY(frameCount * 0.002);

  // Draw the Sun
  push();
  noStroke();
  fill(sun.color);
  sphere(sun.radius);
  pop();

  // Update sun's light position to simulate dynamic lighting
  sun.light.x = sin(frameCount * 0.01) * 500;
  sun.light.z = cos(frameCount * 0.01) * 500;

  // Draw planets and their orbits
  for (let i = 0; i < planets.length; i++) {
    let p = planets[i];

    // Update planet position
    p.angle += p.speed;
    
    let x = cos(p.angle) * p.distance;
    let z = sin(p.angle) * p.distance;
    
    push();
    translate(x, 0, z);
    
    // Add some subtle pulsing effect to the planets
    let pulse = sin(frameCount * 0.02 + i) * 0.1 + 1;
    scale(pulse);

    noStroke();
    fill(p.color);
    sphere(p.radius);

    // Draw Saturn's rings if applicable
    if (p.hasRings) {
      stroke(180, 50, 80);
      noFill();
      ellipse(0, 0, p.radius * 2.5, p.radius * 0.5);
    }

    pop();

    // Draw orbit path
    push();
    noFill();
    stroke(255, 10);
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.1) {
      let ox = cos(a) * p.distance;
      let oz = sin(a) * p.distance;
      vertex(ox, 0, oz);
    }
    endShape(CLOSE);
    pop();
  }

  // If mouse is pressed, animate the system
  if (isAnimating) {
    rotateY(frameCount * 0.005);
  }
}

function mousePressed() {
  isAnimating = true;
  noLoop(); // Stop automatic drawing to allow custom animation
  loop(); // Resume with new behavior
}
