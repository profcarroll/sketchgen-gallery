let time = 0;
let buildings = [];
let plants = [];
let plankton = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create buildings
  for (let i = 0; i < 30; i++) {
    buildings.push({
      x: random(width),
      y: random(height * 0.3, height * 0.7),
      w: random(40, 120),
      h: random(80, 300),
      color: color(random(80, 150), random(60, 120), random(50, 100))
    });
  }
  
  // Create plants
  for (let i = 0; i < 50; i++) {
    plants.push({
      x: random(width),
      y: height,
      size: random(10, 40),
      color: color(random(30, 80), random(120, 200), random(30, 80)),
      growth: random(0.5, 2)
    });
  }
  
  // Create plankton
  for (let i = 0; i < 100; i++) {
    plankton.push({
      x: random(width),
      y: random(height * 0.6, height),
      size: random(2, 8),
      speed: random(0.1, 0.5),
      hue: random(30, 60),
      pulse: random(PI)
    });
  }
}

function draw() {
  time += 0.002;
  
  // Background gradient
  let bg = lerpColor(color(20, 30, 60), color(100, 150, 200), (sin(time) + 1) / 2);
  background(bg);
  
  // Draw sky glow
  drawSkyGlow();
  
  // Draw water reflections
  drawReflections();
  
  // Draw buildings
  drawBuildings();
  
  // Draw plants
  drawPlants();
  
  // Draw plankton
  drawPlankton();
}

function drawSkyGlow() {
  let sun = (sin(time) + 1) / 2;
  let skyColor = lerpColor(color(10, 15, 40), color(200, 220, 255), sun);
  
  // Sun
  fill(255, 255, 200, 180);
  noStroke();
  ellipse(width * 0.8, height * 0.2, 80 + sin(time * 3) * 20, 80 + sin(time * 3) * 20);
  
  // Sky glow
  for (let i = 0; i < 50; i++) {
    let a = map(i, 0, 50, 0, PI);
    let r = map(i, 0, 50, 100, 300);
    let x = width * 0.8 + cos(a) * r;
    let y = height * 0.2 + sin(a) * r;
    let c = lerpColor(color(255, 255, 200, 0), color(255, 255, 200, 80), 
                     (sin(time * 2 + a) + 1) / 2);
    fill(c);
    ellipse(x, y, 10, 10);
  }
}

function drawReflections() {
  // Water pools
  for (let i = 0; i < 5; i++) {
    let x = random(width * 0.3, width * 0.7);
    let y = height * 0.6 + sin(time + i) * 10;
    let w = random(80, 200);
    let h = random(10, 30);
    
    fill(255, 255, 255, 30);
    ellipse(x, y, w, h);
  }
}

function drawBuildings() {
  for (let building of buildings) {
    // Building body
    fill(building.color);
    rect(building.x, building.y, building.w, building.h);
    
    // Windows
    fill(255, 255, 200, 150);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 6; j++) {
        let winX = building.x + 5 + j * (building.w - 10) / 5;
        let winY = building.y + 10 + i * (building.h - 20) / 3;
        let size = random(4, 8);
        if (random() > 0.3) {
          ellipse(winX, winY, size, size);
        }
      }
    }
    
    // Roof
    fill(darkenColor(building.color, 30));
    rect(building.x - 5, building.y, building.w + 10, 10);
  }
}

function drawPlants() {
  for (let plant of plants) {
    let growth = plant.growth * (sin(time * 2) + 1) / 2;
    let size = plant.size * growth;
    
    // Stem
    fill(plant.color);
    rect(plant.x - 2, plant.y - size * 0.8, 4, size * 0.8);
    
    // Leaves
    fill(darkenColor(plant.color, 20));
    ellipse(plant.x, plant.y - size * 0.6, size * 0.8, size * 0.5);
    ellipse(plant.x + size * 0.4, plant.y - size * 0.7, size * 0.5, size * 0.3);
    ellipse(plant.x - size * 0.4, plant.y - size * 0.7, size * 0.5, size * 0.3);
    
    // Bioluminescent glow
    let glow = map(sin(time * 3 + plant.x), -1, 1, 0, 100);
    fill(255, 255, 100, glow);
    ellipse(plant.x, plant.y - size * 0.6, size * 0.4, size * 0.3);
  }
}

function drawPlankton() {
  for (let p of plankton) {
    // Move plankton
    p.x += sin(time + p.pulse) * p.speed;
    p.y += cos(time + p.pulse) * p.speed;
    
    // Wrap around screen
    if (p.x < -20) p.x = width + 20;
    if (p.x > width + 20) p.x = -20;
    if (p.y < -20) p.y = height + 20;
    if (p.y > height + 20) p.y = -20;
    
    // Pulsing glow
    let pulse = sin(time * 3 + p.pulse) * 0.5 + 0.5;
    let size = p.size * pulse;
    
    fill(p.hue, 100, 100, 180);
    ellipse(p.x, p.y, size, size);
    
    // Add secondary glow
    fill(p.hue, 100, 100, 60);
    ellipse(p.x, p.y, size * 2, size * 2);
    
    p.pulse += 0.05;
  }
}

function darkenColor(c, amount) {
  let r = red(c);
  let g = green(c);
  let b = blue(c);
  return color(r - amount, g - amount, b - amount);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
