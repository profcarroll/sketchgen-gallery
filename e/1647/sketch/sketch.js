let structures = [];
let time = 0;
let fractalDetail = 8;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // Initialize with base structures
  for (let i = 0; i < 15; i++) {
    structures.push({
      x: random(-width/3, width/3),
      y: random(-height/3, height/3),
      z: random(-100, 100),
      size: random(20, 80),
      speed: random(0.3, 1.2),
      angle: random(TWO_PI),
      hue: random(20, 60),
      age: 0,
      maxAge: random(300, 600),
      segments: floor(random(5, 10)),
      folded: random() > 0.5,
      growth: random(0.001, 0.003)
    });
  }
}

function draw() {
  background(10);
  time += 0.008;
  
  // Set up lighting
  pointLight(255, 255, 255, width/2, height/2, 500);
  pointLight(255, 255, 255, -width/2, -height/2, -500);
  ambientLight(60);
  
  // Update and display structures
  for (let i = structures.length - 1; i >= 0; i--) {
    let s = structures[i];
    
    // Move structure
    s.x += cos(s.angle) * s.speed;
    s.y += sin(s.angle) * s.speed;
    
    // Bounce off edges
    if (s.x < -width/2 || s.x > width/2) s.angle = PI - s.angle;
    if (s.y < -height/2 || s.y > height/2) s.angle = -s.angle;
    
    // Age and grow
    s.age++;
    if (s.age > s.maxAge) {
      // Create new structure
      structures.push({
        x: s.x,
        y: s.y,
        z: s.z + random(-50, 50),
        size: random(15, 40),
        speed: random(0.3, 1.2),
        angle: random(TWO_PI),
        hue: (s.hue + random(-10, 10)) % 360,
        age: 0,
        maxAge: random(300, 600),
        segments: floor(random(5, 10)),
        folded: random() > 0.5,
        growth: random(0.001, 0.003)
      });
      
      // Remove old structure
      structures.splice(i, 1);
    } else {
      // Grow slightly and shift hue over time
      s.size += s.growth;
      s.hue = (s.hue + 0.2) % 360;
      
      // Draw with gradient effect
      noStroke();
      fill(s.hue, 85, 75 + sin(time + s.age * 0.01) * 20, 220);
      
      push();
      translate(s.x, s.y, s.z);
      
      if (s.folded) {
        // Draw folded organic shape with fractal ridges
        beginShape();
        for (let a = 0; a < TWO_PI; a += 0.3) {
          let r = s.size * (1 + sin(a * 4 + time * 0.5) * 0.2);
          let x = r * cos(a);
          let y = r * sin(a);
          vertex(x, y, 0);
        }
        endShape(CLOSE);
        
        // Add fractal ridges
        stroke(255, 100);
        noFill();
        for (let j = 0; j < 8; j++) {
          let angle = (j / 8) * TWO_PI + time * 0.3;
          let r = s.size * 0.8;
          let x1 = r * cos(angle);
          let y1 = r * sin(angle);
          let x2 = r * cos(angle + PI/4);
          let y2 = r * sin(angle + PI/4);
          line(x1, y1, 0, x2, y2, 0);
        }
      } else {
        // Draw rigid, sharp-edged mass with crystalline fracturing
        beginShape();
        for (let a = 0; a < TWO_PI; a += 0.2) {
          let r = s.size * (1 + sin(a * 3 + time * 0.3) * 0.4);
          let x = r * cos(a);
          let y = r * sin(a);
          vertex(x, y, 0);
        }
        endShape(CLOSE);
        
        // Add sharp crystalline folds
        stroke(255, 150);
        noFill();
        for (let j = 0; j < 6; j++) {
          let angle = (j / 6) * TWO_PI + time * 0.2;
          let r = s.size * 0.9;
          let x1 = r * cos(angle);
          let y1 = r * sin(angle);
          let x2 = r * cos(angle + PI/3);
          let y2 = r * sin(angle + PI/3);
          line(x1, y1, 0, x2, y2, 0);
        }
      }
      
      pop();
    }
  }

  // Add some rigid masses occasionally
  if (frameCount % 50 === 0) {
    for (let i = 0; i < 2; i++) {
      structures.push({
        x: random(-width/3, width/3),
        y: random(-height/3, height/3),
        z: random(-100, 100),
        size: random(100, 200),
        speed: 0,
        angle: 0,
        hue: random(180, 240),
        age: 0,
        maxAge: Infinity,
        segments: floor(random(5, 10)),
        folded: false,
        growth: 0
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
