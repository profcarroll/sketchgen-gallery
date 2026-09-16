let lights = [];
let grid = [];

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  noLoop();

  // Initialize light streaks
  for (let i = 0; i < 200; i++) {
    lights.push({
      x: random(width),
      y: random(height),
      vx: random(-1, 1),
      vy: random(-1, 1),
      hue: random(360),
      sat: random(80, 100),
      bri: random(70, 100),
      size: random(2, 8),
      life: random(100, 300)
    });
  }

  // Create a grid for intersections
  const gridSize = 40;
  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      grid.push({ x, y, size: gridSize });
    }
  }

  loop();
}

function draw() {
  background(0, 0, 0, 1);

  // Update and display light streaks
  for (let i = lights.length - 1; i >= 0; i--) {
    let l = lights[i];
    l.x += l.vx;
    l.y += l.vy;
    l.life--;

    if (l.life <= 0) {
      lights.splice(i, 1);
      lights.push({
        x: random(width),
        y: random(height),
        vx: random(-1, 1),
        vy: random(-1, 1),
        hue: random(360),
        sat: random(80, 100),
        bri: random(70, 100),
        size: random(2, 8),
        life: random(100, 300)
      });
    } else {
      fill(l.hue, l.sat, l.bri, 0.8);
      ellipse(l.x, l.y, l.size);

      // Check intersections with grid
      for (let g of grid) {
        const dx = l.x - g.x;
        const dy = l.y - g.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 20) {
          fill(l.hue, l.sat, l.bri, 0.95);
          ellipse(l.x, l.y, l.size * 3);
        }
      }

      // Draw connections between nearby lights
      for (let j = 0; j < lights.length; j++) {
        if (i === j) continue;
        let other = lights[j];
        let dx = l.x - other.x;
        let dy = l.y - other.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          stroke(l.hue, l.sat, l.bri, 0.2);
          line(l.x, l.y, other.x, other.y);
        }
      }
    }
  }

  // Occasionally add new light streaks
  if (frameCount % 30 === 0 && lights.length < 300) {
    lights.push({
      x: random(width),
      y: random(height),
      vx: random(-1, 1),
      vy: random(-1, 1),
      hue: random(360),
      sat: random(80, 100),
      bri: random(70, 100),
      size: random(2, 8),
      life: random(100, 300)
    });
  }
}
