let particles = [];
let particleCount = 1500;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize particles with subtle noise-based movement
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      size: random(1, 3),
      speed: random(0.001, 0.005),
      hue: random(30, 60), // amber range
      saturation: random(70, 90),
      brightness: random(80, 100),
      alpha: random(0.2, 0.6),
      pulseSpeed: random(0.01, 0.03),
      pulsePhase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Camera movement for immersive effect
  let cx = sin(time * 0.1) * 50;
  let cy = cos(time * 0.1) * 50;
  let cz = -300 + sin(time * 0.05) * 100;
  camera(0, 0, cz, cx, cy, 0, 0, 1, 0);

  // Draw particles as a point cloud for fluid effect
  noStroke();
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];

    // Update position with noise-based movement
    let nx = noise(p.x * 0.002, p.y * 0.002, time * 0.5) - 0.5;
    let ny = noise(p.x * 0.002, p.y * 0.002, time * 0.5 + 1000) - 0.5;
    let nz = noise(p.x * 0.002, p.y * 0.002, time * 0.5 + 2000) - 0.5;

    p.x += nx * p.speed * 100;
    p.y += ny * p.speed * 100;
    p.z += nz * p.speed * 100;

    // Pulsing effect
    let pulse = sin(time * p.pulseSpeed + p.pulsePhase) * 0.5 + 0.5;
    let size = p.size * (1 + pulse * 0.5);

    // Layered mineral deposits
    let mineralHue = (p.hue + sin(time * 0.02 + i) * 20) % 360;
    fill(mineralHue, p.saturation, p.brightness, p.alpha);
    
    // Add particle to point cloud
    vertex(p.x, p.y, p.z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
