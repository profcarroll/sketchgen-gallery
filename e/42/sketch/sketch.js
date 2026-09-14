let time = 0;
let buildings = [];
let plants = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  // Create buildings
  for (let i = 0; i < 50; i++) {
    buildings.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-1000, -300),
      w: random(40, 100),
      h: random(100, 400),
      d: random(40, 100),
      color: color(random(50, 150), random(50, 150), random(150, 255))
    });
  }

  // Create plants
  for (let i = 0; i < 200; i++) {
    plants.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-1000, -300),
      size: random(5, 30),
      color: color(random(50, 255), random(200, 255), random(50, 200)),
      pulse: random(0, TWO_PI)
    });
  }
}

function draw() {
  background(0);
  
  time += 0.005;
  
  // Sky color based on time
  let skyColor = lerpColor(color(255, 255, 255), color(10, 10, 40), sin(time) * 0.5 + 0.5);
  if (sin(time) > 0.8) {
    skyColor = color(255, 100, 0); // Sunrise
  } else if (sin(time) < -0.8) {
    skyColor = color(200, 50, 150); // Sunset
  }
  
  // Ambient light
  let ambientLightLevel = map(sin(time), -1, 1, 0.2, 0.8);
  ambientLight(skyColor.levels[0], skyColor.levels[1], skyColor.levels[2]);
  
  // Directional light (sun)
  let sunAngle = time;
  let sunX = cos(sunAngle) * 500;
  let sunY = sin(sunAngle) * 500;
  directionalLight(255, 255, 255, sunX, sunY, -100);
  
  // Draw buildings
  for (let building of buildings) {
    push();
    translate(building.x, building.y, building.z);
    
    // Reflective surface
    fill(building.color);
    specularMaterial(255, 200, 200);
    box(building.w, building.h, building.d);
    
    pop();
  }
  
  // Draw plants
  for (let plant of plants) {
    push();
    translate(plant.x, plant.y, plant.z);
    
    // Pulsing glow effect
    let pulse = sin(time * 2 + plant.pulse) * 0.5 + 0.5;
    let glow = map(pulse, 0, 1, 0.8, 1.5);
    
    fill(plant.color.levels[0], plant.color.levels[1], plant.color.levels[2], 200);
    noStroke();
    
    // Glow effect
    for (let i = 0; i < 3; i++) {
      let size = plant.size * (i + 1) * glow;
      sphere(size);
    }
    
    pop();
  }
  
  // Draw sun/moon
  push();
  translate(sunX, sunY, -100);
  noStroke();
  fill(255, 200, 100);
  sphere(50);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
