let lights = [];
let structures = [];
let time = 0;
let nightCycle = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create city structures
  for (let i = 0; i < 50; i++) {
    structures.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      w: random(20, 80),
      h: random(100, 300),
      d: random(20, 80),
      rot: random(TWO_PI)
    });
  }

  // Create bioluminescent lights
  for (let i = 0; i < 200; i++) {
    lights.push({
      x: random(-width/2, width/2),
      y: random(-height/4, height/4),
      z: random(-height/2, height/2),
      size: random(5, 30),
      hue: random(120, 240),
      speed: random(0.01, 0.03),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  
  // Update time and night cycle
  time += 0.005;
  nightCycle = (sin(time * 0.2) + 1) / 2;

  // Ambient lighting based on day/night cycle
  let ambientLightLevel = map(nightCycle, 0, 1, 0.1, 0.8);
  ambientLight(ambientLightLevel * 255);

  // Dynamic directional light
  let lightX = sin(time * 0.3) * 200;
  let lightY = cos(time * 0.2) * 100;
  pointLight(255, 255, 255, lightX, lightY, 300);

  // Draw structures
  for (let structure of structures) {
    push();
    translate(structure.x, structure.y, structure.z);
    rotateY(structure.rot);
    
    // Create angular architecture
    fill(100, 20, 30 + nightCycle * 20);
    noStroke();
    box(structure.w, structure.h, structure.d);
    
    // Add windows that pulse with night cycle
    fill(60, 80, 80 + sin(time * 2 + structure.x) * 20);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 6; j++) {
        push();
        translate(
          -structure.w/2 + i * structure.w/3,
          -structure.h/2 + j * structure.h/6,
          structure.d/2 + 1
        );
        box(5, 10, 2);
        pop();
      }
    }
    pop();
  }

  // Draw bioluminescent lights with fractal trails
  for (let i = 0; i < lights.length; i++) {
    let light = lights[i];
    
    // Update position with wave motion
    light.x += sin(time * 0.5 + light.phase) * 0.5;
    light.y += cos(time * 0.3 + light.phase) * 0.5;
    light.z += sin(time * 0.4 + light.phase) * 0.3;
    
    // Pulsing effect
    let pulse = (sin(time * 2 + light.phase) + 1) / 2;
    let size = light.size * (0.7 + pulse * 0.3);
    
    // Fractal trail effect
    let trailLength = 50;
    push();
    translate(light.x, light.y, light.z);
    
    // Glow effect
    noStroke();
    fill(light.hue, 100, 100, 0.8);
    sphere(size * 0.7);
    
    // Light beam
    stroke(light.hue, 100, 100, 0.5);
    strokeWeight(2);
    line(0, 0, 0, 0, -size * 3, 0);
    
    pop();
  }

  // Add dynamic reflections on wet surfaces
  push();
  translate(0, height/4, 0);
  rotateX(HALF_PI);
  fill(200, 10, 50 + nightCycle * 30);
  noStroke();
  plane(width, height/2);
  pop();
}
