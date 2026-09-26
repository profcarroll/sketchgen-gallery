let grains = [];
const totalGrains = 2000;
let windForce = 0;
let windDirection = 1;
let windSpeed = 0.005;
let fracturePoint = 0.3;
let isFracturing = false;
let centralPillar = [];

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
      detached: false,
      attached: true
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
      detached: false,
      attached: true
    });
  }
}

function draw() {
  background(0, 0, 0);
  
  // Gradually increase wind force over time
  windForce = min(windForce + windSpeed, 0.3);
  
  // Check if it's time to fracture the structure
  if (windForce > fracturePoint && !isFracturing) {
    isFracturing = true;
  }
  
  let detachedCount = 0;
  
  for (let grain of grains) {
    if (grain.detached) {
      detachedCount++;
      continue;
    }
    
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
    if (isFracturing) {
      const distance = dist(grain.originalX, grain.originalY, grain.x, grain.y);
      if (distance > 20 && random() < 0.005) {
        grain.detached = true;
        grain.attached = false;
        
        // Add to central pillar
        centralPillar.push({
          x: grain.x,
          y: grain.y,
          size: grain.size,
          color: grain.color,
          targetX: width/2,
          targetY: height/2
        });
      }
    }
    
    // Apply gravity to detached grains
    if (grain.detached) {
      grain.x += random(-0.5, 0.5);
      grain.y += 1;
    }
  }
  
  // Draw attached grains with some transparency to show structure
  for (let grain of grains) {
    if (grain.attached && !grain.detached) {
      noStroke();
      fill(grain.color);
      ellipse(grain.x, grain.y, grain.size);
    }
  }
  
  // Draw detached grains as static particles
  for (let grain of grains) {
    if (grain.detached) {
      noStroke();
      fill(grain.color);
      ellipse(grain.x, grain.y, grain.size * 0.5);
    }
  }
  
  // Update and draw central pillar
  for (let i = centralPillar.length - 1; i >= 0; i--) {
    let grain = centralPillar[i];
    
    // Move towards center point
    const dx = width/2 - grain.x;
    const dy = height/2 - grain.y;
    const distance = sqrt(dx*dx + dy*dy);
    
    if (distance > 1) {
      grain.x += dx * 0.05;
      grain.y += dy * 0.05;
    }
    
    // Draw the grain
    noStroke();
    fill(grain.color);
    ellipse(grain.x, grain.y, grain.size);
    
    // Remove if reached center
    if (distance < 2) {
      centralPillar.splice(i, 1);
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
