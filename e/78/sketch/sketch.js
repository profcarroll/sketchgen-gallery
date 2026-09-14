let time = 0;
let buildings = [];
let flora = [];
let rippleOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create buildings
  for (let i = 0; i < 50; i++) {
    buildings.push({
      x: random(width),
      y: random(height * 0.3, height * 0.7),
      w: random(40, 120),
      h: random(100, 300),
      color: color(random(50, 100), random(50, 100), random(80, 150))
    });
  }
  
  // Create flora
  for (let i = 0; i < 100; i++) {
    flora.push({
      x: random(width),
      y: random(height * 0.7, height),
      size: random(5, 20),
      pulse: random(TWO_PI),
      color: color(random(100, 255), random(100, 255), random(100, 255))
    });
  }
}

function draw() {
  time += 0.005;
  rippleOffset += 0.03;
  
  // Calculate ambient light based on time
  let sunAngle = (time % TWO_PI);
  let sunY = map(sin(sunAngle), -1, 1, height * 0.8, height * 0.2);
  let sunX = map(cos(sunAngle), -1, 1, width * 0.2, width * 0.8);
  
  // Sky gradient
  for (let y = 0; y < height; y++) {
    let t = map(y, 0, height, 0, 1);
    let r, g, b;
    
    if (t < 0.5) {
      r = lerp(20, 40, t * 2);
      g = lerp(30, 60, t * 2);
      b = lerp(80, 120, t * 2);
    } else {
      r = lerp(40, 10, (t - 0.5) * 2);
      g = lerp(60, 30, (t - 0.5) * 2);
      b = lerp(120, 80, (t - 0.5) * 2);
    }
    
    stroke(r, g, b);
    line(0, y, width, y);
  }
  
  // Draw buildings
  for (let building of buildings) {
    fill(building.color);
    rect(building.x, building.y, building.w, building.h);
    
    // Reflections
    let reflectionY = building.y + building.h;
    let reflectionHeight = height - reflectionY;
    
    if (reflectionHeight > 0) {
      fill(red(building.color), green(building.color), blue(building.color), 50);
      rect(building.x, reflectionY, building.w, reflectionHeight);
      
      // Ripple effect on wet surfaces
      let ripple = sin(rippleOffset + building.x * 0.01) * 2;
      fill(red(building.color), green(building.color), blue(building.color), 30);
      rect(building.x - ripple, reflectionY, building.w + ripple * 2, reflectionHeight);
    }
  }
  
  // Draw flora
  for (let plant of flora) {
    let pulse = sin(plant.pulse + time * 2) * 0.5 + 0.5;
    let size = plant.size * pulse;
    
    fill(plant.color, 150);
    noStroke();
    ellipse(plant.x, plant.y, size, size);
    
    // Glow effect
    fill(plant.color, 30);
    ellipse(plant.x, plant.y, size * 2, size * 2);
  }
  
  // Update flora pulse
  for (let plant of flora) {
    plant.pulse += 0.02;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
