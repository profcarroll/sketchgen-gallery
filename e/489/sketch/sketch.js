let splines = [];
let lattices = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize splines
  for (let i = 0; i < 8; i++) {
    splines.push({
      points: [],
      hue: random(360),
      radius: random(50, 150),
      speed: random(0.005, 0.02)
    });
  }
  
  // Initialize lattices
  for (let i = 0; i < 12; i++) {
    lattices.push({
      size: random(30, 80),
      speed: random(0.002, 0.01),
      rotation: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Draw kaleidoscopic pattern
  translate(width/2, height/2);
  
  // Draw splines
  for (let s of splines) {
    s.points = [];
    stroke(s.hue, 80, 90, 0.7);
    noFill();
    
    beginShape();
    for (let i = 0; i < 12; i++) {
      let angle = map(i, 0, 12, 0, TWO_PI);
      let r = s.radius + sin(time * s.speed + angle) * 30;
      let x = r * cos(angle);
      let y = r * sin(angle);
      curveVertex(x, y);
      s.points.push({x, y});
    }
    endShape(CLOSE);
    
    // Connect splines to create interlocking effect
    for (let i = 0; i < s.points.length; i++) {
      let p1 = s.points[i];
      let p2 = s.points[(i + 3) % s.points.length];
      
      if (frameCount % 5 === 0) {
        stroke(s.hue, 80, 90, 0.3);
        line(p1.x, p1.y, p2.x, p2.p2y);
      }
    }
  }
  
  // Draw crystalline lattices
  for (let l of lattices) {
    l.rotation += l.speed;
    push();
    rotate(l.rotation);
    
    stroke(200, 80, 90, 0.6);
    noFill();
    
    // Create lattice pattern with sharp intersections
    for (let i = 0; i < 6; i++) {
      let angle = map(i, 0, 6, 0, TWO_PI);
      let x1 = l.size * cos(angle);
      let y1 = l.size * sin(angle);
      let x2 = l.size * cos(angle + PI/3);
      let y2 = l.size * sin(angle + PI/3);
      
      line(x1, y1, x2, y2);
    }
    
    // Add interlocking sharp elements
    for (let i = 0; i < 8; i++) {
      let angle = map(i, 0, 8, 0, TWO_PI);
      let x = l.size * 0.7 * cos(angle);
      let y = l.size * 0.7 * sin(angle);
      
      stroke(180, 80, 90, 0.4);
      point(x, y);
    }
    
    pop();
  }
  
  // Add fluid interaction effect
  if (frameCount % 3 === 0) {
    for (let i = 0; i < 5; i++) {
      let x = random(-width/2, width/2);
      let y = random(-height/2, height/2);
      let size = random(2, 6);
      
      stroke(300, 80, 90, 0.2);
      noFill();
      ellipse(x, y, size, size);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
