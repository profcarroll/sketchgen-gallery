let vents = [];
let connections = [];
let time = 0;
let maxVents = 300;
let pulseSpeed = 0.02;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  frameRate(30);

  // Create geothermal vents
  for (let i = 0; i < maxVents; i++) {
    vents.push({
      x: random(width),
      y: random(height),
      size: random(2, 8),
      hue: random(180, 240), // Blue-green range
      pulse: random(TWO_PI),
      isActive: random() > 0.3,
      connections: []
    });
  }

  // Connect vents that are close enough
  for (let i = 0; i < vents.length; i++) {
    for (let j = i + 1; j < vents.length; j++) {
      let d = dist(vents[i].x, vents[i].y, vents[j].x, vents[j].y);
      if (d < 150) {
        vents[i].connections.push(j);
        vents[j].connections.push(i);
      }
    }
  }
}

function draw() {
  background(20, 10, 5, 0.1); // Dark background with trail effect

  time += pulseSpeed;

  // Draw connections between vents
  strokeWeight(1);
  for (let i = 0; i < vents.length; i++) {
    let vent = vents[i];
    if (vent.connections.length > 0) {
      let hue = vent.hue;
      let alpha = 0.3 + 0.2 * sin(time + vent.pulse);
      stroke(hue, 80, 80, alpha);

      for (let j = 0; j < vent.connections.length; j++) {
        let otherVent = vents[vent.connections[j]];
        if (otherVent.isActive) {
          line(vent.x, vent.y, otherVent.x, otherVent.y);
        }
      }
    }
  }

  // Draw vents
  for (let i = 0; i < vents.length; i++) {
    let vent = vents[i];
    if (vent.isActive) {
      let pulse = sin(time + vent.pulse) * 0.5 + 0.5;
      let size = vent.size * (1 + pulse * 0.5);
      
      // Glowing effect
      fill(vent.hue, 90, 90, 0.8);
      ellipse(vent.x, vent.y, size * 2);

      // Inner core
      fill(vent.hue, 100, 100, 0.9);
      ellipse(vent.x, vent.y, size);
    }
  }

  // Add occasional new vents for dynamic growth
  if (random() < 0.002 && vents.length < maxVents) {
    vents.push({
      x: random(width),
      y: random(height),
      size: random(2, 8),
      hue: random(180, 240),
      pulse: random(TWO_PI),
      isActive: true,
      connections: []
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
