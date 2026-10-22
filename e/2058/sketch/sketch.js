let particles = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize particles for smoke plumes
  for (let i = 0; i < 1000; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      size: random(2, 8),
      speed: random(0.001, 0.003),
      phase: random(TWO_PI),
      originalZ: random(-500, 500)
    });
  }
}

function draw() {
  background(230, 90, 10, 1); // Deep indigo/sapphire blue
  time += 0.01;

  // Camera movement for dynamic view
  let camX = sin(time * 0.1) * 100;
  let camY = cos(time * 0.05) * 50;
  camera(0, 0, (height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0);
  translate(camX, camY, 0);

  // Draw particles
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Oscillating vertical movement simulating subsurface pressure
    let offset = sin(time * p.speed + p.phase) * 30;
    let y = p.y + offset;

    // Horizontal drift for fluid motion
    let x = p.x + sin(time * 0.005 + p.phase) * 10;
    
    // Pulsing size and glow effect
    let pulse = sin(time * 0.02 + p.phase) * 0.5 + 0.5;
    let size = p.size * (1 + pulse * 0.5);

    // Position in 3D space with z-depth
    let z = p.z + p.originalZ;

    // Color based on depth and time for phosphorescent glow
    let hue = map(z, -500, 500, 200, 180); // Deep blue to indigo
    let sat = 70 + sin(time + z * 0.001) * 30;
    let bright = 60 + cos(time * 0.5 + z * 0.001) * 40;

    fill(hue, sat, bright, 0.3);
    
    // Vertex with position
    vertex(x, y, z);
  }
  endShape();
}
