let mountains = [];
let snowParticles = [];
let debris = [];
let clicked = false;
let avalancheStarted = false;
let avalancheTime = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create mountain peaks
  for (let i = 0; i < 8; i++) {
    let x = random(width);
    let h = random(200, 400);
    let w = random(150, 300);
    mountains.push({
      x: x,
      y: height - 100,
      width: w,
      height: h
    });
  }
  
  // Create initial snow particles on peaks
  for (let i = 0; i < 1000; i++) {
    let m = random(mountains);
    let x = m.x + random(-m.width/2, m.width/2);
    let y = m.y - random(0, m.height);
    snowParticles.push({
      x: x,
      y: y,
      size: random(1, 3),
      speed: random(0.5, 1.5)
    });
  }
  
  // Create foothill patches
  debris = [];
  for (let i = 0; i < 200; i++) {
    debris.push({
      x: random(width),
      y: height - 100 + random(0, 50),
      size: random(2, 8),
      color: color(random(30, 60), random(40, 70), random(20, 40))
    });
  }
}

function draw() {
  // Draw sky
  background(200, 80, 90);
  
  // Draw foothills
  for (let d of debris) {
    fill(d.color);
    noStroke();
    ellipse(d.x, d.y, d.size);
  }
  
  // Draw mountains
  for (let m of mountains) {
    // Mountain base
    fill(200, 30, 50);
    noStroke();
    triangle(
      m.x - m.width/2, m.y,
      m.x + m.width/2, m.y,
      m.x, m.y - m.height
    );
    
    // Snow cap
    fill(360, 0, 100);
    triangle(
      m.x - m.width/4, m.y - m.height * 0.7,
      m.x + m.width/4, m.y - m.height * 0.7,
      m.x, m.y - m.height * 0.9
    );
  }
  
  // Draw snow particles
  for (let p of snowParticles) {
    fill(360, 0, 100);
    noStroke();
    ellipse(p.x, p.y, p.size);
  }
  
  if (avalancheStarted && avalancheTime > 0) {
    avalancheTime--;
    
    // Update and draw avalanche particles
    for (let i = snowParticles.length - 1; i >= 0; i--) {
      let p = snowParticles[i];
      
      // Apply gravity
      p.y += p.speed;
      p.x += random(-0.5, 0.5);
      
      // Remove if off screen
      if (p.y > height) {
        snowParticles.splice(i, 1);
      }
    }
    
    // Add new avalanche particles at the top
    for (let i = 0; i < 20; i++) {
      let m = random(mountains);
      let x = m.x + random(-m.width/2, m.width/2);
      snowParticles.push({
        x: x,
        y: height - m.height - 10,
        size: random(1, 3),
        speed: random(2, 5)
      });
    }
    
    // Draw avalanche effect
    for (let p of snowParticles) {
      fill(360, 0, 100);
      noStroke();
      ellipse(p.x, p.y, p.size);
    }
  }
}

function mousePressed() {
  if (!clicked) {
    clicked = true;
    avalancheStarted = true;
    avalancheTime = 200; // Duration of avalanche effect
    
    // Add some initial avalanche particles
    for (let i = 0; i < 500; i++) {
      let m = random(mountains);
      let x = m.x + random(-m.width/2, m.width/2);
      snowParticles.push({
        x: x,
        y: height - m.height - 10,
        size: random(1, 3),
        speed: random(2, 5)
      });
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
