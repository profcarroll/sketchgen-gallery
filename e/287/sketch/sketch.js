let lines = [];
let points = [];
let grid = [];
const GRID_SIZE = 20;
const PARTICLE_COUNT = 500;
const LINE_COUNT = 1000;
let time = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize grid
  for (let i = 0; i < GRID_SIZE; i++) {
    grid[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j] = { x: 0, y: 0, z: 0 };
    }
  }

  // Initialize particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    points.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      ox: random(1000),
      oy: random(1000),
      oz: random(1000),
      hue: random(360),
      size: random(2, 8)
    });
  }

  // Initialize lines
  for (let i = 0; i < LINE_COUNT; i++) {
    lines.push({
      x1: random(-width/2, width/2),
      y1: random(-height/2, height/2),
      z1: random(-100, 100),
      x2: random(-width/2, width/2),
      y2: random(-height/2, height/2),
      z2: random(-100, 100),
      hue: random(360),
      opacity: random(0.3, 0.8)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Move and update particles
  for (let i = 0; i < points.length; i++) {
    let p = points[i];
    p.x = noise(p.ox, time) * width - width/2;
    p.y = noise(p.oy, time) * height - height/2;
    p.z = noise(p.oz, time) * 200 - 100;

    p.ox += 0.005;
    p.oy += 0.005;
    p.oz += 0.005;
  }

  // Draw lines
  strokeWeight(1);
  beginShape(LINES);
  for (let i = 0; i < lines.length; i++) {
    let l = lines[i];
    stroke(l.hue, 100, 100, l.opacity);

    vertex(l.x1, l.y1, l.z1);
    vertex(l.x2, l.y2, l.z2);
  }
  endShape();

  // Draw points
  noStroke();
  beginShape(POINTS);
  for (let i = 0; i < points.length; i++) {
    let p = points[i];
    fill(p.hue, 100, 100, 0.8);
    vertex(p.x, p.y, p.z);
  }
  endShape();

  // Occasionally solidify into geometric forms
  if (frameCount % 120 === 0) {
    for (let i = 0; i < lines.length; i++) {
      let l = lines[i];
      if (random() > 0.7) {
        l.x1 = random(-width/2, width/2);
        l.y1 = random(-height/2, height/2);
        l.z1 = random(-100, 100);
        l.x2 = random(-width/2, width/2);
        l.y2 = random(-height/2, height/2);
        l.z2 = random(-100, 100);
      }
    }
  }
}
