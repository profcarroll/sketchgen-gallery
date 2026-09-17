let shapes = [];
let time = 0;

function setup() {
  createCanvas(600, 600);
  noStroke();
  for (let i = 0; i < 20; i++) {
    shapes.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      speed: random(0.01, 0.03),
      angle: random(TWO_PI),
      color: color(random(255), random(255), random(255), 180)
    });
  }
}

function draw() {
  background(10);
  time += 0.01;

  for (let i = 0; i < shapes.length; i++) {
    let s = shapes[i];
    
    // Oscillating movement
    s.x += cos(s.angle) * s.speed * 10;
    s.y += sin(s.angle) * s.speed * 10;
    s.angle += 0.02;

    // Wrap around edges
    if (s.x < -50) s.x = width + 50;
    if (s.x > width + 50) s.x = -50;
    if (s.y < -50) s.y = height + 50;
    if (s.y > height + 50) s.y = -50;

    // Morphing size
    let morphSize = s.size + sin(time * s.speed * 10) * 20;
    
    // Color cycling
    let r = (sin(time * 0.02 + i) * 127 + 128);
    let g = (sin(time * 0.03 + i) * 127 + 128);
    let b = (sin(time * 0.04 + i) * 127 + 128);
    fill(r, g, b, 180);

    // Draw shape with oscillating form
    push();
    translate(s.x, s.y);
    rotate(time * s.speed);
    
    if (i % 3 === 0) {
      ellipse(0, 0, morphSize, morphSize);
    } else if (i % 3 === 1) {
      triangle(0, -morphSize/2, morphSize/2, morphSize/2, -morphSize/2, morphSize/2);
    } else {
      rectMode(CENTER);
      rect(0, 0, morphSize, morphSize);
    }
    
    pop();
  }

  // Interweave connections
  for (let i = 0; i < shapes.length; i++) {
    for (let j = i + 1; j < shapes.length; j++) {
      let d = dist(shapes[i].x, shapes[i].y, shapes[j].x, shapes[j].y);
      if (d < 150) {
        stroke(255, 30);
        strokeWeight(map(d, 0, 150, 2, 0.2));
        line(shapes[i].x, shapes[i].y, shapes[j].x, shapes[j].y);
      }
    }
  }
}
