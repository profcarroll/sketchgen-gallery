let fields = [];
let bgParticles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  // Create geometric fields
  for (let i = 0; i < 8; i++) {
    fields.push({
      angle: i * (PI / 4),
      speed: 0.002 + i * 0.0005,
      radius: 100 + i * 30,
      segments: 12 + i * 2,
      color: color(100 + i * 15, 200, 255, 180)
    });
  }

  // Create background particles
  for (let i = 0; i < 300; i++) {
    bgParticles.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 2),
      speed: random(0.1, 0.5),
      angle: random(TWO_PI)
    });
  }
}

function draw() {
  // Subtle dark background with motion
  background(5, 5, 15);
  
  // Move and draw background particles
  for (let p of bgParticles) {
    p.x += cos(p.angle) * p.speed;
    p.y += sin(p.angle) * p.speed;
    
    if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      p.x = random(width);
      p.y = random(height);
      p.angle = random(TWO_PI);
    }
    
    noStroke();
    fill(100, 150, 255, 80);
    ellipse(p.x, p.y, p.size);
  }

  // Draw and animate fields
  let time = millis() * 0.0005;
  
  for (let f of fields) {
    push();
    translate(width/2, height/2);
    
    // Slow counter-clockwise rotation
    rotate(f.angle + time * f.speed);
    
    // Draw gradient field
    beginShape();
    noFill();
    stroke(f.color);
    strokeWeight(1.5);
    
    for (let i = 0; i <= f.segments; i++) {
      let angle = map(i, 0, f.segments, 0, TWO_PI);
      let x = cos(angle) * f.radius;
      let y = sin(angle) * f.radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Inner structure
    strokeWeight(0.5);
    for (let i = 0; i < 3; i++) {
      let innerRadius = f.radius * (0.3 + i * 0.2);
      beginShape();
      for (let j = 0; j <= f.segments; j++) {
        let angle = map(j, 0, f.segments, 0, TWO_PI);
        let x = cos(angle) * innerRadius;
        let y = sin(angle) * innerRadius;
        vertex(x, y);
      }
      endShape(CLOSE);
    }
    
    pop();
  }

  // Add central glowing core
  fill(100, 200, 255, 60);
  noStroke();
  ellipse(width/2, height/2, 40, 40);
  
  // Add subtle grid lines for depth
  stroke(100, 150, 255, 30);
  strokeWeight(0.5);
  for (let i = 0; i < 5; i++) {
    let spacing = 100 + i * 50;
    line(width/2 - spacing, height/2, width/2 + spacing, height/2);
    line(width/2, height/2 - spacing, width/2, height/2 + spacing);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
