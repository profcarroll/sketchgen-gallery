let logs = [];
let planks = [];
let blade;
let pile = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();

  // Initialize sawmill
  blade = {
    angle: 0,
    speed: 0.05,
    position: { x: -width/4, y: -height/6, z: 0 }
  };

  // Create initial logs
  for (let i = 0; i < 5; i++) {
    logs.push({
      x: random(-width/2, width/2),
      y: height/3,
      z: random(-100, 100),
      radius: random(20, 40),
      length: random(80, 120),
      rotation: random(TWO_PI),
      speed: random(0.5, 1.5),
      rolling: true
    });
  }
}

function draw() {
  background(220, 20, 95);

  // Update blade
  blade.angle += blade.speed;

  // Draw sawmill structure
  push();
  translate(blade.position.x, blade.position.y, blade.position.z);
  rotateY(blade.angle);
  fill(180, 30, 70);
  box(20, 100, 20);
  pop();

  // Update and draw logs
  for (let i = logs.length - 1; i >= 0; i--) {
    let log = logs[i];
    
    if (log.rolling) {
      log.x -= log.speed;
      log.rotation += log.speed * 0.02;

      // Check if log reaches sawmill
      if (log.x < blade.position.x + 50 && log.x > blade.position.x - 50) {
        cutLog(log);
        logs.splice(i, 1);
      }
    }

    push();
    translate(log.x, log.y, log.z);
    rotateY(log.rotation);
    fill(30, 80, 90);
    cylinder(log.radius, log.length);
    pop();
  }

  // Draw planks falling
  for (let i = planks.length - 1; i >= 0; i--) {
    let plank = planks[i];
    
    plank.y += plank.fallSpeed;
    plank.rotation += plank.spin;
    
    if (plank.y > height/2 + 50) {
      // Plank has landed
      plank.landed = true;
      pile.push(plank);
      planks.splice(i, 1);
    } else {
      push();
      translate(plank.x, plank.y, plank.z);
      rotateY(plank.rotation);
      fill(40, 70, 80);
      box(plank.width, plank.height, plank.length);
      pop();
    }
  }

  // Draw pile at bottom
  for (let i = 0; i < pile.length; i++) {
    let plank = pile[i];
    push();
    translate(plank.x, plank.y, plank.z);
    rotateY(plank.rotation);
    fill(40, 70, 80);
    box(plank.width, plank.height, plank.length);
    pop();
  }

  // Add new logs periodically
  if (frameCount % 120 === 0) {
    logs.push({
      x: width/2 + 50,
      y: height/3,
      z: random(-100, 100),
      radius: random(20, 40),
      length: random(80, 120),
      rotation: 0,
      speed: random(0.5, 1.5),
      rolling: true
    });
  }
}

function cutLog(log) {
  // Create planks from log
  let plankCount = floor(log.length / 20);
  let plankWidth = log.radius * 2;
  let plankHeight = 10;
  let plankLength = log.length / plankCount;

  for (let i = 0; i < plankCount; i++) {
    planks.push({
      x: log.x,
      y: log.y - 50,
      z: log.z + random(-20, 20),
      width: plankWidth,
      height: plankHeight,
      length: plankLength,
      rotation: log.rotation + random(-0.1, 0.1),
      spin: random(-0.02, 0.02),
      fallSpeed: random(1, 3),
      landed: false
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
