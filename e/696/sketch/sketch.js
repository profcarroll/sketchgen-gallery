let structures = [];
let bioluminescentPlants = [];
let ripples = [];
let crystallineTrails = [];
let metallicDeposits = [];
let liquidLayers = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  frameRate(30);

  // Create towering cityscape structures
  for (let i = 0; i < 50; i++) {
    structures.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      w: random(20, 60),
      h: random(100, 300),
      d: random(20, 60),
      color: color(random(200, 240), 50, 70)
    });
  }

  // Create bioluminescent plants
  for (let i = 0; i < 100; i++) {
    bioluminescentPlants.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      size: random(5, 20),
      hue: random(120, 180),
      pulseSpeed: random(0.02, 0.05),
      pulsePhase: random(TWO_PI)
    });
  }

  // Initialize liquid layers
  for (let i = 0; i < 5; i++) {
    liquidLayers.push({
      y: map(i, 0, 4, -height/4, height/4),
      color: color(random(200, 240), 60, 80, 0.7)
    });
  }
}

function draw() {
  background(0);

  // Simple day/night cycle
  let time = millis() / 5000;
  let sunAngle = (time % TWO_PI) - PI/2;
  let lightIntensity = map(sin(sunAngle), -1, 1, 0.3, 1);
  ambientLight(20 * lightIntensity);

  // Directional light simulating sun
  let sunX = sin(sunAngle) * 500;
  let sunZ = cos(sunAngle) * 500;
  directionalLight(255, 255, 255, sunX, -500, sunZ);

  // Draw structures
  for (let s of structures) {
    push();
    translate(s.x, s.y - s.h/2, s.z);
    fill(s.color);
    noStroke();
    box(s.w, s.h, s.d);
    pop();
  }

  // Draw bioluminescent plants
  for (let plant of bioluminescentPlants) {
    let pulse = sin(plant.pulsePhase + time * plant.pulseSpeed) * 0.5 + 0.5;
    let size = plant.size * pulse;

    push();
    translate(plant.x, plant.y, plant.z);
    fill(plant.hue, 100, 100, 0.8);
    noStroke();
    sphere(size);
    pop();
  }

  // Draw ripples from plants
  for (let i = ripples.length - 1; i >= 0; i--) {
    let r = ripples[i];
    r.size += 2;
    r.alpha -= 0.02;

    if (r.alpha <= 0) {
      ripples.splice(i, 1);
      continue;
    }

    push();
    translate(r.x, r.y, r.z);
    fill(0, 0, 100, r.alpha);
    noStroke();
    sphere(r.size);
    pop();
  }

  // Draw crystalline trails
  for (let i = crystallineTrails.length - 1; i >= 0; i--) {
    let trail = crystallineTrails[i];
    trail.life -= 1;
    
    if (trail.life <= 0) {
      crystallineTrails.splice(i, 1);
      continue;
    }

    push();
    translate(trail.x, trail.y, trail.z);
    fill(240, 80, 90, 0.7);
    noStroke();
    sphere(3);
    pop();
  }

  // Draw metallic deposits
  for (let i = metallicDeposits.length - 1; i >= 0; i--) {
    let deposit = metallicDeposits[i];
    deposit.life -= 1;
    
    if (deposit.life <= 0) {
      metallicDeposits.splice(i, 1);
      continue;
    }

    push();
    translate(deposit.x, deposit.y, deposit.z);
    fill(60, 80, 90, 0.6);
    noStroke();
    sphere(2);
    pop();
  }

  // Draw liquid layers
  for (let layer of liquidLayers) {
    push();
    translate(0, layer.y, 0);
    fill(layer.color);
    noStroke();
    plane(width/2, height/2);
    pop();
  }

  // Add some random ripple effects
  if (random() < 0.1) {
    ripples.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      size: 5,
      alpha: 1
    });
  }

  // Add some crystalline trails occasionally
  if (random() < 0.03) {
    crystallineTrails.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      life: 100
    });
  }

  // Add metallic deposits occasionally
  if (random() < 0.01) {
    metallicDeposits.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      life: 150
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
