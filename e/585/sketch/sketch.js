let circles = [];
let filaments = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create background circles
  for (let i = 0; i < 200; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      radius: random(50, 300),
      alpha: random(10, 40),
      speed: random(0.001, 0.005),
      time: random(1000)
    });
  }
  
  // Create filament patterns
  for (let i = 0; i < 50; i++) {
    filaments.push({
      points: [],
      time: random(1000),
      speed: random(0.002, 0.008),
      alpha: random(30, 80)
    });
  }
  
  // Initialize filament points
  for (let f of filaments) {
    let segments = floor(random(10, 30));
    for (let i = 0; i < segments; i++) {
      f.points.push({
        x: random(width),
        y: random(height),
        size: random(2, 8)
      });
    }
  }
}

function draw() {
  background(10, 10, 30);
  
  // Draw and update background circles
  for (let c of circles) {
    c.time += c.speed;
    let pulse = sin(c.time) * 0.5 + 0.5;
    fill(100, 150, 255, c.alpha * pulse);
    
    // Draw multiple overlapping translucent circles
    for (let i = 0; i < 3; i++) {
      let offset = i * 10 - 15;
      ellipse(c.x + offset, c.y + offset, c.radius * pulse);
    }
  }
  
  // Draw and update filaments
  for (let f of filaments) {
    f.time += f.speed;
    
    // Create glow effect
    let pulse = sin(f.time) * 0.5 + 0.5;
    let alpha = f.alpha * pulse;
    
    // Use batched drawing for smooth lines
    beginShape();
    noFill();
    stroke(200, 230, 255, alpha);
    strokeWeight(1);
    
    for (let i = 0; i < f.points.length; i++) {
      let p = f.points[i];
      let angle = atan2(p.y - height/2, p.x - width/2);
      let distFromCenter = dist(p.x, p.y, width/2, height/2);
      
      // Add subtle movement to filament points
      let x = p.x + sin(f.time * 0.5 + i) * 3;
      let y = p.y + cos(f.time * 0.3 + i) * 3;
      
      curveVertex(x, y);
    }
    
    endShape(CLOSE);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
