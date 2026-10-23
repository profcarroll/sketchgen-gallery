let machinery = [];
let vines = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create brass machinery components
  for (let i = 0; i < 150; i++) {
    machinery.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.001, 0.001),
      hue: random(30, 50), // Warm brass tones
      saturation: random(20, 40),
      brightness: random(60, 80),
      alpha: random(150, 200),
      speedX: random(-0.1, 0.1),
      speedY: random(-0.1, 0.1),
      trail: []
    });
  }
  
  // Create overgrown vines
  for (let i = 0; i < 300; i++) {
    vines.push({
      x: random(width),
      y: random(height),
      length: random(5, 20),
      angle: random(TWO_PI),
      speed: random(0.001, 0.003),
      hue: random(60, 80), // Greenish tones
      saturation: random(40, 60),
      brightness: random(30, 70),
      alpha: random(100, 150)
    });
  }
}

function draw() {
  // Dark, deep background to suggest subterranean space
  background(20, 15, 10);
  
  time += 0.001;

  // Draw vines with slow, organic motion
  for (let vine of vines) {
    let sway = sin(time * vine.speed + vine.angle) * 0.2;
    let currentHue = vine.hue + sin(time * 0.5) * 5;
    
    fill(currentHue, vine.saturation, vine.brightness, vine.alpha);
    push();
    translate(vine.x, vine.y);
    rotate(vine.angle + sway);
    rect(0, -vine.length/2, 2, vine.length);
    pop();
    
    // Update position slowly
    vine.x += sin(time * 0.1) * 0.5;
    vine.y += cos(time * 0.1) * 0.5;
    
    // Keep vines on canvas with wrapping
    if (vine.x < -20) vine.x = width + 20;
    if (vine.x > width + 20) vine.x = -20;
    if (vine.y < -20) vine.y = height + 20;
    if (vine.y > height + 20) vine.y = -20;
  }

  // Draw machinery components
  for (let part of machinery) {
    // Update rotation
    part.rotation += part.rotationSpeed;
    
    // Update position with slow drift
    part.x += part.speedX;
    part.y += part.speedY;
    
    // Keep on canvas with wrapping
    if (part.x < -part.size) part.x = width + part.size;
    if (part.x > width + part.size) part.x = -part.size;
    if (part.y < -part.size) part.y = height + part.size;
    if (part.y > height + part.size) part.y = -part.size;
    
    // Add current position to trail
    part.trail.push({x: part.x, y: part.y});
    if (part.trail.length > 15) {
      part.trail.shift();
    }
    
    // Draw trail
    for (let i = 0; i < part.trail.length; i++) {
      let point = part.trail[i];
      let trailAlpha = map(i, 0, part.trail.length, 0, part.alpha * 0.3);
      fill(part.hue, part.saturation, part.brightness, trailAlpha);
      ellipse(point.x, point.y, part.size * (i / part.trail.length) * 0.5);
    }
    
    // Draw main machinery piece
    push();
    translate(part.x, part.y);
    rotate(part.rotation);
    fill(part.hue, part.saturation, part.brightness, part.alpha);
    rect(-part.size/2, -part.size/2, part.size, part.size);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
