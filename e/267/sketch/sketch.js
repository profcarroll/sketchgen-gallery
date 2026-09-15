let time = 0;
let textParticles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create text particles for animation
  let txt = "Channel 11 News";
  textSize(48);
  let w = textWidth(txt);
  let x = (width - w) / 2;
  let y = height / 2;
  
  for (let i = 0; i < 500; i++) {
    let angle = random(TWO_PI);
    let dist = random(100, 300);
    textParticles.push({
      x: x + cos(angle) * dist,
      y: y + sin(angle) * dist,
      ox: x + cos(angle) * dist,
      oy: y + sin(angle) * dist,
      speed: random(0.001, 0.005),
      angle: angle,
      size: random(2, 8)
    });
  }
}

function draw() {
  time += 0.005;
  
  // Draw flowing gradient background
  background(0, 0, 100, 0.02);
  
  let center = createVector(width/2, height/2);
  
  for (let i = 0; i < 200; i++) {
    let angle = time + i * 0.05;
    let radius = 50 + sin(time * 0.5 + i * 0.1) * 30;
    
    let x = center.x + cos(angle) * radius;
    let y = center.y + sin(angle) * radius;
    
    let hue = (time * 20 + i * 2) % 360;
    fill(hue, 80, 90, 0.1);
    
    noStroke();
    ellipse(x, y, 100 + sin(time + i) * 50, 100 + cos(time + i) * 50);
  }
  
  // Draw animated text particles
  for (let p of textParticles) {
    let targetX = p.ox + sin(time * 2 + p.angle) * 20;
    let targetY = p.oy + cos(time * 1.5 + p.angle) * 15;
    
    p.x += (targetX - p.x) * 0.05;
    p.y += (targetY - p.y) * 0.05;
    
    fill(240, 90, 100, 0.8);
    noStroke();
    ellipse(p.x, p.y, p.size, p.size);
  }
  
  // Draw main text
  fill(240, 90, 100, 0.95);
  noStroke();
  textSize(48);
  textAlign(CENTER, CENTER);
  
  let txt = "Channel 11 News";
  let w = textWidth(txt);
  let x = (width - w) / 2;
  let y = height / 2;
  
  // Slight text animation
  let tx = x + sin(time * 0.5) * 2;
  let ty = y + cos(time * 0.3) * 1;
  
  text(txt, tx, ty);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
