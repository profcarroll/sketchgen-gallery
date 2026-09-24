let umbrellas = [];
let rain = [];
let wind = 0;
let windDirection = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create initial umbrellas
  for (let i = 0; i < 30; i++) {
    umbrellas.push({
      x: random(width),
      y: random(height * 0.3, height * 0.7),
      radius: random(30, 80),
      color: color(random(100, 255), random(100, 255), random(100, 255)),
      angle: 0,
      speed: random(0.01, 0.03),
      open: false,
      targetAngle: random(PI/4, PI/2),
      sway: 0
    });
  }
  // Create rain drops
  for (let i = 0; i < 500; i++) {
    rain.push({
      x: random(width),
      y: random(-height, height),
      speed: random(3, 8),
      size: random(1, 3)
    });
  }
}

function draw() {
  background(40, 60, 100);
  
  // Update wind
  wind = sin(frameCount * 0.01) * 0.5;
  windDirection += random(-0.01, 0.01);
  
  // Draw ground
  fill(50, 70, 90);
  noStroke();
  rect(0, height * 0.7, width, height * 0.3);
  
  // Draw umbrellas
  for (let umbrella of umbrellas) {
    if (!umbrella.open) {
      umbrella.angle += umbrella.speed;
      if (umbrella.angle > umbrella.targetAngle) {
        umbrella.open = true;
      }
    } else {
      umbrella.sway = sin(frameCount * 0.05 + umbrella.x * 0.01) * wind * 0.5;
    }
    
    push();
    translate(umbrella.x, umbrella.y);
    rotate(umbrella.angle + umbrella.sway);
    
    // Draw umbrella canopy
    fill(umbrella.color);
    noStroke();
    ellipse(0, 0, umbrella.radius * 2, umbrella.radius);
    
    // Draw umbrella handle
    stroke(150, 100, 50);
    strokeWeight(3);
    line(0, umbrella.radius, 0, umbrella.radius + 30);
    
    pop();
  }
  
  // Draw rain
  for (let drop of rain) {
    drop.y += drop.speed;
    if (drop.y > height) {
      drop.y = random(-20, -5);
      drop.x = random(width);
    }
    
    stroke(200, 220, 255, 180);
    strokeWeight(drop.size);
    line(drop.x, drop.y, drop.x, drop.y + 5);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
