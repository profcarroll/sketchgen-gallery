let planets = [];
let sun;
let angle = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  
  sun = {
    radius: 50,
    color: [255, 204, 0],
    rotationSpeed: 0.002
  };
  
  planets = [
    { name: "Mercury", radius: 5, distance: 80, speed: 0.02, color: [169, 169, 169] },
    { name: "Venus", radius: 8, distance: 110, speed: 0.015, color: [255, 183, 77] },
    { name: "Earth", radius: 9, distance: 150, speed: 0.01, color: [65, 105, 225] },
    { name: "Mars", radius: 7, distance: 190, speed: 0.008, color: [220, 20, 60] },
    { name: "Jupiter", radius: 20, distance: 250, speed: 0.005, color: [210, 180, 140] },
    { name: "Saturn", radius: 17, distance: 320, speed: 0.003, color: [210, 180, 140] },
    { name: "Uranus", radius: 12, distance: 370, speed: 0.002, color: [173, 216, 230] },
    { name: "Neptune", radius: 12, distance: 420, speed: 0.001, color: [65, 105, 225] }
  ];
}

function draw() {
  background(0);
  
  // Rotate the whole scene
  rotateY(angle);
  
  // Draw sun
  push();
  fill(sun.color[0], sun.color[1], sun.color[2]);
  noStroke();
  sphere(sun.radius);
  pop();
  
  // Draw planets
  for (let planet of planets) {
    push();
    // Position planet
    let x = cos(planet.speed * frameCount) * planet.distance;
    let y = sin(planet.speed * frameCount) * planet.distance;
    
    translate(x, 0, y);
    
    // Rotate planet on its axis
    rotateY(planet.speed * frameCount * 0.5);
    
    fill(planet.color[0], planet.color[1], planet.color[2]);
    noStroke();
    sphere(planet.radius);
    pop();
  }
  
  // Update angle for rotation of the whole system
  if (mouseIsPressed) {
    angle += 0.005;
  } else {
    angle += 0.001; // Slow rotation when not pressed
  }
}

function mousePressed() {
  // Animation starts on mouse press
}
