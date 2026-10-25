let raindrops = [];
let puddles = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  
  // Initialize raindrops
  for (let i = 0; i < 300; i++) {
    raindrops.push({
      x: random(width),
      y: random(-height, 0),
      speed: random(2, 6),
      size: random(1, 3),
      opacity: random(100, 255)
    });
  }
  
  // Initialize puddles
  for (let i = 0; i < 10; i++) {
    puddles.push({
      x: random(width),
      y: random(height/2, height - 50),
      radius: random(30, 100),
      color: color(random(50, 150), random(80, 180), random(150, 255), 100),
      flashTime: 0,
      flashDuration: 10
    });
  }
}

function draw() {
  time += 0.02;
  
  // Soft background
  background(20, 25, 35);
  
  // Draw puddles with inverted cityscape
  for (let puddle of puddles) {
    push();
    translate(puddle.x, puddle.y);
    
    // Puddle surface
    fill(puddle.color);
    noStroke();
    ellipse(0, 0, puddle.radius * 2, puddle.radius * 1.5);
    
    // Inverted cityscape pattern
    if (puddle.flashTime > 0) {
      // Flash effect
      fill(255, 255, 255, 100);
      noStroke();
      rect(-puddle.radius * 0.8, -puddle.radius * 0.3, puddle.radius * 1.6, puddle.radius * 0.6);
      
      // Geometric pattern
      stroke(255, 255, 255, 200);
      strokeWeight(1);
      for (let i = 0; i < 8; i++) {
        let angle = TWO_PI * i / 8;
        let x1 = cos(angle) * puddle.radius * 0.6;
        let y1 = sin(angle) * puddle.radius * 0.6;
        let x2 = cos(angle + PI/4) * puddle.radius * 0.6;
        let y2 = sin(angle + PI/4) * puddle.radius * 0.6;
        line(x1, y1, x2, y2);
      }
      
      puddle.flashTime--;
    } else {
      // Regular pattern
      stroke(200, 230, 255, 80);
      strokeWeight(0.5);
      for (let i = 0; i < 6; i++) {
        let angle = TWO_PI * i / 6;
        let x1 = cos(angle) * puddle.radius * 0.7;
        let y1 = sin(angle) * puddle.radius * 0.7;
        let x2 = -x1;
        let y2 = -y1;
        line(x1, y1, x2, y2);
      }
    }
    
    pop();
  }
  
  // Draw raindrops
  for (let drop of raindrops) {
    drop.y += drop.speed;
    
    if (drop.y > height) {
      drop.y = random(-20, 0);
      drop.x = random(width);
    }
    
    // Check for puddle impact
    for (let puddle of puddles) {
      let d = dist(drop.x, drop.y, puddle.x, puddle.y);
      if (d < puddle.radius && drop.y > puddle.y - 30) {
        puddle.flashTime = puddle.flashDuration;
        break;
      }
    }
    
    stroke(200, 230, 255, drop.opacity);
    strokeWeight(drop.size);
    line(drop.x, drop.y, drop.x, drop.y + drop.size * 2);
  }
  
  // Ambient glow
  blendMode(ADD);
  fill(10, 20, 40, 30);
  noStroke();
  rect(0, 0, width, height);
  blendMode(BLEND);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
