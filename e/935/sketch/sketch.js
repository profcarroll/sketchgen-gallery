let cells = [];
let connections = [];
let glowPoints = [];
let time = 0;

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = random(8, 16);
    this.color = color(random(100, 255), random(100, 255), random(200, 255), 200);
    this.glowIntensity = 0;
    this.birthTime = time;
  }

  update() {
    if (time - this.birthTime < 30) {
      this.glowIntensity = map(time - this.birthTime, 0, 30, 1, 0);
    }
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2);

    if (this.glowIntensity > 0) {
      fill(red(this.color), green(this.color), blue(this.color), 50 * this.glowIntensity);
      ellipse(this.x, this.y, this.radius * 4 * this.glowIntensity);
    }
  }
}

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 255);
  noStroke();
  frameRate(30);

  for (let i = 0; i < 50; i++) {
    cells.push(new Cell(random(width), random(height)));
  }
}

function draw() {
  background(10, 10, 10);

  time++;

  // Add new cells occasionally
  if (random() < 0.02) {
    cells.push(new Cell(random(width), random(height)));
  }

  // Update and display cells
  for (let i = 0; i < cells.length; i++) {
    cells[i].update();
    cells[i].display();
  }

  // Connect nearby cells
  connections = [];
  for (let i = 0; i < cells.length; i++) {
    for (let j = i + 1; j < cells.length; j++) {
      let d = dist(cells[i].x, cells[i].y, cells[j].x, cells[j].y);
      if (d < 150) {
        connections.push({ a: cells[i], b: cells[j] });
      }
    }
  }

  // Draw connections
  stroke(200, 100, 200, 50);
  strokeWeight(1);
  for (let conn of connections) {
    line(conn.a.x, conn.a.y, conn.b.x, conn.b.y);
  }

  // Highlight new cells with glows
  if (cells.length > 0 && time % 10 === 0) {
    let newCell = cells[cells.length - 1];
    glowPoints.push({
      x: newCell.x,
      y: newCell.y,
      intensity: 1,
      age: 0
    });
  }

  // Update and draw glow points
  for (let i = glowPoints.length - 1; i >= 0; i--) {
    let gp = glowPoints[i];
    gp.age++;
    gp.intensity = map(gp.age, 0, 30, 1, 0);
    
    if (gp.intensity <= 0) {
      glowPoints.splice(i, 1);
    } else {
      noStroke();
      fill(255, 200, 200, gp.intensity * 100);
      ellipse(gp.x, gp.y, 30 * gp.intensity);
    }
  }

  // Pulsing ambient light
  let pulse = sin(time * 0.05) * 0.2 + 0.8;
  fill(200, 50, 150, 20 * pulse);
  rect(0, 0, width, height);
}
