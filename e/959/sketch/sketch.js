let ships = [];
let trails = [];
let crystals = [];
let time = 0;
let canvas;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  ships.push({
    x: 0,
    y: 0,
    z: 0,
    size: random(20, 40),
    angle: random(TWO_PI),
    speed: random(0.5, 1.5),
    trail: [],
    age: 0,
    patina: 0,
    tear: 0
  });
}

function draw() {
  time++;
  background(200, 5, 95, 0.1);
  
  // Update and display ships
  for (let i = ships.length - 1; i >= 0; i--) {
    let ship = ships[i];
    
    // Move ship away from center
    ship.x += cos(ship.angle) * ship.speed;
    ship.y += sin(ship.angle) * ship.speed;
    ship.z += random(-0.5, 0.5);
    
    // Add to trail
    ship.trail.push({x: ship.x, y: ship.y, z: ship.z});
    if (ship.trail.length > 30) {
      ship.trail.shift();
    }
    
    // Age the ship
    ship.age++;
    ship.patina = map(ship.age, 0, 100, 0, 0.5);
    ship.tear = map(ship.age, 0, 200, 0, 1);
    
    // Draw trail
    if (ship.trail.length > 1) {
      beginShape(LINES);
      for (let j = 0; j < ship.trail.length - 1; j++) {
        let t = ship.trail[j];
        let next = ship.trail[j + 1];
        let alpha = map(j, 0, ship.trail.length - 1, 0.8, 0);
        
        fill(240, 30, 90, alpha * 0.5);
        vertex(t.x, t.y, t.z);
        vertex(next.x, next.y, next.z);
      }
      endShape();
    }
    
    // Draw ship
    push();
    translate(ship.x, ship.y, ship.z);
    rotateZ(ship.angle);
    
    // Base shape with patina effect
    fill(240, 10, 90 + ship.patina * 30, 0.8 - ship.patina * 0.5);
    beginShape();
    vertex(-ship.size/2, -ship.size/6, 0);
    vertex(ship.size/2, -ship.size/6, 0);
    vertex(ship.size/3, ship.size/4, 0);
    vertex(-ship.size/3, ship.size/4, 0);
    endShape(CLOSE);
    
    // Add tear effect
    if (ship.tear > 0.5) {
      fill(240, 10, 70, 0.6);
      beginShape();
      vertex(-ship.size/3, ship.size/8, 0);
      vertex(-ship.size/4, ship.size/6, 0);
      vertex(-ship.size/6, ship.size/5, 0);
      endShape(CLOSE);
    }
    
    pop();
    
    // Remove old ships
    if (abs(ship.x) > width * 2 || abs(ship.y) > height * 2) {
      ships.splice(i, 1);
    }
  }
  
  // Add new ships occasionally
  if (random() < 0.01 && ships.length < 5) {
    ships.push({
      x: random(-width/4, width/4),
      y: random(-height/4, height/4),
      z: random(-20, 20),
      size: random(20, 40),
      angle: random(TWO_PI),
      speed: random(0.5, 1.5),
      trail: [],
      age: 0,
      patina: 0,
      tear: 0
    });
  }
  
  // Create crystal growth from trails
  if (random() < 0.05 && trails.length > 0) {
    let t = trails[0];
    crystals.push({
      x: t.x + random(-20, 20),
      y: t.y + random(-20, 20),
      z: t.z,
      size: random(2, 8),
      age: 0
    });
    trails.shift();
  }
  
  // Update crystals
  for (let i = crystals.length - 1; i >= 0; i--) {
    let c = crystals[i];
    c.age++;
    
    if (c.age > 100) {
      crystals.splice(i, 1);
      continue;
    }
    
    push();
    translate(c.x, c.y, c.z);
    
    // Draw crystal
    fill(240, 20, 95, 0.7 - c.age/200);
    sphere(c.size * (1 + c.age/100), 6, 4);
    
    pop();
  }
  
  // Dissolve fragments
  if (time % 30 === 0 && random() < 0.3) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    trails.push({x: x, y: y, z: 0});
  }
}
