let fogParticles = [];
let oceanWaves = [];
let lightBeam;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize fog particles
  for (let i = 0; i < 2000; i++) {
    fogParticles.push({
      pos: createVector(random(-width, width), random(-height, height), random(-500, 500)),
      size: random(2, 8),
      speed: random(0.1, 0.5)
    });
  }

  // Initialize ocean waves
  for (let i = 0; i < 100; i++) {
    oceanWaves.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      speed: random(0.01, 0.03)
    });
  }

  // Create light beam shape
  lightBeam = createGraphics(100, 100);
  lightBeam.colorMode(HSB, 360, 100, 100, 1);
  lightBeam.noStroke();
  for (let i = 0; i < 100; i++) {
    const alpha = map(i, 0, 100, 0.8, 0);
    lightBeam.fill(60, 100, 100, alpha);
    lightBeam.rect(0, i, 100, 1);
  }
}

function draw() {
  background(0);

  // Update time
  time += 0.02;

  // Camera movement for dynamic view
  const camX = sin(time * 0.3) * 200;
  const camY = cos(time * 0.2) * 100;
  camera(0, -100, 500 + camY, 0, 0, 0, 0, 1, 0);
  
  // Draw fog
  drawFog();

  // Draw ocean surface
  drawOcean();

  // Draw lighthouse light beam
  drawLightBeam();
}

function drawFog() {
  noStroke();
  fill(240, 5, 90, 0.1);
  beginShape(QUADS);
  for (let p of fogParticles) {
    const x = p.pos.x + sin(time * p.speed) * 50;
    const y = p.pos.y + cos(time * p.speed) * 30;
    const z = p.pos.z;
    
    vertex(x - p.size, y - p.size, z);
    vertex(x + p.size, y - p.size, z);
    vertex(x + p.size, y + p.size, z);
    vertex(x - p.size, y + p.size, z);
  }
  endShape();
}

function drawOcean() {
  noStroke();
  fill(240, 70, 10, 0.8);
  beginShape(TRIANGLES);
  for (let wave of oceanWaves) {
    const x = wave.x + sin(time * wave.speed) * 100;
    const y = wave.y + cos(time * wave.speed) * 50;
    const z = -200 + sin(time * 0.1) * 20;
    
    vertex(x - wave.size, y - wave.size, z);
    vertex(x + wave.size, y - wave.size, z);
    vertex(x, y + wave.size, z);
  }
  endShape();
}

function drawLightBeam() {
  // Draw light beam
  push();
  translate(0, -300, 100);
  rotateX(HALF_PI);
  rotateZ(time * 0.5);
  
  texture(lightBeam);
  noStroke();
  fill(60, 100, 100, 0.8);
  plane(200, 1000);
  pop();
  
  // Draw light source
  push();
  translate(0, -300, 100);
  noStroke();
  fill(60, 100, 100);
  sphere(20);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
