let planets = [];
let sun;
let cameraAngle = 0;
let isAnimating = false;

function setup() {
  createCanvas(800, 600, WEBGL);
  
  sun = {
    radius: 50,
    color: [255, 200, 0],
    glow: 0
  };
  
  planets.push({
    name: "Mercury",
    radius: 8,
    distance: 100,
    speed: 0.02,
    color: [160, 160, 160],
    texture: createGraphics(100, 100),
    angle: random(TWO_PI)
  });
  
  planets.push({
    name: "Venus",
    radius: 14,
    distance: 150,
    speed: 0.015,
    color: [255, 150, 0],
    texture: createGraphics(100, 100),
    angle: random(TWO_PI)
  });
  
  planets.push({
    name: "Earth",
    radius: 16,
    distance: 200,
    speed: 0.01,
    color: [0, 100, 255],
    texture: createGraphics(100, 100),
    angle: random(TWO_PI)
  });
  
  planets.push({
    name: "Mars",
    radius: 12,
    distance: 250,
    speed: 0.008,
    color: [255, 50, 0],
    texture: createGraphics(100, 100),
    angle: random(TWO_PI)
  });
  
  for (let planet of planets) {
    planet.texture.noStroke();
    planet.texture.fill(planet.color);
    planet.texture.ellipse(50, 50, 100, 100);
    
    // Add some texture details
    planet.texture.fill(100);
    planet.texture.ellipse(30, 30, 20, 20);
    planet.texture.ellipse(70, 60, 15, 15);
  }
}

function draw() {
  background(0);
  
  // Ambient light from the sun
  ambientLight(255);
  
  // Dynamic lighting based on animation state
  if (isAnimating) {
    pointLight(255, 255, 255, 0, 0, 0);
  } else {
    pointLight(100, 100, 100, 0, 0, 0);
  }
  
  // Camera rotation
  cameraAngle += 0.002;
  rotateY(cameraAngle);
  
  // Draw sun
  push();
  fill(sun.color[0], sun.color[1], sun.color[2]);
  noStroke();
  sphere(sun.radius);
  
  // Sun glow effect
  if (isAnimating) {
    fill(255, 200, 0, 50);
    sphere(sun.radius * 1.5);
  }
  pop();
  
  // Draw planets
  for (let planet of planets) {
    push();
    rotateY(planet.angle);
    translate(planet.distance, 0, 0);
    
    if (isAnimating) {
      fill(255, 255, 255, 100);
      sphere(planet.radius + 5); // Glow effect
    }
    
    // Planet surface texture
    texture(planet.texture);
    noStroke();
    sphere(planet.radius);
    
    planet.angle += planet.speed;
    
    pop();
  }
  
  // Draw orbits
  if (!isAnimating) {
    for (let planet of planets) {
      push();
      rotateY(planet.angle);
      noFill();
      stroke(100, 100, 100, 30);
      sphere(planet.distance);
      pop();
    }
  }
}

function mousePressed() {
  isAnimating = true;
  noLoop(); // Prevent further animation during the dramatic sequence
  setTimeout(() => {
    isAnimating = false;
    loop(); // Resume normal orbiting
  }, 3000); // Animate for 3 seconds
}
