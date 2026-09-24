let lines = [];
let candles = [];
let pulse = 0;
let mouseClick = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize lines
  for (let i = 0; i < 50; i++) {
    lines.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      hue: random(120, 140), // Green hues
      alpha: random(0.3, 0.7)
    });
  }
  
  // Initialize candles
  for (let i = 0; i < 10; i++) {
    candles.push({
      x: random(width),
      y: random(height),
      w: random(20, 60),
      h: random(30, 100),
      up: random() > 0.5,
      hue: random(120, 140), // Green hues
      alpha: random(0.2, 0.5)
    });
  }
}

function draw() {
  background(0, 0, 10); // Dark background
  
  // Update and draw lines
  for (let i = 0; i < lines.length; i++) {
    let l = lines[i];
    
    // Move line
    l.x += l.vx;
    l.y += l.vy;
    
    // Bounce off edges
    if (l.x < 0 || l.x > width) l.vx *= -1;
    if (l.y < 0 || l.y > height) l.vy *= -1;
    
    // Draw line
    stroke(l.hue, 80, 70, l.alpha);
    noFill();
    beginShape();
    for (let j = 0; j < 5; j++) {
      let angle = frameCount * 0.01 + j * 0.5;
      let x = l.x + cos(angle) * 20;
      let y = l.y + sin(angle) * 20;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Pulsing effect
    if (mouseClick) {
      stroke(60, 100, 100, 0.8);
      ellipse(l.x, l.y, 30 + pulse * 20);
    }
  }
  
  // Update and draw candles
  for (let i = 0; i < candles.length; i++) {
    let c = candles[i];
    
    // Randomly change candle properties
    if (random() < 0.01) {
      c.up = random() > 0.5;
      c.hue = random(120, 140);
      c.w = random(20, 60);
      c.h = random(30, 100);
    }
    
    // Draw candle
    if (c.up) {
      fill(c.hue, 80, 70, c.alpha);
      stroke(c.hue, 80, 50, c.alpha);
    } else {
      fill(c.hue + 120, 80, 70, c.alpha);
      stroke(c.hue + 120, 80, 50, c.alpha);
    }
    
    rect(c.x - c.w/2, c.y - c.h/2, c.w, c.h);
    
    // Draw wick
    stroke(0, 0, 0, 0.3);
    line(c.x, c.y - c.h/2, c.x, c.y - c.h/2 - 10);
    
    // Pulsing effect
    if (mouseClick) {
      fill(60, 100, 100, 0.8);
      noStroke();
      ellipse(c.x, c.y, 30 + pulse * 20);
    }
  }
  
  // Update pulse effect
  if (mouseClick) {
    pulse = max(0, pulse - 0.05);
  } else {
    pulse = min(1, pulse + 0.02);
  }
}

function mousePressed() {
  mouseClick = true;
  pulse = 1;
}
