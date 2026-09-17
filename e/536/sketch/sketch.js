let lines = [];
let grid = [];

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  noFill();
  strokeWeight(1);

  // Create a grid of points for line intersections
  let gridSize = 40;
  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      grid.push({x, y});
    }
  }

  // Initialize lines
  for (let i = 0; i < 150; i++) {
    lines.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      life: random(100, 200),
      maxLife: 200,
      hue: random(360)
    });
  }
}

function draw() {
  background(0, 0, 10);

  // Draw city grid lines
  stroke(0, 0, 80, 0.2);
  for (let i = 0; i < grid.length; i++) {
    let g = grid[i];
    line(g.x, 0, g.x, height);
    line(0, g.y, width, g.y);
  }

  // Update and draw lines
  for (let i = lines.length - 1; i >= 0; i--) {
    let l = lines[i];

    // Move the line
    l.x += l.vx;
    l.y += l.vy;

    // Bounce off edges
    if (l.x < 0 || l.x > width) l.vx *= -1;
    if (l.y < 0 || l.y > height) l.vy *= -1;

    // Fade out
    l.life--;
    if (l.life <= 0) {
      lines.splice(i, 1);
      lines.push({
        x: random(width),
        y: random(height),
        vx: random(-0.5, 0.5),
        vy: random(-0.5, 0.5),
        life: random(100, 200),
        maxLife: 200,
        hue: random(360)
      });
    }

    // Draw the line
    let alpha = map(l.life, 0, l.maxLife, 0, 0.7);
    stroke(l.hue, 80, 90, alpha);
    point(l.x, l.y);

    // Occasionally create a flash shape
    if (random() < 0.01) {
      let size = random(5, 20);
      let flashHue = (l.hue + random(-30, 30)) % 360;
      stroke(flashHue, 100, 100, 0.9);
      if (random() < 0.5) {
        rect(l.x - size/2, l.y - size/2, size, size);
      } else {
        ellipse(l.x, l.y, size, size);
      }
    }
  }

  // Occasionally add new lines
  if (random() < 0.1 && lines.length < 200) {
    lines.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      life: random(100, 200),
      maxLife: 200,
      hue: random(360)
    });
  }
}
