let grid = [];
const cols = 40;
const rows = 30;
const cellSize = 15;
let moss = [];
let splinters = [];
let streams = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  // Initialize grid with bright pixels
  for (let y = 0; y < rows; y++) {
    grid[y] = [];
    for (let x = 0; x < cols; x++) {
      if (random() > 0.7) {
        grid[y][x] = color(
          random(100, 255),
          random(100, 255),
          random(100, 255)
        );
      } else {
        grid[y][x] = color(0);
      }
    }
  }

  // Initialize moss
  for (let i = 0; i < 50; i++) {
    moss.push({
      x: random(cols),
      y: random(rows),
      size: random(1, 3),
      speed: random(0.005, 0.02),
      age: 0,
      maxAge: random(200, 500)
    });
  }
}

function draw() {
  background(0);

  // Draw grid
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] !== color(0)) {
        fill(grid[y][x]);
        noStroke();
        rect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

  // Update and draw moss
  for (let i = 0; i < moss.length; i++) {
    let m = moss[i];
    
    // Grow moss
    m.age += 1;
    if (m.age > m.maxAge) {
      m.age = 0;
      m.x = random(cols);
      m.y = random(rows);
    }

    // Apply some randomness to movement
    m.x += sin(frameCount * m.speed) * 0.5;
    m.y += cos(frameCount * m.speed) * 0.5;

    // Keep within bounds
    m.x = constrain(m.x, 0, cols - 1);
    m.y = constrain(m.y, 0, rows - 1);

    // Draw moss
    noStroke();
    fill(30, 200, 30, 150);
    ellipse(
      m.x * cellSize + cellSize / 2,
      m.y * cellSize + cellSize / 2,
      m.size * 2,
      m.size * 2
    );

    // Fade out underlying pixel and create splinters
    let gridX = floor(m.x);
    let gridY = floor(m.y);
    if (gridX >= 0 && gridX < cols && gridY >= 0 && gridY < rows) {
      let c = grid[gridY][gridX];
      if (c !== color(0)) {
        let r = red(c);
        let g = green(c);
        let b = blue(c);
        
        // Create splinters
        for (let j = 0; j < 3; j++) {
          splinters.push({
            x: gridX * cellSize + cellSize / 2,
            y: gridY * cellSize + cellSize / 2,
            vx: random(-1, 1),
            vy: random(-1, 1),
            life: 255,
            color: color(r, g, b, 255)
          });
        }
        
        // Fade the pixel
        grid[gridY][gridX] = color(r * 0.98, g * 0.98, b * 0.98);
      }
    }
  }

  // Update and draw splinters
  for (let i = splinters.length - 1; i >= 0; i--) {
    let s = splinters[i];
    
    s.x += s.vx;
    s.y += s.vy;
    s.life -= 2;
    
    if (s.life <= 0) {
      splinters.splice(i, 1);
    } else {
      fill(s.color);
      noStroke();
      ellipse(s.x, s.y, 3, 3);
    }
  }

  // Update and draw streams
  for (let i = streams.length - 1; i >= 0; i--) {
    let stream = streams[i];
    
    // Update the stream's particles
    for (let j = 0; j < stream.particles.length; j++) {
      let p = stream.particles[j];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      
      if (p.life <= 0) {
        stream.particles.splice(j, 1);
        j--;
      }
    }
    
    // Remove empty streams
    if (stream.particles.length === 0) {
      streams.splice(i, 1);
    } else {
      // Draw the stream
      noFill();
      stroke(stream.color);
      strokeWeight(2);
      beginShape();
      for (let j = 0; j < stream.particles.length; j++) {
        let p = stream.particles[j];
        vertex(p.x, p.y);
      }
      endShape();
    }
  }

  // Occasionally create new streams from splinters
  if (frameCount % 30 === 0 && splinters.length > 0) {
    let streamParticles = [];
    for (let i = 0; i < min(10, splinters.length); i++) {
      let s = splinters[i];
      streamParticles.push({
        x: s.x,
        y: s.y,
        vx: random(-0.5, 0.5),
        vy: random(-0.5, 0.5),
        life: 100
      });
    }
    
    streams.push({
      particles: streamParticles,
      color: color(random(100, 255), random(100, 255), random(100, 255))
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
