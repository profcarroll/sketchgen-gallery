let shapes = [];
let time = 0;

function setup() {
  createCanvas(800, 600);
  noStroke();
  
  // Initialize with a base set of Fibonacci-based shapes
  for (let i = 0; i < 50; i++) {
    const size = 20 + (i % 7) * 15;
    const x = random(width);
    const y = random(height);
    const speed = 0.005 + (i % 3) * 0.002;
    const angleSpeed = 0.001 + (i % 4) * 0.001;
    shapes.push({
      x, y, size, speed, angleSpeed, 
      angle: random(TWO_PI),
      color: color(random(100, 255), random(100, 255), random(100, 255), 180)
    });
  }
}

function draw() {
  background(10);
  
  time += 0.01;
  
  for (let i = 0; i < shapes.length; i++) {
    const s = shapes[i];
    
    // Fibonacci-inspired motion
    const fib = (i % 8) + 1;
    s.x += sin(time * s.speed * fib) * 0.5;
    s.y += cos(time * s.speed * fib) * 0.5;
    s.angle += s.angleSpeed * fib;
    
    // Warp shape size
    const scale = 1 + sin(time * 0.02 + i) * 0.3;
    const w = s.size * scale;
    const h = s.size * scale * 0.7;
    
    // Draw the shape with warp effect
    push();
    translate(s.x, s.y);
    rotate(s.angle);
    fill(s.color);
    
    if (i % 4 === 0) {
      ellipse(0, 0, w, h);
    } else if (i % 4 === 1) {
      rectMode(CENTER);
      rect(0, 0, w, h);
    } else if (i % 4 === 2) {
      triangle(-w/2, h/2, w/2, h/2, 0, -h/2);
    } else {
      // Star shape
      beginShape();
      for (let a = 0; a < TWO_PI; a += TWO_PI / 5) {
        const outerX = cos(a) * w;
        const outerY = sin(a) * h;
        vertex(outerX, outerY);
        const innerX = cos(a + TWO_PI / 10) * w * 0.4;
        const innerY = sin(a + TWO_PI / 10) * h * 0.4;
        vertex(innerX, innerY);
      }
      endShape(CLOSE);
    }
    
    pop();
  }
  
  // Draw connecting lines between nearby shapes
  for (let i = 0; i < shapes.length; i++) {
    const s1 = shapes[i];
    stroke(255, 30);
    noFill();
    for (let j = i + 1; j < shapes.length; j++) {
      const s2 = shapes[j];
      const d = dist(s1.x, s1.y, s2.x, s2.y);
      if (d < 150) {
        line(s1.x, s1.y, s2.x, s2.y);
      }
    }
  }
}
