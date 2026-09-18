let buildings = [];
let streaks = [];
let floralPatterns = [];

function setup() {
  createCanvas(800, 600);
  colorMode(GRAY);
  noLoop();

  // Generate buildings
  for (let i = 0; i < 150; i++) {
    let w = random(20, 60);
    let h = random(100, 400);
    let x = random(width);
    let y = height - h;
    buildings.push({ x, y, w, h });
  }

  // Generate streaks
  for (let i = 0; i < 500; i++) {
    let x = random(width);
    let y = random(height);
    let len = random(20, 100);
    let angle = random(TWO_PI);
    let speed = random(0.5, 2);
    streaks.push({ x, y, len, angle, speed });
  }

  // Generate floral patterns
  for (let i = 0; i < 30; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(30, 80);
    let petals = floor(random(5, 12));
    floralPatterns.push({ x, y, size, petals });
  }
}

function draw() {
  background(20);

  // Draw buildings
  for (let b of buildings) {
    fill(40);
    noStroke();
    rect(b.x, b.y, b.w, b.h);
    
    // Windows
    fill(180);
    for (let i = 0; i < b.w / 8; i++) {
      for (let j = 0; j < b.h / 12; j++) {
        if (random() > 0.3) {
          rect(b.x + i * 8, b.y + j * 12, 4, 6);
        }
      }
    }
  }

  // Draw streaks
  stroke(255, 30);
  strokeWeight(1);
  noFill();
  for (let s of streaks) {
    let endX = s.x + cos(s.angle) * s.len;
    let endY = s.y + sin(s.angle) * s.len;
    line(s.x, s.y, endX, endY);
    
    // Update position
    s.x += cos(s.angle) * s.speed;
    s.y += sin(s.angle) * s.speed;
    
    // Reset if off screen
    if (s.x < 0 || s.x > width || s.y < 0 || s.y > height) {
      s.x = random(width);
      s.y = random(height);
    }
  }

  // Draw floral patterns
  noStroke();
  for (let p of floralPatterns) {
    fill(255, 10);
    let angleStep = TWO_PI / p.petals;
    for (let i = 0; i < p.petals; i++) {
      let angle = i * angleStep;
      let x1 = p.x + cos(angle) * p.size * 0.5;
      let y1 = p.y + sin(angle) * p.size * 0.5;
      let x2 = p.x + cos(angle) * p.size;
      let y2 = p.y + sin(angle) * p.size;
      ellipse(x2, y2, p.size * 0.8, p.size * 0.4);
    }
  }
}
