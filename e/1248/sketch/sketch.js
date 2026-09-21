let plants = [];
let mountains = [];
let sun;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create foreground plants
  for (let i = 0; i < 500; i++) {
    plants.push({
      x: random(width),
      y: random(height * 0.6, height),
      size: random(2, 8),
      angle: random(TWO_PI),
      color: color(30, 120, 30, 200 + random(55)),
      stemColor: color(100, 80, 40),
      hasSeed: random() > 0.7
    });
  }
  
  // Create distant mountains
  for (let i = 0; i < 10; i++) {
    mountains.push({
      x: map(i, 0, 9, 0, width),
      height: random(80, 150),
      color: color(60, 60, 70, 200 + random(55)),
      width: random(300, 600)
    });
  }
  
  // Sun position
  sun = { x: width * 0.8, y: height * 0.2 };
}

function draw() {
  background(135, 206, 235); // Sky blue
  
  // Draw distant mountains with atmospheric perspective
  for (let m of mountains) {
    fill(m.color);
    noStroke();
    triangle(
      m.x - m.width/2, height,
      m.x + m.width/2, height,
      m.x, height - m.height
    );
  }
  
  // Draw foreground plants with detailed texturing
  for (let p of plants) {
    push();
    translate(p.x, p.y);
    rotate(p.angle);
    
    // Stem
    stroke(p.stemColor);
    strokeWeight(1);
    line(0, 0, 0, -p.size * 1.5);
    
    // Leaf tuft
    fill(p.color);
    noStroke();
    ellipse(0, -p.size * 1.5, p.size * 2, p.size * 3);
    
    // Seed heads
    if (p.hasSeed) {
      fill(255, 200, 50);
      ellipse(0, -p.size * 2.5, p.size * 0.8, p.size * 1.2);
    }
    
    pop();
  }
  
  // Sun glow
  noStroke();
  fill(255, 200, 0, 100);
  ellipse(sun.x, sun.y, 100, 100);
  
  // Sun rays
  stroke(255, 200, 0, 150);
  strokeWeight(2);
  for (let i = 0; i < 12; i++) {
    let angle = map(i, 0, 12, 0, TWO_PI);
    let x1 = sun.x + cos(angle) * 50;
    let y1 = sun.y + sin(angle) * 50;
    let x2 = sun.x + cos(angle) * 120;
    let y2 = sun.y + sin(angle) * 120;
    line(x1, y1, x2, y2);
  }
  
  noLoop();
}
