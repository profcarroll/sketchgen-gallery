let gears = [];
let cams = [];
let buildings = [];
let ships = [];
let wakes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create clockwork elements
  for (let i = 0; i < 20; i++) {
    gears.push({
      x: random(width),
      y: random(height * 0.3, height * 0.7),
      radius: random(20, 60),
      rotation: random(TWO_PI),
      speed: random(0.005, 0.02),
      teeth: floor(random(12, 24))
    });
  }
  
  for (let i = 0; i < 15; i++) {
    cams.push({
      x: random(width),
      y: random(height * 0.3, height * 0.7),
      radius: random(15, 40),
      rotation: random(TWO_PI),
      speed: random(0.01, 0.03),
      offset: random(0, TWO_PI)
    });
  }
  
  // Create buildings
  for (let i = 0; i < 30; i++) {
    buildings.push({
      x: random(width),
      y: height * 0.7,
      width: random(40, 100),
      height: random(60, 200),
      color: color(random(100, 180), random(60, 120), random(20, 60)),
      depth: random(5, 20)
    });
  }
  
  // Create ships
  for (let i = 0; i < 8; i++) {
    ships.push({
      x: random(width),
      y: random(height * 0.3, height * 0.7),
      size: random(30, 60),
      speed: random(0.2, 1.5),
      angle: random(TWO_PI),
      color: color(random(100, 180), random(60, 120), random(20, 60)),
      trail: []
    });
  }
}

function draw() {
  background(30, 40, 50);
  
  // Draw sky gradient
  for (let y = 0; y < height * 0.7; y++) {
    let inter = map(y, 0, height * 0.7, 0, 1);
    let c = lerpColor(color(30, 40, 50), color(100, 150, 200), inter);
    stroke(c);
    line(0, y, width, y);
  }
  
  // Draw buildings
  for (let building of buildings) {
    fill(building.color);
    noStroke();
    rect(building.x - building.width/2, building.y - building.height, 
         building.width, building.height);
    
    // Add window details
    fill(255, 200);
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 3; j++) {
        if (random() > 0.3) {
          rect(building.x - building.width/2 + 10 + i * 15, 
               building.y - building.height + 10 + j * 20, 
               8, 12);
        }
      }
    }
  }
  
  // Draw gears
  for (let gear of gears) {
    gear.rotation += gear.speed;
    
    push();
    translate(gear.x, gear.y);
    
    // Gear teeth
    stroke(150);
    strokeWeight(2);
    noFill();
    ellipse(0, 0, gear.radius * 2, gear.radius * 2);
    
    for (let i = 0; i < gear.teeth; i++) {
      let angle = TWO_PI / gear.teeth * i + gear.rotation;
      let x1 = cos(angle) * (gear.radius - 5);
      let y1 = sin(angle) * (gear.radius - 5);
      let x2 = cos(angle) * (gear.radius + 5);
      let y2 = sin(angle) * (gear.radius + 5);
      
      line(x1, y1, x2, y2);
    }
    
    pop();
  }
  
  // Draw cams
  for (let cam of cams) {
    cam.rotation += cam.speed;
    
    push();
    translate(cam.x, cam.y);
    
    // Cam shape
    noStroke();
    fill(180);
    ellipse(0, 0, cam.radius * 2, cam.radius * 2);
    
    // Cam follower
    let followerX = cos(cam.rotation + cam.offset) * cam.radius;
    let followerY = sin(cam.rotation + cam.offset) * cam.radius;
    fill(100);
    ellipse(followerX, followerY, 8, 8);
    
    pop();
  }
  
  // Update and draw ships
  for (let ship of ships) {
    // Gentle autonomous drifting
    ship.angle += random(-0.02, 0.02);
    ship.x += cos(ship.angle) * ship.speed;
    ship.y += sin(ship.angle) * ship.speed;
    
    // Keep ships within bounds
    if (ship.x < -100 || ship.x > width + 100 || 
        ship.y < -100 || ship.y > height + 100) {
      ship.x = random(width);
      ship.y = random(height * 0.3, height * 0.7);
    }
    
    // Add to trail
    ship.trail.push({x: ship.x, y: ship.y});
    if (ship.trail.length > 30) {
      ship.trail.shift();
    }
    
    // Draw wake
    drawWake(ship);
    
    // Draw ship
    push();
    translate(ship.x, ship.y);
    rotate(ship.angle);
    drawShip(ship);
    pop();
  }
}

function drawShip(ship) {
  // Ship hull (paper-cut style)
  fill(ship.color);
  noStroke();
  ellipse(0, 0, ship.size, ship.size * 0.6);
  
  // Ship deck
  fill(120, 80, 40);
  rect(-ship.size * 0.4, -ship.size * 0.3, ship.size * 0.8, ship.size * 0.2);
  
  // Mast and sail (paper-cut style)
  stroke(100);
  strokeWeight(2);
  line(0, -ship.size * 0.4, 0, -ship.size * 0.8);
  
  fill(255);
  noStroke();
  triangle(0, -ship.size * 0.8, 
           -ship.size * 0.3, -ship.size * 0.6,
           ship.size * 0.3, -ship.size * 0.6);
}

function drawWake(ship) {
  // Draw wake trail
  noFill();
  stroke(255, 150);
  strokeWeight(1);
  
  beginShape();
  for (let i = 0; i < ship.trail.length; i++) {
    let point = ship.trail[i];
    let alpha = map(i, 0, ship.trail.length, 0, 200);
    stroke(255, alpha);
    vertex(point.x, point.y);
  }
  endShape();
  
  // Draw fading particles
  for (let i = 0; i < 2; i++) {
    let t = frameCount * 0.03 + i;
    let x = ship.x + cos(t) * random(5, 15);
    let y = ship.y + sin(t) * random(5, 15);
    let size = random(1, 3);
    
    noStroke();
    fill(255, 100);
    ellipse(x, y, size, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
