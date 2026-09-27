let gradients = [];
let land;
let noiseScale = 0.01;
let time = 0;
let mouseRipple = { x: 0, y: 0, size: 0, maxRadius: 100 };

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  land = createGraphics(width, height);
  land.noStroke();
  
  // Generate initial gradients
  for (let i = 0; i < 50; i++) {
    gradients.push({
      x: random(width),
      y: random(height),
      size: random(100, 300),
      speed: random(0.001, 0.005),
      color: color(random(100, 255), random(100, 255), random(100, 255), 80),
      pulse: random(TWO_PI)
    });
  }
  
  // Draw the landmass
  land.background(30);
  land.fill(50, 100, 50);
  land.noStroke();
  land.rectMode(CENTER);
  for (let x = 0; x < width; x += 20) {
    for (let y = 0; y < height; y += 20) {
      let n = noise(x * noiseScale, y * noiseScale, time * 0.1) * 255;
      if (n > 120) {
        land.rect(x, y, 15, 15);
      }
    }
  }
}

function draw() {
  background(20);
  time += 0.01;
  
  // Draw the landmass
  image(land, -width/2, -height/2);
  
  // Draw gradients
  for (let i = 0; i < gradients.length; i++) {
    let g = gradients[i];
    
    // Update position
    g.x += sin(time * g.speed) * 0.3;
    g.y += cos(time * g.speed) * 0.3;
    
    // Update pulse
    g.pulse += 0.02;
    
    // Apply color with pulsing effect
    let alpha = map(sin(g.pulse), -1, 1, 40, 120);
    fill(red(g.color), green(g.color), blue(g.color), alpha);
    
    // Draw gradient using ellipse shape
    noStroke();
    beginShape(ELLIPSE);
    for (let a = 0; a < TWO_PI; a += 0.1) {
      let r = g.size * (0.8 + 0.2 * sin(g.pulse + a));
      let x = g.x + cos(a) * r;
      let y = g.y + sin(a) * r;
      vertex(x, y);
    }
    endShape(CLOSE);
  }
  
  // Draw mouse ripple if active
  if (mouseRipple.size > 0) {
    noFill();
    stroke(255, 150);
    strokeWeight(2);
    ellipse(mouseRipple.x, mouseRipple.y, mouseRipple.size);
    mouseRipple.size += 2;
    if (mouseRipple.size > mouseRipple.maxRadius) {
      mouseRipple.size = 0;
    }
  }
}

function mouseDragged() {
  // Create ripple effect
  mouseRipple.x = mouseX;
  mouseRipple.y = mouseY;
  mouseRipple.size = 1;
  
  // Create new gradients at mouse position
  for (let i = 0; i < 3; i++) {
    gradients.push({
      x: mouseX,
      y: mouseY,
      size: random(50, 150),
      speed: random(0.002, 0.006),
      color: color(random(100, 255), random(100, 255), random(100, 255), 120),
      pulse: random(TWO_PI)
    });
  }
  
  // Limit total gradients to prevent memory issues
  if (gradients.length > 150) {
    gradients.splice(0, 30);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
