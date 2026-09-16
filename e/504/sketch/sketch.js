let planets = [];
let sun;
let cameraAngle = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  
  sun = {
    radius: 50,
    color: [255, 200, 0],
    x: 0,
    y: 0,
    z: 0
  };

  planets.push({
    name: "Mercury",
    radius: 5,
    distance: 80,
    speed: 0.02,
    color: [160, 160, 160],
    angle: random(TWO_PI)
  });

  planets.push({
    name: "Venus",
    radius: 8,
    distance: 110,
    speed: 0.015,
    color: [255, 100, 100],
    angle: random(TWO_PI)
  });

  planets.push({
    name: "Earth",
    radius: 9,
    distance: 150,
    speed: 0.01,
    color: [100, 150, 255],
    angle: random(TWO_PI)
  });

  planets.push({
    name: "Mars",
    radius: 7,
    distance: 190,
    speed: 0.008,
    color: [255, 100, 50],
    angle: random(TWO_PI)
  });

  planets.push({
    name: "Jupiter",
    radius: 20,
    distance: 250,
    speed: 0.005,
    color: [200, 150, 100],
    angle: random(TWO_PI)
  });

  planets.push({
    name: "Saturn",
    radius: 18,
    distance: 320,
    speed: 0.003,
    color: [220, 220, 150],
    angle: random(TWO_PI),
    hasRings: true
  });
}

function draw() {
  background(0);
  
  // Ambient light for the entire scene
  ambientLight(50);

  // Sun light
  pointLight(255, 255, 255, sun.x, sun.y, sun.z);
  
  // Rotate camera
  cameraAngle += 0.002;
  rotateY(cameraAngle);

  // Draw the Sun
  push();
  fill(sun.color[0], sun.color[1], sun.color[2]);
  noStroke();
  sphere(sun.radius);
  pop();

  // Draw orbit paths
  stroke(100, 100, 100, 50);
  noFill();
  for (let planet of planets) {
    ellipse(0, 0, planet.distance * 2, planet.distance * 2);
  }

  // Update and draw planets
  for (let planet of planets) {
    planet.angle += planet.speed;
    
    let x = cos(planet.angle) * planet.distance;
    let y = sin(planet.angle) * planet.distance;
    
    push();
    translate(x, y, 0);
    fill(planet.color[0], planet.color[1], planet.color[2]);
    noStroke();
    sphere(planet.radius);
    
    // Draw Saturn's rings
    if (planet.hasRings) {
      stroke(180, 180, 150);
      noFill();
      ellipse(0, 0, planet.radius * 2.5, planet.radius * 1.5);
    }
    pop();
  }
}
