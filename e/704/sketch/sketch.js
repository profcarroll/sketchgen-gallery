let streams = [];
let gridSpacing = 40;
let numStreams = 120;
let flowSpeed = 0.5;

function setup() {
  createCanvas(800, 600);
  colorMode(GRAY);
  noStroke();
  
  for (let i = 0; i < numStreams; i++) {
    streams.push({
      x: random(width),
      y: random(height),
      angle: random(TWO_PI),
      speed: random(1, 3),
      size: random(2, 6),
      life: random(100, 300)
    });
  }
}

function draw() {
  background(20);
  
  for (let i = 0; i < streams.length; i++) {
    let s = streams[i];
    
    // Update position
    s.x += cos(s.angle) * s.speed;
    s.y += sin(s.angle) * s.speed;
    
    // Change direction slightly
    s.angle += random(-0.1, 0.1);
    
    // Fade out over time
    s.life--;
    
    if (s.life <= 0 || s.x < 0 || s.x > width || s.y < 0 || s.y > height) {
      // Reset stream
      s.x = random(width);
      s.y = random(height);
      s.angle = random(TWO_PI);
      s.life = random(100, 300);
    }
    
    // Draw stream
    fill(255 - (s.life / 300) * 200);
    ellipse(s.x, s.y, s.size);
    
    // Create starburst at intersections
    if (frameCount % 30 === 0 && random() > 0.7) {
      let x = floor(s.x / gridSpacing) * gridSpacing;
      let y = floor(s.y / gridSpacing) * gridSpacing;
      
      if (abs(s.x - x) < 20 && abs(s.y - y) < 20) {
        drawStarburst(x, y);
      }
    }
  }
}

function drawStarburst(x, y) {
  push();
  translate(x, y);
  
  for (let i = 0; i < 12; i++) {
    let angle = map(i, 0, 12, 0, TWO_PI);
    let size = random(10, 30);
    
    fill(255);
    noStroke();
    ellipse(cos(angle) * size, sin(angle) * size, 2);
  }
  
  pop();
}
