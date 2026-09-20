let noodleCount = 150;
let noodlePositions = [];
let noodleVelocities = [];
let noodleLengths = [];
let noodleAngles = [];
let cheeseParticles = [];
let cheese = { x: 0, y: 0, size: 40, active: true };
let bowl = { x: 0, y: 0, radius: 80 };
let hueOffset = 0;
let clickCount = 0;

function setup() {
  createCanvas(800, 600);
  
  for (let i = 0; i < noodleCount; i++) {
    noodlePositions.push(createVector(random(width), random(height)));
    let angle = random(TWO_PI);
    noodleAngles.push(angle);
    noodleVelocities.push(createVector(cos(angle) * random(0.5, 1.5), sin(angle) * random(0.5, 1.5)));
    noodleLengths.push(random(15, 35));
  }
  
  bowl.x = width / 2;
  bowl.y = height / 2;
  cheese.x = bowl.x;
  cheese.y = bowl.y;
  
  colorMode(HSB, 360, 100, 100);
}

function draw() {
  hueOffset += 0.3;
  let bgHue = (hueOffset % 360);
  background(bgHue, 80, 95);
  
  drawBowl();
  drawNoodles();
  drawCheese();
  
  if (cheeseParticles.length > 0) {
    updateCheeseParticles();
    drawCheeseParticles();
  }
  
  if (frameCount % 60 === 0) {
    hueOffset += 90;
  }
}

function mousePressed() {
  let dx = mouseX - cheese.x;
  let dy = mouseY - cheese.y;
  let dist = sqrt(dx * dx + dy * dy);
  
  if (dist < cheese.size / 2 && cheese.active) {
    cheese.active = false;
    for (let i = 0; i < 20; i++) {
      let angle = random(TWO_PI);
      let speed = random(1, 3);
      cheeseParticles.push({
        x: cheese.x,
        y: cheese.y,
        vx: cos(angle) * speed,
        vy: sin(angle) * speed,
        size: random(3, 8),
        hue: random(30, 50)
      });
    }
    clickCount++;
    
    if (clickCount === 2) {
      cheese.active = true;
      cheeseParticles = [];
      reinitializeNoodles();
      clickCount = 0;
    }
  }
}

function drawBowl() {
  noFill();
  stroke(200, 60, 100);
  strokeWeight(3);
  arc(bowl.x, bowl.y, bowl.radius * 2, bowl.radius * 1.5, PI, TWO_PI);
}

function drawNoodles() {
  for (let i = 0; i < noodleCount; i++) {
    let pos = noodlePositions[i];
    let vel = noodleVelocities[i];
    let angle = noodleAngles[i];
    let len = noodleLengths[i];
    
    let sauceHue = (hueOffset + i * 5) % 360;
    
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    
    noStroke();
    fill(sauceHue, 70, 90, 0.7);
    
    beginShape();
    for (let j = 0; j < 10; j++) {
      let y = j * len * 0.1;
      let x = sin(frameCount * 0.05 + j) * 3;
      vertex(x, y);
    }
    endShape();
    
    pop();
    
    pos.add(vel);
    angle += vel.x * 0.1;
    
    if (pos.x < 0 || pos.x > width) vel.x *= -1;
    if (pos.y < 0 || pos.y > height) vel.y *= -1;
    
    if (random() < 0.02) {
      vel.x += random(-0.5, 0.5);
      vel.y += random(-0.5, 0.5);
    }
  }
}

function drawCheese() {
  if (cheese.active) {
    push();
    translate(cheese.x, cheese.y);
    fill(40, 80, 95);
    noStroke();
    ellipse(0, 0, cheese.size);
    pop();
  }
}

function updateCheeseParticles() {
  for (let p of cheeseParticles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.05;
    p.size -= 0.02;
  }
  
  cheeseParticles = cheeseParticles.filter(p => p.size > 0.5);
}

function drawCheeseParticles() {
  for (let p of cheeseParticles) {
    push();
    translate(p.x, p.y);
    fill(p.hue, 70, 90);
    noStroke();
    ellipse(0, 0, p.size);
    pop();
  }
}

function reinitializeNoodles() {
  for (let i = 0; i < noodleCount; i++) {
    noodlePositions[i] = createVector(random(width), random(height));
    noodleVelocities[i] = createVector(cos(random(TWO_PI)) * random(0.5, 1.5), sin(random(TWO_PI)) * random(0.5, 1.5));
  }
}
