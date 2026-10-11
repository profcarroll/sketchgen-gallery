let plumes = [];
let strata = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create geological strata
  for (let i = 0; i < 20; i++) {
    strata.push({
      radius: 150 + i * 10,
      color: color(20 + i * 3, 30, 20 + i * 2)
    });
  }

  // Create thermal plumes
  for (let i = 0; i < 8; i++) {
    plumes.push({
      id: i,
      x: random(-100, 100),
      y: random(-100, 100),
      z: random(-50, 50),
      size: random(5, 20),
      speed: random(0.005, 0.02),
      intensity: random(0.5, 1)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Camera movement
  let camX = sin(time * 0.1) * 300;
  let camY = cos(time * 0.1) * 300;
  let camZ = 300 + sin(time * 0.05) * 200;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Draw strata
  for (let stratum of strata) {
    noStroke();
    fill(stratum.color);
    sphere(stratum.radius);
  }

  // Draw plumes
  for (let plume of plumes) {
    push();
    translate(plume.x, plume.y, plume.z);
    
    // Animate plume
    let pulse = sin(time * plume.speed + plume.id) * 0.5 + 0.5;
    let scale = plume.size * (1 + pulse * 0.5);
    
    // Glow effect
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = color(28, 100, 100, 0.7);
    
    fill(color(28, 100, 100, 0.7));
    sphere(scale);
    
    // Core
    noStroke();
    fill(color(35, 100, 100, 0.9));
    sphere(scale * 0.4);
    
    drawingContext.shadowBlur = 0;
    pop();
    
    // Update plume position
    plume.x += sin(time * 0.05 + plume.id) * 0.2;
    plume.y += cos(time * 0.05 + plume.id) * 0.2;
    plume.z += sin(time * 0.03 + plume.id) * 0.1;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
