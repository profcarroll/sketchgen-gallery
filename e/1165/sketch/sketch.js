let particles = [];
let lattice;
let isForming = true;
let pulse = 0;
let fft;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 255);
  noStroke();

  // Initialize particles with random positions and velocities
  for (let i = 0; i < 1600; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-1, 1),
      vy: random(-1, 1),
      hue: random(255),
      size: random(2, 6)
    });
  }

  // Create a lattice structure
  lattice = [];
  for (let i = 0; i < 20; i++) {
    let row = [];
    for (let j = 0; j < 20; j++) {
      row.push({
        x: width / 2 + (i - 10) * 20,
        y: height / 2 + (j - 10) * 20,
        targetX: width / 2 + (i - 10) * 20,
        targetY: height / 2 + (j - 10) * 20,
        size: 8
      });
    }
    lattice.push(row);
  }

  // Setup audio
  fft = new p5.FFT();
}

function draw() {
  background(0, 0, 0, 10); // Semi-transparent background for trail effect

  if (isForming) {
    // Initial chaotic motion
    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      fill(p.hue, 255, 255);
      ellipse(p.x, p.y, p.size);

      // Slowly attract towards lattice points
      let minDist = Infinity;
      let closestLatticePoint = null;

      for (let row of lattice) {
        for (let point of row) {
          let d = dist(p.x, p.y, point.x, point.y);
          if (d < minDist) {
            minDist = d;
            closestLatticePoint = point;
          }
        }
      }

      if (closestLatticePoint && minDist > 5) {
        let force = 0.01;
        p.vx += (closestLatticePoint.x - p.x) * force;
        p.vy += (closestLatticePoint.y - p.y) * force;
      }
    }

    // Gradually form the lattice
    for (let i = 0; i < lattice.length; i++) {
      for (let j = 0; j < lattice[i].length; j++) {
        let point = lattice[i][j];
        point.targetX += random(-0.5, 0.5);
        point.targetY += random(-0.5, 0.5);

        point.x += (point.targetX - point.x) * 0.05;
        point.y += (point.targetY - point.y) * 0.05;
      }
    }

    // Transition to stable lattice
    if (frameCount > 120) {
      isForming = false;
    }
  } else {
    // Stable lattice with pulsing effect
    pulse += 0.05;

    for (let i = 0; i < lattice.length; i++) {
      for (let j = 0; j < lattice[i].length; j++) {
        let point = lattice[i][j];
        let pulseOffset = sin(pulse + i * 0.2 + j * 0.2) * 5;
        point.size = 8 + pulseOffset;

        fill(180, 255, 255, 200);
        ellipse(point.x, point.y, point.size);

        // Draw connecting lines
        if (i < lattice.length - 1) {
          let nextPoint = lattice[i + 1][j];
          stroke(180, 255, 255, 100);
          line(point.x, point.y, nextPoint.x, nextPoint.y);
        }
        if (j < lattice[i].length - 1) {
          let nextPoint = lattice[i][j + 1];
          stroke(180, 255, 255, 100);
          line(point.x, point.y, nextPoint.x, nextPoint.y);
        }
      }
    }

    // Visualize audio if available
    let spectrum = fft.analyze();
    let bass = fft.getEnergy('bass');
    let mid = fft.getEnergy('mid');
    let treble = fft.getEnergy('treble');

    if (bass > 100) {
      background(0, 0, 20, 10);
    }
  }

  // Ensure the canvas is changing
  if (frameCount % 30 === 0) {
    // Minor visual update every 30 frames to ensure motion
    noStroke();
    fill(255, 10);
    ellipse(random(width), random(height), 2);
  }
}

function mousePressed() {
  userStartAudio();
}
