let sun;
let planets = [];
let stars = [];
let cameraAngle = 0;
let isClicked = false;

function setup() {
  createCanvas(800, 600, WEBGL);
  
  // Create the sun
  sun = {
    x: 0,
    y: 0,
    z: 0,
    radius: 50,
    color: [255, 200, 0]
  };
  
  // Create planets with different properties
  const planetData = [
    { radius: 8, distance: 100, speed: 0.01, color: [160, 160, 160], ring: false },
    { radius: 12, distance: 150, speed: 0.007, color: [200, 100, 50], ring: true, ringColor: [180, 140, 90] },
    { radius: 10, distance: 200, speed: 0.005, color: [100, 150, 200], ring: false },
    { radius: 15, distance: 250, speed: 0.003, color: [200, 180, 100], ring: true, ringColor: [160, 140, 80] },
    { radius: 7, distance: 300, speed: 0.002, color: [150, 200, 100], ring: false }
  ];
  
  for (let i = 0; i < planetData.length; i++) {
    planets.push({
      ...planetData[i],
      angle: random(TWO_PI),
      x: 0,
      y: 0,
      z: 0
    });
  }
  
  // Create starfield
  for (let i = 0; i < 500; i++) {
    stars.push({
      x: random(-width * 2, width * 2),
      y: random(-height * 2, height * 2),
      z: random(-1000, -100),
      size: random(0.5, 2)
    });
  }
}

function draw() {
  background(0);
  
  // Set up lighting
  pointLight(255, 255, 255, sun.x, sun.y, sun.z);
  ambientLight(30);
  
  // Rotate camera slowly
  cameraAngle += 0.002;
  rotateY(cameraAngle);
  
  // Draw stars
  stroke(255);
  strokeWeight(1);
  for (let star of stars) {
    push();
    translate(star.x, star.y, star.z);
    point(0, 0, 0);
    pop();
  }
  
  // Draw sun
  push();
  fill(sun.color[0], sun.color[1], sun.color[2]);
  noStroke();
  sphere(sun.radius);
  pop();
  
  // Draw planets and their rings
  for (let planet of planets) {
    planet.angle += planet.speed;
    planet.x = cos(planet.angle) * planet.distance;
    planet.z = sin(planet.angle) * planet.distance;
    
    push();
    translate(planet.x, 0, planet.z);
    
    // Draw planet
    fill(planet.color[0], planet.color[1], planet.color[2]);
    noStroke();
    sphere(planet.radius);
    
    // Draw rings if applicable
    if (planet.ring) {
      stroke(planet.ringColor[0], planet.ringColor[1], planet.ringColor[2]);
      noFill();
      ellipse(0, 0, planet.radius * 3, planet.radius * 1.5);
    }
    
    pop();
  }
  
  // Animate on click
  if (isClicked) {
    for (let planet of planets) {
      planet.angle += 0.01;
    }
  }
}

function mousePressed() {
  isClicked = true;
}
