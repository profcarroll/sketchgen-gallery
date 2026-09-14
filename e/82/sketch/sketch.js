let time = 0;
let raindrops = [];
let plants = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create raindrops
  for (let i = 0; i < 200; i++) {
    raindrops.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speed: random(2, 5),
      opacity: random(0.3, 0.7)
    });
  }
  
  // Create bioluminescent plants
  for (let i = 0; i < 50; i++) {
    plants.push({
      x: random(width),
      y: random(height * 0.6, height),
      size: random(10, 30),
      pulse: random(TWO_PI),
      hue: random(120, 180) // Blue-green hues
    });
  }
}

function draw() {
  time += 0.01;
  
  // Create atmospheric color based on time of day
  let sunAngle = (time % TWO_PI);
  let sunX = map(cos(sunAngle), -1, 1, 0, width);
  let sunY = map(sin(sunAngle), -1, 1, height * 0.3, height * 0.7);
  
  // Background with atmospheric gradient
  background(240, 5, 10); // Dark blue-gray
  
  // Draw reflective cityscape
  drawCityscape();
  
  // Draw raindrops
  drawRaindrops();
  
  // Draw bioluminescent plants
  drawPlants();
  
  // Update and draw ripples
  updateRipples();
}

function drawCityscape() {
  // Draw buildings with wet, reflective surfaces
  for (let i = 0; i < 30; i++) {
    let x = map(i, 0, 30, 0, width);
    let heightBuilding = random(100, 300);
    
    // Building base (wet stone)
    fill(200, 20, 30);
    noStroke();
    rect(x, height - heightBuilding, 40, heightBuilding);
    
    // Wet reflective surface
    fill(200, 10, 80, 0.5);
    rect(x + 2, height - heightBuilding + 2, 36, heightBuilding * 0.3);
    
    // Windows (reflective)
    fill(60, 100, 100, 0.7);
    for (let j = 0; j < 5; j++) {
      rect(x + 8 + j * 8, height - heightBuilding + 20 + j * 30, 4, 20);
    }
    
    // Reflection on the ground
    fill(200, 10, 70, 0.2);
    rect(x, height - 5, 40, 5);
  }
}

function drawRaindrops() {
  for (let drop of raindrops) {
    // Move raindrop
    drop.y += drop.speed;
    if (drop.y > height) {
      drop.y = random(-20, 0);
      drop.x = random(width);
    }
    
    // Draw raindrop with glow effect
    noStroke();
    fill(200, 100, 100, drop.opacity);
    ellipse(drop.x, drop.y, drop.size);
    
    // Draw reflection on ground
    if (drop.y > height * 0.8) {
      fill(200, 50, 80, drop.opacity * 0.3);
      ellipse(drop.x, height, drop.size * 0.5);
    }
  }
}

function drawPlants() {
  for (let plant of plants) {
    // Pulsing bioluminescence
    let pulse = sin(plant.pulse + time * 2) * 0.5 + 0.5;
    let glow = map(pulse, 0, 1, 0.3, 1);
    
    // Draw plant base
    fill(plant.hue, 80, 60);
    noStroke();
    ellipse(plant.x, plant.y, plant.size * 0.8);
    
    // Draw glow effect
    fill(plant.hue, 100, 100, glow * 0.5);
    ellipse(plant.x, plant.y, plant.size);
    
    // Update pulse
    plant.pulse += 0.05;
    
    // Draw light ripples
    if (pulse > 0.8) {
      createRipple(plant.x, plant.y, plant.hue);
    }
  }
}

let ripples = [];

function createRipple(x, y, hue) {
  ripples.push({
    x: x,
    y: y,
    radius: 0,
    maxRadius: random(50, 100),
    alpha: 0.8,
    hue: hue
  });
}

function updateRipples() {
  for (let i = ripples.length - 1; i >= 0; i--) {
    let ripple = ripples[i];
    ripple.radius += 2;
    ripple.alpha -= 0.02;
    
    if (ripple.alpha <= 0) {
      ripples.splice(i, 1);
      continue;
    }
    
    // Draw ripple with radial gradient
    noFill();
    stroke(ripple.hue, 100, 100, ripple.alpha);
    strokeWeight(2);
    ellipse(ripple.x, ripple.y, ripple.radius * 2);
  }
}

function drawRaindrops() {
  for (let drop of raindrops) {
    // Move raindrop
    drop.y += drop.speed;
    if (drop.y > height) {
      drop.y = random(-20, 0);
      drop.x = random(width);
    }
    
    // Draw raindrop with glow effect
    noStroke();
    fill(200, 100, 100, drop.opacity);
    ellipse(drop.x, drop.y, drop.size);
    
    // Draw reflection on ground
    if (drop.y > height * 0.8) {
      fill(200, 50, 80, drop.opacity * 0.3);
      ellipse(drop.x, height, drop.size * 0.5);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
