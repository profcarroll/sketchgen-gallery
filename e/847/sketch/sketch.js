let particles = [];
let connections = [];
let pastelColors = [];
let jewelColors = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  // Generate pastel colors (soft hues)
  for (let i = 0; i < 20; i++) {
    pastelColors.push(color(random(20, 40), random(50, 80), random(80, 95)));
  }

  // Generate jewel tones (rich saturated colors)
  for (let i = 0; i < 30; i++) {
    jewelColors.push(color(random(10, 30), random(70, 90), random(60, 90)));
  }

  // Create particles with positions and colors
  for (let i = 0; i < 800; i++) {
    let x = random(width);
    let y = random(height);
    let colorChoice = random() > 0.5 ? random(jewelColors) : random(pastelColors);
    particles.push({ x, y, color: colorChoice });
  }

  // Connect nearby particles to form the web
  for (let i = 0; i < particles.length; i++) {
    let p1 = particles[i];
    for (let j = i + 1; j < particles.length; j++) {
      let p2 = particles[j];
      let d = dist(p1.x, p1.y, p2.x, p2.y);
      if (d < 100) {
        connections.push({ p1, p2 });
      }
    }
  }
}

function draw() {
  background(0, 0, 95); // Soft cream background

  // Draw connections (gossamer web)
  strokeWeight(0.5);
  for (let conn of connections) {
    let alpha = map(dist(conn.p1.x, conn.p1.y, conn.p2.x, conn.p2.y), 0, 100, 20, 5);
    stroke(hue(conn.p1.color), saturation(conn.p1.color), brightness(conn.p1.color), alpha);
    line(conn.p1.x, conn.p1.y, conn.p2.x, conn.p2.y);
  }

  // Draw particles
  noStroke();
  for (let p of particles) {
    fill(p.color);
    ellipse(p.x, p.y, 3, 3);
  }

  // Ensure no motion - freeze the frame
  noLoop();
}
