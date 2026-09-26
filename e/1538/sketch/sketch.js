let structures = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize with base structures
  for (let i = 0; i < 15; i++) {
    structures.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      speed: random(0.3, 1.2),
      angle: random(TWO_PI),
      hue: random(20, 60),
      age: 0,
      maxAge: random(300, 600),
      segments: floor(random(5, 10)),
      folded: random() > 0.5
    });
  }
}

function draw() {
  background(15);
  time += 0.008;

  // Update and display structures
  for (let i = structures.length - 1; i >= 0; i--) {
    let s = structures[i];
    
    // Move structure
    s.x += cos(s.angle) * s.speed;
    s.y += sin(s.angle) * s.speed;
    
    // Bounce off edges
    if (s.x < 0 || s.x > width) s.angle = PI - s.angle;
    if (s.y < 0 || s.y > height) s.angle = -s.angle;
    
    // Age and grow
    s.age++;
    if (s.age > s.maxAge) {
      // Create new structure
      structures.push({
        x: s.x,
        y: s.y,
        size: random(15, 40),
        speed: random(0.3, 1.2),
        angle: random(TWO_PI),
        hue: (s.hue + random(-10, 10)) % 360,
        age: 0,
        maxAge: random(300, 600),
        segments: floor(random(5, 10)),
        folded: random() > 0.5
      });
      
      // Remove old structure
      structures.splice(i, 1);
    } else {
      // Grow slightly and shift hue over time
      s.size *= 1.001;
      s.hue = (s.hue + 0.2) % 360;
      
      // Draw with gradient effect
      noStroke();
      fill(s.hue, 85, 75 + sin(time + s.age * 0.01) * 20, 220);
      
      push();
      translate(s.x, s.y);
      
      if (s.folded) {
        // Draw folded organic shape
        beginShape();
        for (let a = 0; a < TWO_PI; a += 0.3) {
          let r = s.size * (1 + sin(a * 4 + time * 0.5) * 0.2);
          let x = r * cos(a);
          let y = r * sin(a);
          vertex(x, y);
        }
        endShape(CLOSE);
      } else {
        // Draw rigid, sharp-edged mass
        beginShape();
        for (let a = 0; a < TWO_PI; a += 0.2) {
          let r = s.size * (1 + sin(a * 3 + time * 0.3) * 0.4);
          let x = r * cos(a);
          let y = r * sin(a);
          vertex(x, y);
        }
        endShape(CLOSE);
      }
      
      pop();
    }
  }

  // Add some rigid masses occasionally
  if (frameCount % 50 === 0) {
    for (let i = 0; i < 2; i++) {
      structures.push({
        x: random(width),
        y: random(height),
        size: random(100, 200),
        speed: 0,
        angle: 0,
        hue: random(180, 240),
        age: 0,
        maxAge: Infinity,
        segments: floor(random(5, 10)),
        folded: false
      });
    }
  }

  // Occasionally add sharp folds to some structures
  if (frameCount % 40 === 0) {
    for (let s of structures) {
      if (random() > 0.7) {
        s.folded = !s.folded;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
