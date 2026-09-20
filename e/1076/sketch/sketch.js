let sun, mountains, foreground;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);
  
  // Create sun at top center
  sun = {
    x: width / 2,
    y: height * 0.15,
    radius: 60,
    color: color(255, 240, 150)
  };
  
  // Create mountain range
  mountains = [];
  for (let i = 0; i < 8; i++) {
    mountains.push({
      x: width * i / 8,
      y: height * 0.6,
      width: width / 8,
      height: height * 0.3 + random(20, 60),
      color: color(100 + random(50), 120 + random(50), 140 + random(50)),
      hazeColor: color(150, 170, 200, 80)
    });
  }
  
  // Create foreground fields
  foreground = [];
  for (let i = 0; i < 300; i++) {
    foreground.push({
      x: random(width),
      y: height * 0.6 + random(height * 0.4),
      size: random(2, 15),
      color: color(30 + random(40), 100 + random(80), 40 + random(60)),
      shadowOffsetX: random(-10, -30),
      shadowOffsetY: random(10, 30)
    });
  }
}

function draw() {
  background(135, 206, 235); // Sky blue
  
  // Draw sun
  fill(sun.color);
  noStroke();
  ellipse(sun.x, sun.y, sun.radius * 2, sun.radius * 2);
  
  // Draw mountains with haze
  for (let i = 0; i < mountains.length; i++) {
    const m = mountains[i];
    
    // Draw mountain shadow
    fill(50, 70, 60);
    noStroke();
    triangle(
      m.x + m.width * 0.2,
      m.y,
      m.x + m.width * 0.5,
      m.y - m.height * 0.8,
      m.x + m.width * 0.8,
      m.y
    );
    
    // Draw mountain with haze effect
    fill(m.color);
    noStroke();
    triangle(
      m.x + m.width * 0.2,
      m.y,
      m.x + m.width * 0.5,
      m.y - m.height,
      m.x + m.width * 0.8,
      m.y
    );
    
    // Draw atmospheric haze
    fill(m.hazeColor);
    noStroke();
    triangle(
      m.x + m.width * 0.2,
      m.y,
      m.x + m.width * 0.5,
      m.y - m.height * 0.6,
      m.x + m.width * 0.8,
      m.y
    );
  }
  
  // Draw foreground fields with exaggerated shadows
  for (let i = 0; i < foreground.length; i++) {
    const f = foreground[i];
    
    // Draw shadow first
    fill(30, 50, 40);
    noStroke();
    ellipse(
      f.x + f.shadowOffsetX,
      f.y + f.shadowOffsetY,
      f.size * 1.5,
      f.size * 0.8
    );
    
    // Draw grass patch
    fill(f.color);
    noStroke();
    ellipse(f.x, f.y, f.size, f.size);
  }
  
  // Add sun rays
  stroke(255, 240, 150, 100);
  strokeWeight(3);
  noFill();
  for (let i = 0; i < 12; i++) {
    const angle = TWO_PI * i / 12;
    const x1 = sun.x + cos(angle) * sun.radius;
    const y1 = sun.y + sin(angle) * sun.radius;
    const x2 = sun.x + cos(angle) * (sun.radius + 30);
    const y2 = sun.y + sin(angle) * (sun.radius + 30);
    line(x1, y1, x2, y2);
  }
  
  noLoop(); // Static scene
}
