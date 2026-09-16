let mountains = [];
let peaks = [];
let river = [];
let snowParticles = [];
let avalancheActive = false;
let avalancheTime = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Generate mountains
  for (let i = 0; i < 8; i++) {
    mountains.push({
      x: random(width),
      y: height * 0.7,
      w: random(100, 300),
      h: random(200, 400),
      color: color(random(150, 200), random(180, 220), random(220, 255))
    });
  }
  
  // Generate peaks
  for (let i = 0; i < 15; i++) {
    peaks.push({
      x: random(width),
      y: height * 0.6,
      size: random(30, 80),
      color: color(random(200, 255), random(220, 255), random(240, 255))
    });
  }
  
  // Generate river
  for (let i = 0; i < 100; i++) {
    river.push({
      x: map(i, 0, 99, 0, width),
      y: height * 0.7 + noise(i * 0.1) * 50
    });
  }
  
  // Initialize snow particles
  for (let i = 0; i < 2000; i++) {
    snowParticles.push({
      x: random(width),
      y: random(height * 0.6),
      size: random(1, 3),
      speed: random(0.5, 2),
      opacity: random(100, 200)
    });
  }
}

function draw() {
  background(50, 100, 180);
  
  // Draw sky gradient
  for (let i = 0; i < height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(color(50, 100, 180), color(20, 60, 120), inter);
    stroke(c);
    line(0, i, width, i);
  }
  
  // Draw distant mountains
  for (let m of mountains) {
    fill(m.color);
    triangle(
      m.x - m.w/2, m.y,
      m.x + m.w/2, m.y,
      m.x, m.y - m.h
    );
  }
  
  // Draw peaks
  for (let p of peaks) {
    fill(p.color);
    ellipse(p.x, p.y, p.size, p.size * 1.5);
  }
  
  // Draw river
  stroke(30, 80, 160);
  strokeWeight(30);
  noFill();
  beginShape();
  for (let r of river) {
    curveVertex(r.x, r.y);
  }
  endShape();
  
  // Draw snow particles
  if (!avalancheActive) {
    for (let p of snowParticles) {
      fill(255, p.opacity);
      ellipse(p.x, p.y, p.size);
      
      // Animate particles gently
      p.y += p.speed;
      p.x += sin(frameCount * 0.01 + p.y * 0.01) * 0.3;
      
      if (p.y > height) {
        p.y = random(-50, -10);
        p.x = random(width);
      }
    }
  } else {
    // Draw avalanche effect
    let time = frameCount - avalancheTime;
    
    for (let i = 0; i < min(200, time * 5); i++) {
      if (i >= snowParticles.length) break;
      
      let p = snowParticles[i];
      fill(255, 150);
      ellipse(p.x, p.y, p.size * 2);
      
      // Avalanche movement
      p.y += 3 + random(5);
      p.x += (p.x - width/2) * 0.02;
      
      if (p.y > height || time > 100) {
        p.y = random(-50, -10);
        p.x = random(width);
      }
    }
    
    // Fade out avalanche
    if (time > 100) {
      avalancheActive = false;
    }
  }
  
  // Draw foreground trees
  fill(20, 100, 30);
  for (let i = 0; i < 50; i++) {
    let x = map(i, 0, 49, 0, width);
    let h = random(80, 120);
    triangle(x - 10, height, x + 10, height, x, height - h);
  }
}

function mousePressed() {
  avalancheActive = true;
  avalancheTime = frameCount;
}
