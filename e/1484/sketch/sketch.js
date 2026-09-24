let grains = [];
const totalGrains = 3000;
let windForce = 0;
let windDirection = 1;
let windSpeed = 0.005;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create mandala structure with grains
  for (let i = 0; i < totalGrains; i++) {
    const angle = random(TWO_PI);
    const radius = random(50, min(width, height) * 0.4);
    const x = width/2 + cos(angle) * radius;
    const y = height/2 + sin(angle) * radius;
    
    // Add some variation to create intricate patterns
    const variation = map(noise(x * 0.01, y * 0.01), 0, 1, -5, 5);
    const size = map(noise(x * 0.02, y * 0.02), 0, 1, 1, 3);
    
    grains.push({
      x: x,
      y: y,
      originalX: x,
      originalY: y,
      size: size,
      angle: angle,
      radius: radius,
      color: color(random(20, 40), random(30, 60), random(40, 80)),
      stability: random(0.95, 1),
      vibration: 0,
      detached: false
    });
  }
  
  // Add inner mandala details
  for (let i = 0; i < totalGrains * 0.3; i++) {
    const angle = random(TWO_PI);
    const radius = random(20, 150);
    const x = width/2 + cos(angle) * radius;
    const y = height/2 + sin(angle) * radius;
    
    grains.push({
      x: x,
      y: y,
      originalX: x,
      originalY: y,
      size: map(noise(x * 0.02, y * 0.02), 0, 1, 0.5, 2),
      angle: angle,
      radius: radius,
      color: color(random(30, 50), random(40, 70), random(30, 60)),
      stability: random(0.9, 0.98),
      vibration: 0,
      detached: false
    });
  }
}

function draw() {
  background(0, 0, 0);
  
  // Gradually increase wind force over time
  windForce = min(windForce + windSpeed, 0.3);
  
  // Apply wind to grains
  for (let grain of grains) {
    if (grain.detached) continue;
    
    // Add vibration effect
    grain.vibration = sin(frameCount * 0.05 + grain.angle) * 0.5;
    
    // Calculate displacement from original position
    const dx = grain.originalX - grain.x;
    const dy = grain.originalY - grain.y;
    
    // Apply wind force (more force on outer grains)
    const force = windForce * (1 - grain.radius / max(width, height));
    const windX = cos(windDirection) * force;
    const windY = sin(windDirection) * force;
    
    // Apply displacement and vibration
    grain.x += windX + dx * 0.01 + grain.vibration * 0.5;
    grain.y += windY + dy * 0.01 + grain.vibration * 0.5;
    
    // Detach grains based on stability and displacement
    const distance = dist(grain.originalX, grain.originalY, grain.x, grain.y);
    if (distance > 30 && random() < 0.001) {
      grain.detached = true;
    }
  }
  
  // Draw grains with some transparency to show structure
  for (let grain of grains) {
    if (!grain.detached) {
      noStroke();
      fill(grain.color);
      ellipse(grain.x, grain.y, grain.size);
    }
  }
  
  // Draw detached grains as static particles
  let detachedCount = 0;
  for (let grain of grains) {
    if (grain.detached) {
      detachedCount++;
      noStroke();
      fill(grain.color);
      ellipse(grain.x, grain.y, grain.size * 0.5);
    }
  }
  
  // End when all grains are detached
  if (detachedCount >= totalGrains * 0.95) {
    noLoop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
