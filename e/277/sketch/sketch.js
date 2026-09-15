let structures = [];
let time = 0;
let pulsePhase = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create cityscape with angular structures
  for (let i = 0; i < 200; i++) {
    let x = random(-width/2, width/2);
    let z = random(-height/2, height/2);
    let h = random(50, 200);
    let w = random(10, 40);
    let d = random(10, 40);
    
    structures.push({
      x: x,
      y: h/2,
      z: z,
      width: w,
      depth: d,
      height: h,
      color: color(random(20, 40), 80, random(60, 90), 0.9),
      pulse: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  time += 0.005;
  pulsePhase = (pulsePhase + 0.02) % TWO_PI;
  
  // Camera movement for atmospheric transition
  let camX = sin(time * 0.3) * 1000;
  let camY = sin(time * 0.2) * 500;
  let camZ = cos(time * 0.2) * 1000;
  
  camera(camX, camY, camZ, 
         0, 0, 0, 
         0, 1, 0);
  
  // Lighting changes with time
  ambientLight(map(sin(time), -1, 1, 30, 80));
  let sun = color(60, 90, map(sin(time * 2), -1, 1, 70, 95));
  pointLight(sun, sin(time) * 1000, 1000, cos(time) * 1000);
  
  // Draw structures
  for (let i = 0; i < structures.length; i++) {
    let s = structures[i];
    
    push();
    translate(s.x, s.y, s.z);
    
    // Wet reflective surfaces
    fill(s.color);
    stroke(0, 0, 100, 0.3);
    strokeWeight(0.5);
    
    // Angular architecture
    box(s.width, s.height, s.depth);
    
    // Stress fractures
    drawFractures(s);
    
    pop();
  }
  
  // Bioluminescent pulses
  drawPulses();
}

function drawFractures(structure) {
  let pulse = sin(time + structure.pulse) * 0.5 + 0.5;
  let fractureCount = floor(map(pulse, 0, 1, 2, 8));
  
  for (let i = 0; i < fractureCount; i++) {
    push();
    translate(
      random(-structure.width/2, structure.width/2),
      random(-structure.height/2, structure.height/2),
      random(-structure.depth/2, structure.depth/2)
    );
    
    let size = random(5, 20);
    let glow = map(sin(time * 3 + i), -1, 1, 0.3, 0.8);
    
    noStroke();
    fill(200, 100, 100, glow);
    sphere(size * 0.5);
    
    pop();
  }
}

function drawPulses() {
  // Global bioluminescent pulses
  let pulse = sin(pulsePhase) * 0.5 + 0.5;
  let glowIntensity = map(pulse, 0, 1, 0.2, 0.8);
  
  noStroke();
  fill(180, 100, 100, glowIntensity);
  
  // Draw subtle glow around city
  for (let i = 0; i < 50; i++) {
    let x = random(-width/2, width/2);
    let z = random(-height/2, height/2);
    let size = random(100, 300);
    
    sphere(size * 0.5);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
