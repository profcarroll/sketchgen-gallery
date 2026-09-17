let circles = [];
let filaments = [];
let time = 0;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize overlapping translucent circles
  for (let i = 0; i < 200; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      radius: random(50, 200),
      speed: random(0.001, 0.005),
      hue: random(360),
      alpha: random(0.02, 0.08)
    });
  }

  // Initialize filament webbing
  for (let i = 0; i < 500; i++) {
    filaments.push({
      points: [],
      hue: random(200, 300),
      alpha: random(0.05, 0.15),
      speed: random(0.002, 0.008)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05); // Very slow fade for trail effect

  time += 0.01;

  // Draw and update circles
  for (let c of circles) {
    c.x += sin(time * c.speed) * 0.5;
    c.y += cos(time * c.speed) * 0.5;
    c.hue = (c.hue + 0.1) % 360;

    noFill();
    stroke(c.hue, 50, 90, c.alpha);
    ellipse(c.x, c.y, c.radius);
  }

  // Update and draw filaments
  for (let f of filaments) {
    if (f.points.length === 0) {
      f.points = [];
      let startAngle = time * f.speed;
      for (let i = 0; i < 20; i++) {
        let angle = startAngle + i * 0.5;
        let radius = 50 + sin(time * 0.3 + i) * 30;
        let x = width / 2 + cos(angle) * radius;
        let y = height / 2 + sin(angle) * radius;
        f.points.push({x, y});
      }
    }

    // Animate filament points
    for (let i = 0; i < f.points.length; i++) {
      let p = f.points[i];
      p.x += sin(time * f.speed + i) * 0.3;
      p.y += cos(time * f.speed + i) * 0.3;
    }

    // Draw filament
    noFill();
    stroke(f.hue, 60, 85, f.alpha);
    beginShape();
    for (let p of f.points) {
      curveVertex(p.x, p.y);
    }
    endShape(CLOSE);
  }
}
