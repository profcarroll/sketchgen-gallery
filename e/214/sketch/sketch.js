let shapes = [];
let colorShift = 0;

function setup() {
  createCanvas(800, 600);
  noStroke();
  for (let i = 0; i < 150; i++) {
    shapes.push({
      x: random(width),
      y: random(height),
      size: random(20, 100),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      color: color(random(50, 150), random(50, 150), random(100, 200), 100)
    });
  }
}

function draw() {
  colorShift += 0.005;
  let bg = lerpColor(color(10, 10, 30), color(30, 10, 50), sin(colorShift) * 0.5 + 0.5);
  background(bg);

  for (let i = 0; i < shapes.length; i++) {
    let s = shapes[i];
    s.x += s.speedX;
    s.y += s.speedY;

    if (s.x < 0 || s.x > width) s.speedX *= -1;
    if (s.y < 0 || s.y > height) s.speedY *= -1;

    fill(s.color);
    ellipse(s.x, s.y, s.size);
    
    // Draw connections to nearby shapes
    for (let j = i + 1; j < shapes.length; j++) {
      let other = shapes[j];
      let d = dist(s.x, s.y, other.x, other.y);
      if (d < 150) {
        stroke(255, 30);
        line(s.x, s.y, other.x, other.y);
      }
    }
  }
}
