let buildings = [];
let plants = [];
let time = 0;
let sun;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Generate buildings
  for (let i = 0; i < 50; i++) {
    buildings.push({
      x: random(width),
      y: random(height * 0.3, height * 0.8),
      w: random(20, 80),
      h: random(100, 400),
      depth: random(5, 30)
    });
  }
  
  // Generate plants
  for (let i = 0; i < 100; i++) {
    plants.push({
      x: random(width),
      y: random(height * 0.5, height),
      size: random(5, 20),
      sway: random(TWO_PI),
      swaySpeed: random(0.01, 0.03)
    });
  }
  
  sun = createVector(0, 0);
}

function draw() {
  time += 0.005;
  
  // Calculate sun position (circular orbit)
  sun.x = width * 0.5 + cos(time) * width * 0.4;
  sun.y = height * 0.3 + sin(time) * height * 0.2;
  
  // Background gradient based on time of day
  let bgHue = (time * 30) % 360;
  let bgColor = color(bgHue, 80, 20);
  background(bgColor);
  
  // Draw sky gradient
  drawSkyGradient();
  
  // Draw buildings
  drawBuildings();
  
  // Draw plants
  drawPlants();
  
  // Draw sun
  drawSun();
}

function drawSkyGradient() {
  for (let y = 0; y < height * 0.5; y++) {
    let t = map(y, 0, height * 0.5, 0, 1);
    let hue = (time * 30 + t * 60) % 360;
    let sat = 70 - t * 40;
    let bright = 80 - t * 50;
    stroke(hue, sat, bright);
    line(0, y, width, y);
  }
}

function drawBuildings() {
  for (let building of buildings) {
    // Calculate light based on sun position
    let light = map(dist(building.x + building.w/2, building.y, sun.x, sun.y), 0, width, 1, 0.3);
    
    // Building base color
    let baseColor = color(240, 10, 50 * light);
    
    // Draw building with depth
    fill(baseColor);
    noStroke();
    rect(building.x, building.y, building.w, building.h);
    
    // Add windows
    fill(60, 80, 90 * light);
    for (let i = 0; i < building.h / 20; i++) {
      for (let j = 0; j < building.w / 15; j++) {
        if (random() > 0.3) {
          rect(building.x + j * 15, building.y + i * 20, 8, 12);
        }
      }
    }
    
    // Add roof details
    fill(240, 20, 30 * light);
    rect(building.x - 5, building.y, building.w + 10, 10);
  }
}

function drawPlants() {
  for (let plant of plants) {
    let sway = sin(time + plant.sway) * 0.5;
    
    // Draw stem
    stroke(120, 80, 30);
    strokeWeight(2);
    line(plant.x, plant.y, plant.x + sway, plant.y - plant.size);
    
    // Draw leaves
    noStroke();
    fill(100, 90, 40);
    ellipse(plant.x + sway, plant.y - plant.size, plant.size * 0.8, plant.size * 0.6);
    
    // Add subtle movement to leaves
    plant.sway += plant.swaySpeed;
  }
}

function drawSun() {
  let sunSize = 30 + sin(time * 2) * 10;
  let sunHue = (time * 30 + 30) % 360;
  
  noStroke();
  fill(sunHue, 100, 100);
  ellipse(sun.x, sun.y, sunSize, sunSize);
  
  // Sun glow
  for (let i = 0; i < 5; i++) {
    let size = sunSize + i * 10;
    let alpha = map(i, 0, 4, 30, 0);
    fill(sunHue, 100, 100, alpha);
    ellipse(sun.x, sun.y, size, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
