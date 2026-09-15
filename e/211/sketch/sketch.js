let grassParticles = [];
let mountains = [];
let clouds = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Generate grass particles
  for (let i = 0; i < 3000; i++) {
    grassParticles.push({
      x: random(width),
      y: random(height * 0.4, height),
      len: random(5, 15),
      angle: random(-0.2, 0.2),
      speed: random(0.1, 0.5)
    });
  }
  
  // Generate mountains
  for (let i = 0; i < 10; i++) {
    mountains.push({
      x: i * width / 10,
      h: random(100, 200),
      w: width / 10
    });
  }
  
  // Generate clouds
  for (let i = 0; i < 20; i++) {
    clouds.push({
      x: random(width),
      y: random(height * 0.2, height * 0.4),
      size: random(30, 60)
    });
  }
}

function draw() {
  // Sky gradient
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(255, 255, 255), color(135, 206, 235), inter);
    stroke(c);
    line(0, y, width, y);
  }
  
  // Draw mountains
  noStroke();
  fill(100, 100, 100);
  for (let m of mountains) {
    triangle(m.x, height, m.x + m.w/2, height - m.h, m.x + m.w, height);
  }
  
  // Draw clouds
  fill(255);
  noStroke();
  for (let c of clouds) {
    ellipse(c.x, c.y, c.size, c.size * 0.6);
    ellipse(c.x + c.size * 0.4, c.y - c.size * 0.2, c.size * 0.7, c.size * 0.5);
    ellipse(c.x - c.size * 0.4, c.y - c.size * 0.1, c.size * 0.6, c.size * 0.4);
  }
  
  // Draw grass
  stroke(0, 100, 0);
  strokeWeight(1);
  for (let p of grassParticles) {
    let x = p.x;
    let y = p.y;
    let len = p.len;
    let angle = p.angle;
    
    line(x, y, x + sin(angle) * len, y - cos(angle) * len);
  }
  
  // Static scene - no animation
  noLoop();
}
