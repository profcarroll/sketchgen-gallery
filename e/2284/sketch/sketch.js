let gear;
let crystals = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create the central gear
  gear = createGear(200, 80, 12);

  // Create crystalline structures
  for (let i = 0; i < 500; i++) {
    crystals.push({
      x: random(-300, 300),
      y: random(-300, 300),
      z: random(-100, 100),
      size: random(2, 8),
      hue: random(200, 240),
      saturation: random(80, 100),
      brightness: random(70, 90),
      speed: random(0.001, 0.003),
      angle: random(TWO_PI)
    });
  }
}

function draw() {
  background(20, 50, 15); // Deep brass background
  
  // Create a dynamic blue gradient backdrop
  drawGradient();
  
  // Rotate the entire scene
  rotateY(time * 0.1);
  rotateX(sin(time * 0.3) * 0.2);
  
  // Draw the gear
  drawGear();
  
  // Draw crystalline structures
  drawCrystals();
  
  time += 0.01;
}

function drawGradient() {
  // Create a deep blue gradient for the backdrop
  for (let y = -height/2; y < height/2; y += 10) {
    let inter = map(y, -height/2, height/2, 0, 1);
    let c = lerpColor(color(200, 80, 5), color(200, 90, 15), inter);
    stroke(c);
    line(-width/2, y, width/2, y);
  }
}

function createGear(radius, toothHeight, numTeeth) {
  let gearGeometry = [];
  
  for (let i = 0; i < numTeeth; i++) {
    let angle = map(i, 0, numTeeth, 0, TWO_PI);
    let nextAngle = map(i + 1, 0, numTeeth, 0, TWO_PI);
    
    // Create a tooth
    let x1 = cos(angle) * radius;
    let y1 = sin(angle) * radius;
    let x2 = cos(nextAngle) * radius;
    let y2 = sin(nextAngle) * radius;
    
    gearGeometry.push({
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2
    });
  }
  
  return gearGeometry;
}

function drawGear() {
  // Draw the gear with brass coloring
  stroke(30, 80, 70);
  fill(30, 80, 70);
  
  // Main gear circle
  noStroke();
  sphere(200, 16, 16);
  
  // Gear teeth
  stroke(25, 90, 60);
  strokeWeight(2);
  fill(30, 80, 70);
  
  beginShape();
  for (let tooth of gear) {
    vertex(tooth.x1, tooth.y1, 0);
    vertex(tooth.x2, tooth.y2, 0);
  }
  endShape(CLOSE);
  
  // Inner circle
  noStroke();
  fill(35, 70, 40);
  sphere(80, 16, 16);
}

function drawCrystals() {
  // Use additive blending to create glowing effect
  blendMode(ADD);
  
  noStroke();
  
  beginShape(POINTS);
  for (let crystal of crystals) {
    // Animate crystals with noise and time
    let nX = noise(crystal.x * 0.002, crystal.y * 0.002, time * 0.5) * 2;
    let nY = noise(crystal.x * 0.002 + 1000, crystal.y * 0.002 + 1000, time * 0.5) * 2;
    
    // Update position
    crystal.x += cos(crystal.angle) * crystal.speed + nX;
    crystal.y += sin(crystal.angle) * crystal.speed + nY;
    
    // Wrap around edges
    if (crystal.x > 400) crystal.x = -400;
    if (crystal.x < -400) crystal.x = 400;
    if (crystal.y > 400) crystal.y = -400;
    if (crystal.y < -400) crystal.y = 400;
    
    // Set crystal color and vertex
    fill(crystal.hue, crystal.saturation, crystal.brightness, 0.8);
    vertex(crystal.x, crystal.y, crystal.z);
  }
  endShape();
  
  blendMode(BLEND);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
