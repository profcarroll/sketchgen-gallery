let anemones = [];
let waterParticles = [];
let rocks = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create rocks
  for (let i = 0; i < 20; i++) {
    rocks.push({
      x: random(width),
      y: random(height * 0.6, height),
      size: random(30, 80),
      color: color(random(80, 120), random(70, 100), random(60, 90)),
      rotation: random(TWO_PI)
    });
  }
  
  // Create anemones
  for (let i = 0; i < 15; i++) {
    anemones.push({
      x: random(width),
      y: random(height * 0.6, height * 0.9),
      size: random(40, 80),
      color: color(random(200, 255), random(100, 200), random(150, 255)),
      openness: random(0.7, 1),
      speed: random(0.01, 0.03),
      time: random(TWO_PI)
    });
  }
  
  // Create water particles
  for (let i = 0; i < 200; i++) {
    waterParticles.push({
      x: random(width),
      y: random(height * 0.6, height),
      size: random(1, 3),
      speed: random(0.2, 0.8),
      angle: random(TWO_PI)
    });
  }
}

function draw() {
  background(10, 30, 60);
  
  // Draw seabed
  drawSeabed();
  
  // Draw water background
  drawWater();
  
  // Update and draw anemones
  for (let i = 0; i < anemones.length; i++) {
    updateAnemone(anemones[i]);
    drawAnemone(anemones[i]);
  }
}

function drawSeabed() {
  // Draw rocks
  for (let r of rocks) {
    push();
    translate(r.x, r.y);
    rotate(r.rotation);
    fill(r.color);
    ellipse(0, 0, r.size, r.size * 0.6);
    pop();
  }
  
  // Draw sand base
  fill(80, 100, 120);
  rect(0, height * 0.9, width, height * 0.1);
}

function drawWater() {
  // Draw shifting water particles
  for (let p of waterParticles) {
    p.x += cos(p.angle) * p.speed;
    p.y += sin(p.angle) * p.speed;
    
    if (p.x < 0 || p.x > width) p.angle = PI - p.angle;
    if (p.y < height * 0.6 || p.y > height) p.angle = -p.angle;
    
    fill(20, 100, 180, 100);
    ellipse(p.x, p.y, p.size);
  }
}

function updateAnemone(a) {
  a.time += a.speed;
  a.openness = map(sin(a.time), -1, 1, 0.6, 1);
  
  // Mouse interaction
  let d = dist(mouseX, mouseY, a.x, a.y);
  if (d < 300) {
    let ratio = map(d, 0, 300, 1, 0.2);
    a.openness *= ratio;
  }
}

function drawAnemone(a) {
  // Draw base
  fill(80, 120, 160, 150);
  ellipse(a.x, a.y + a.size * 0.4, a.size * 0.6, a.size * 0.3);
  
  // Draw tentacles
  noFill();
  stroke(a.color);
  strokeWeight(2);
  
  beginShape();
  for (let i = 0; i < 12; i++) {
    let angle = map(i, 0, 11, 0, TWO_PI);
    let radius = a.size * a.openness;
    let x = a.x + cos(angle + a.time) * radius;
    let y = a.y + sin(angle + a.time) * radius;
    vertex(x, y);
  }
  endShape(CLOSE);
  
  // Draw central body
  fill(a.color);
  noStroke();
  ellipse(a.x, a.y, a.size * a.openness * 0.3);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
