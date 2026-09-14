let time = 0;
let buildings = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Generate buildings
  for (let i = 0; i < 50; i++) {
    buildings.push({
      x: random(width),
      w: random(20, 80),
      h: random(100, height/2),
      color: color(random(50, 100), random(50, 100), random(50, 100))
    });
  }
}

function draw() {
  time += 0.001;
  
  // Sky gradient based on time
  let skyColor = lerpColor(color(20, 30, 60), color(255, 200, 100), (sin(time) + 1) / 2);
  background(skyColor);
  
  // Draw horizon
  fill(0, 0, 20);
  rect(0, height/2, width, height/2);
  
  // Draw buildings
  for (let b of buildings) {
    fill(b.color);
    rect(b.x, height - b.h, b.w, b.h);
    
    // Add windows
    let windowCount = floor(b.w / 10) * floor(b.h / 20);
    for (let i = 0; i < windowCount; i++) {
      let winX = b.x + random(b.w - 10);
      let winY = height - b.h + random(b.h - 10);
      
      // Pulsing window light
      let pulse = sin(time * 2 + i) * 0.5 + 0.5;
      fill(255, 255, 200, 100 * pulse);
      rect(winX, winY, 8, 8);
    }
  }
  
  // Sun/Moon
  let sunX = width/2 + cos(time) * width/3;
  let sunY = height/4 + sin(time) * height/6;
  fill(255, 255, 100);
  ellipse(sunX, sunY, 50, 50);
  
  // Stars at night
  if (time % (TWO_PI) < PI) {
    fill(255, 255, 255, 100);
    for (let i = 0; i < 100; i++) {
      let x = random(width);
      let y = random(height/2);
      ellipse(x, y, 2, 2);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
