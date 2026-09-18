let mountains = [];
let rocks = [];
let snow = [];
let avalanche;
let impactPosition;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Generate mountains
  for (let i = 0; i < 5; i++) {
    mountains.push({
      x: random(width),
      y: height * 0.7,
      w: random(200, 400),
      h: random(300, 500),
      color: color(random(180, 220), 20, 60)
    });
  }
  
  // Generate rocks
  for (let i = 0; i < 100; i++) {
    rocks.push({
      x: random(width),
      y: height * 0.85,
      w: random(10, 40),
      h: random(10, 30),
      color: color(random(200, 240), 10, 40)
    });
  }
  
  // Generate snow particles
  for (let i = 0; i < 5000; i++) {
    snow.push({
      x: random(width),
      y: random(height * 0.7, height),
      size: random(0.5, 2),
      opacity: random(0.3, 1)
    });
  }
  
  noLoop();
}

function draw() {
  background(color(200, 10, 20)); // Deep blue sky
  
  // Draw mountains
  for (let m of mountains) {
    fill(m.color);
    noStroke();
    beginShape();
    vertex(m.x - m.w/2, m.y);
    vertex(m.x + m.w/2, m.y);
    vertex(m.x + m.w/3, m.y - m.h);
    vertex(m.x - m.w/3, m.y - m.h);
    endShape(CLOSE);
    
    // Add snow caps
    fill(300, 10, 95);
    beginShape();
    vertex(m.x - m.w/2 + 20, m.y - m.h);
    vertex(m.x + m.w/2 - 20, m.y - m.h);
    vertex(m.x + m.w/4, m.y - m.h + 30);
    vertex(m.x - m.w/4, m.y - m.h + 30);
    endShape(CLOSE);
  }
  
  // Draw rocks
  for (let r of rocks) {
    fill(r.color);
    noStroke();
    rect(r.x, r.y, r.w, r.h, 5);
    
    // Add some detail to rocks
    fill(200, 10, 30);
    ellipse(r.x + r.w/4, r.y + r.h/3, r.w/6);
    ellipse(r.x + 3*r.w/4, r.y + 2*r.h/3, r.w/8);
  }
  
  // Draw snow
  fill(300, 10, 95);
  noStroke();
  for (let s of snow) {
    ellipse(s.x, s.y, s.size);
  }
  
  if (avalanche) {
    drawAvalanche();
  }
}

function mousePressed() {
  // Set impact position
  impactPosition = {x: width/2, y: height * 0.9};
  avalanche = {
    x: impactPosition.x,
    y: impactPosition.y,
    size: 50,
    maxRadius: 300,
    progress: 0
  };
  
  // Trigger redraw
  redraw();
}

function drawAvalanche() {
  if (!avalanche) return;
  
  // Draw avalanche wave
  let alpha = map(avalanche.progress, 0, 1, 200, 0);
  fill(300, 10, 95, alpha/255);
  noStroke();
  
  // Create impact effect
  ellipse(avalanche.x, avalanche.y, avalanche.size);
  
  // Update progress
  avalanche.progress += 0.02;
  avalanche.size = map(avalanche.progress, 0, 1, 50, avalanche.maxRadius);
  
  // Displace snow particles
  if (avalanche.progress < 1) {
    for (let s of snow) {
      let d = dist(s.x, s.y, avalanche.x, avalanche.y);
      if (d < avalanche.size) {
        let angle = atan2(s.y - avalanche.y, s.x - avalanche.x);
        let force = map(d, 0, avalanche.size, 10, 0);
        s.x += cos(angle) * force;
        s.y += sin(angle) * force;
      }
    }
  }
  
  // Continue animation
  if (avalanche.progress < 1) {
    redraw();
  } else {
    avalanche = null;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
