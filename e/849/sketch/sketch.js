let ships = [];
let fragments = [];
let roots = [];
let saltTrails = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial ships
  for (let i = 0; i < 5; i++) {
    ships.push({
      x: random(width),
      y: random(height * 0.3, height * 0.7),
      angle: random(TWO_PI),
      speed: random(0.2, 0.8),
      size: random(40, 80),
      segments: [],
      parts: [],
      trail: []
    });
  }
  
  // Initialize root structures
  for (let i = 0; i < 3; i++) {
    roots.push({
      x: random(width),
      y: height,
      angle: random(TWO_PI),
      length: random(20, 60),
      segments: [],
      decay: 0
    });
  }
}

function draw() {
  background(180, 5, 95); // Translucent medium
  
  // Update and draw ships
  for (let i = ships.length - 1; i >= 0; i--) {
    let ship = ships[i];
    
    // Move ship
    ship.x += cos(ship.angle) * ship.speed;
    ship.y += sin(ship.angle) * ship.speed;
    
    // Add to trail
    ship.trail.push({x: ship.x, y: ship.y, size: ship.size});
    if (ship.trail.length > 20) {
      ship.trail.shift();
    }
    
    // Draw ship with weathered look
    drawShip(ship);
    
    // Occasionally detach parts
    if (random() < 0.01) {
      let part = {
        x: ship.x + random(-ship.size/2, ship.size/2),
        y: ship.y + random(-ship.size/2, ship.size/2),
        angle: random(TWO_PI),
        speed: random(0.5, 2),
        size: random(5, 15),
        color: color(random(20, 40), 30, 60),
        life: 1
      };
      fragments.push(part);
    }
    
    // Check if ship needs replacement
    if (ship.x < -100 || ship.x > width + 100 || ship.y < -100 || ship.y > height + 100) {
      ships.splice(i, 1);
      // Add new ship
      ships.push({
        x: random(width),
        y: random(height * 0.3, height * 0.7),
        angle: random(TWO_PI),
        speed: random(0.2, 0.8),
        size: random(40, 80),
        segments: [],
        parts: [],
        trail: []
      });
    }
  }
  
  // Update and draw fragments
  for (let i = fragments.length - 1; i >= 0; i--) {
    let part = fragments[i];
    
    // Move fragment
    part.x += cos(part.angle) * part.speed;
    part.y += sin(part.angle) * part.speed;
    part.life -= 0.005;
    
    // Draw fragment with decay effect
    fill(part.color);
    noStroke();
    ellipse(part.x, part.y, part.size * part.life);
    
    if (part.life <= 0) {
      fragments.splice(i, 1);
    }
  }
  
  // Update and draw roots
  for (let i = roots.length - 1; i >= 0; i--) {
    let root = roots[i];
    
    // Grow root
    root.length += 0.2;
    if (root.length > 100) {
      root.length = 100;
    }
    
    // Draw root structure
    drawRoot(root);
    
    // Occasionally detach segments
    if (random() < 0.02) {
      let segment = {
        x: root.x + random(-5, 5),
        y: root.y - root.length,
        angle: random(TWO_PI),
        speed: random(0.3, 1),
        size: random(2, 6),
        color: color(random(180, 220), 20, 40),
        life: 1
      };
      fragments.push(segment);
    }
  }
  
  // Draw salt trails
  for (let i = saltTrails.length - 1; i >= 0; i--) {
    let trail = saltTrails[i];
    
    // Update trail
    trail.life -= 0.01;
    
    if (trail.life > 0) {
      stroke(240, 5, 90, trail.life);
      noFill();
      beginShape();
      for (let j = 0; j < trail.points.length; j++) {
        vertex(trail.points[j].x, trail.points[j].y);
      }
      endShape();
    } else {
      saltTrails.splice(i, 1);
    }
  }
  
  // Occasionally add new trails
  if (random() < 0.3) {
    let trail = {
      points: [],
      life: 1
    };
    
    for (let i = 0; i < 15; i++) {
      trail.points.push({
        x: random(width),
        y: random(height)
      });
    }
    
    saltTrails.push(trail);
  }
}

function drawShip(ship) {
  push();
  translate(ship.x, ship.y);
  rotate(ship.angle);
  
  // Draw hull with weathering
  fill(20, 30, 50);
  noStroke();
  ellipse(0, 0, ship.size, ship.size * 0.6);
  
  // Draw deck
  fill(10, 40, 70);
  rectMode(CENTER);
  rect(0, -ship.size * 0.15, ship.size * 0.8, ship.size * 0.2);
  
  // Add barnacles and moss
  for (let i = 0; i < 8; i++) {
    let angle = random(TWO_PI);
    let dist = random(ship.size * 0.3, ship.size * 0.45);
    let x = cos(angle) * dist;
    let y = sin(angle) * dist;
    
    fill(120, 60, 30);
    ellipse(x, y, random(3, 8), random(3, 8));
  }
  
  // Add cracks and tears
  stroke(30, 20, 30);
  strokeWeight(1);
  for (let i = 0; i < 4; i++) {
    let x1 = random(-ship.size * 0.4, ship.size * 0.4);
    let y1 = random(-ship.size * 0.2, ship.size * 0.2);
    let x2 = random(-ship.size * 0.4, ship.size * 0.4);
    let y2 = random(-ship.size * 0.2, ship.size * 0.2);
    line(x1, y1, x2, y2);
  }
  
  pop();
  
  // Draw trail
  stroke(240, 10, 80, 0.5);
  noFill();
  beginShape();
  for (let i = 0; i < ship.trail.length; i++) {
    let t = ship.trail[i];
    vertex(t.x, t.y);
  }
  endShape();
}

function drawRoot(root) {
  push();
  translate(root.x, root.y);
  
  stroke(240, 15, 50);
  strokeWeight(1);
  noFill();
  
  // Draw root with branching
  beginShape();
  vertex(0, 0);
  for (let i = 0; i < root.length; i += 3) {
    let angle = root.angle + sin(i * 0.1) * 0.2;
    let x = cos(angle) * i;
    let y = -i;
    
    vertex(x, y);
  }
  endShape();
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
