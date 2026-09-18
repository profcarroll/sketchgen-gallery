let ships = [];
let saltStreaks = [];
let roots = [];
let particles = [];

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial ships
  for (let i = 0; i < 5; i++) {
    ships.push({
      x: random(width),
      y: random(height),
      angle: random(TWO_PI),
      speed: random(0.5, 1.5),
      age: 0,
      hull: createGraphics(100, 60),
      details: []
    });
    
    // Add some detail to each ship
    ships[i].hull.noStroke();
    ships[i].hull.fill(30, 20, 80);
    ships[i].hull.rect(0, 0, 100, 60);
    ships[i].hull.fill(20, 15, 60);
    ships[i].hull.rect(10, 10, 80, 40);
    
    // Add some moss
    for (let j = 0; j < 10; j++) {
      ships[i].details.push({
        x: random(100),
        y: random(60),
        size: random(2, 6)
      });
    }
  }
}

function draw() {
  background(200, 5, 90);
  
  // Draw salt streaks
  for (let i = saltStreaks.length - 1; i >= 0; i--) {
    let s = saltStreaks[i];
    s.life -= 0.02;
    if (s.life <= 0) {
      saltStreaks.splice(i, 1);
      continue;
    }
    
    stroke(200, 5, 90, s.life);
    noFill();
    beginShape();
    for (let j = 0; j < s.points.length; j++) {
      vertex(s.points[j].x, s.points[j].y);
    }
    endShape();
  }
  
  // Draw roots
  for (let i = roots.length - 1; i >= 0; i--) {
    let r = roots[i];
    r.age++;
    if (r.age > 200) {
      roots.splice(i, 1);
      continue;
    }
    
    stroke(30, 10, 40, 0.5);
    noFill();
    beginShape();
    for (let j = 0; j < r.points.length; j++) {
      vertex(r.points[j].x, r.points[j].y);
    }
    endShape();
  }
  
  // Draw ships
  for (let i = ships.length - 1; i >= 0; i--) {
    let ship = ships[i];
    
    // Move ship
    ship.x += cos(ship.angle) * ship.speed;
    ship.y += sin(ship.angle) * ship.speed;
    
    // Add some drift
    ship.angle += random(-0.02, 0.02);
    
    // Wrap around screen
    if (ship.x > width + 50) ship.x = -50;
    if (ship.x < -50) ship.x = width + 50;
    if (ship.y > height + 50) ship.y = -50;
    if (ship.y < -50) ship.y = height + 50;
    
    // Add salt streak
    if (frameCount % 3 === 0) {
      saltStreaks.push({
        points: [{x: ship.x, y: ship.y}],
        life: 1,
        speed: random(0.5, 2)
      });
    }
    
    // Draw ship hull
    image(ship.hull, ship.x - 50, ship.y - 30);
    
    // Add moss details
    for (let detail of ship.details) {
      fill(120, 40, 30);
      noStroke();
      ellipse(ship.x - 50 + detail.x, ship.y - 30 + detail.y, detail.size);
    }
    
    // Add barnacles
    if (frameCount % 20 === 0) {
      let x = random(-40, 40);
      let y = random(10, 50);
      fill(60, 30, 50);
      noStroke();
      ellipse(ship.x + x, ship.y + y, random(2, 5));
    }
    
    // Add roots
    if (frameCount % 50 === 0) {
      roots.push({
        points: [{x: ship.x, y: ship.y}],
        age: 0,
        angle: random(TWO_PI)
      });
    }
    
    // Add particles from hull
    if (frameCount % 10 === 0) {
      particles.push({
        x: ship.x + random(-20, 20),
        y: ship.y + random(-20, 20),
        size: random(1, 3),
        life: 1,
        color: [random(20, 40), random(5, 15), random(70, 90)]
      });
    }
    
    // Update particles
    for (let j = particles.length - 1; j >= 0; j--) {
      let p = particles[j];
      p.life -= 0.01;
      if (p.life <= 0) {
        particles.splice(j, 1);
        continue;
      }
      
      fill(p.color[0], p.color[1], p.color[2], p.life);
      noStroke();
      ellipse(p.x, p.y, p.size);
    }
    
    // Add aging effect
    ship.age++;
    if (ship.age > 500 && random() < 0.01) {
      // Tear off a piece of the hull
      let tearX = random(-20, 20);
      let tearY = random(-10, 10);
      fill(30, 20, 60);
      noStroke();
      ellipse(ship.x + tearX, ship.y + tearY, random(5, 15));
    }
  }
  
  // Update salt streaks
  for (let i = 0; i < saltStreaks.length; i++) {
    let s = saltStreaks[i];
    if (s.points.length > 20) s.points.shift();
    
    let lastPoint = s.points[s.points.length - 1];
    s.points.push({
      x: lastPoint.x + random(-1, 1),
      y: lastPoint.y + random(-1, 1)
    });
  }
  
  // Update roots
  for (let i = 0; i < roots.length; i++) {
    let r = roots[i];
    if (r.points.length > 50) r.points.shift();
    
    let lastPoint = r.points[r.points.length - 1];
    r.points.push({
      x: lastPoint.x + cos(r.angle) * 0.5,
      y: lastPoint.y + sin(r.angle) * 0.5
    });
    
    // Randomly change angle
    r.angle += random(-0.1, 0.1);
  }
}
