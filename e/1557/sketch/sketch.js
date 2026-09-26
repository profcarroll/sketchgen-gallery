let cables = [];
let grids = [];
let particles = [];
const cableCount = 200;
const gridCount = 8;
const particleCount = 150;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  // Create cables
  for (let i = 0; i < cableCount; i++) {
    cables.push({
      points: [],
      length: random(200, 400),
      hue: random(20, 50), // Dark colors
      sat: random(30, 60),
      bri: random(10, 30)
    });
  }

  // Initialize cable paths
  for (let cable of cables) {
    let x = random(width);
    let y = random(height);
    let z = random(-100, 100);

    cable.points.push(createVector(x, y, z));

    let angle = random(TWO_PI);
    let prevPoint = cable.points[0];
    for (let i = 1; i < cable.length; i++) {
      let dx = cos(angle) * random(5, 20);
      let dy = sin(angle) * random(5, 20);
      let dz = random(-10, 10);

      let newPoint = createVector(
        prevPoint.x + dx,
        prevPoint.y + dy,
        prevPoint.z + dz
      );

      // Keep cables within canvas bounds
      if (newPoint.x < 0 || newPoint.x > width ||
          newPoint.y < 0 || newPoint.y > height ||
          newPoint.z < -200 || newPoint.z > 200) {
        newPoint.x = constrain(newPoint.x, 0, width);
        newPoint.y = constrain(newPoint.y, 0, height);
        newPoint.z = constrain(newPoint.z, -200, 200);
      }

      cable.points.push(newPoint);
      angle += random(-0.5, 0.5);
    }
  }

  // Create grids
  for (let i = 0; i < gridCount; i++) {
    grids.push({
      points: [],
      hue: random(180, 300), // Vibrant colors
      sat: 100,
      bri: 100,
      size: random(50, 200)
    });
  }

  // Initialize grid paths
  for (let grid of grids) {
    let centerX = random(width);
    let centerY = random(height);
    let size = grid.size;
    let rows = floor(random(3, 8));
    let cols = floor(random(3, 8));

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let x = centerX - size/2 + (size / cols) * c;
        let y = centerY - size/2 + (size / rows) * r;
        grid.points.push(createVector(x, y));
      }
    }
  }

  // Create particles along cables
  for (let i = 0; i < particleCount; i++) {
    let cableIndex = floor(random(cables.length));
    let pointIndex = floor(random(cables[cableIndex].points.length));
    let pos = cables[cableIndex].points[pointIndex].copy();
    
    particles.push({
      pos: pos,
      cableIndex: cableIndex,
      pointIndex: pointIndex,
      speed: random(0.5, 2),
      hue: random(180, 300), // Vibrant colors
      sat: 100,
      bri: 100,
      size: random(2, 6)
    });
  }
}

function draw() {
  background(0);
  noFill();

  // Draw cables
  strokeWeight(1);
  for (let cable of cables) {
    stroke(cable.hue, cable.sat, cable.bri, 0.7);
    beginShape();
    for (let point of cable.points) {
      vertex(point.x, point.y);
    }
    endShape();
  }

  // Draw grids
  strokeWeight(1);
  for (let grid of grids) {
    stroke(grid.hue, grid.sat, grid.bri, 0.8);
    beginShape();
    for (let point of grid.points) {
      vertex(point.x, point.y);
    }
    endShape();
  }

  // Update and draw particles
  for (let particle of particles) {
    // Move along cable path
    let cable = cables[particle.cableIndex];
    let nextPointIndex = (particle.pointIndex + 1) % cable.points.length;
    let target = cable.points[nextPointIndex];
    
    let dir = p5.Vector.sub(target, particle.pos);
    let distance = dir.mag();
    
    if (distance < 2) {
      particle.pointIndex = nextPointIndex;
    } else {
      dir.normalize();
      dir.mult(particle.speed);
      particle.pos.add(dir);
    }

    // Draw glowing particle
    noStroke();
    fill(particle.hue, particle.sat, particle.bri, 0.9);
    ellipse(particle.pos.x, particle.pos.y, particle.size);
    
    // Add pulse effect
    let pulse = sin(frameCount * 0.1 + particle.pointIndex) * 0.5 + 0.5;
    fill(particle.hue, particle.sat, particle.bri, pulse * 0.8);
    ellipse(particle.pos.x, particle.pos.y, particle.size * (1 + pulse));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
