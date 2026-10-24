let gears = [];
let lightBeams = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create massive brass gears
  for (let i = 0; i < 20; i++) {
    gears.push({
      x: random(-width * 2, width * 2),
      y: random(-height * 2, height * 2),
      z: random(-1000, -500),
      size: random(100, 300),
      rotation: random(TWO_PI),
      speed: random(0.001, 0.005),
      hue: 30, // Brass color
      saturation: 20,
      brightness: 80
    });
  }

  // Create light beams
  for (let i = 0; i < 10; i++) {
    lightBeams.push({
      angle: random(TWO_PI),
      speed: random(0.002, 0.005),
      intensity: random(0.3, 0.8),
      width: random(50, 200)
    });
  }
}

function draw() {
  background(20, 5, 10); // Deep space color
  time += 0.01;

  // Draw the celestial loom environment
  drawLoom();

  // Draw gears
  for (let gear of gears) {
    drawGear(gear);
  }

  // Draw light beams
  for (let beam of lightBeams) {
    drawLightBeam(beam);
  }
}

function drawLoom() {
  // Draw a subtle grid to represent the vast loom structure
  stroke(60, 10, 30, 0.2);
  strokeWeight(0.5);
  
  for (let i = -10; i <= 10; i++) {
    line(i * 300, -height * 2, 0, i * 300, height * 2, 0);
    line(-width * 2, i * 300, 0, width * 2, i * 300, 0);
  }
}

function drawGear(gear) {
  push();
  translate(gear.x, gear.y, gear.z);
  
  // Rotate the gear
  gear.rotation += gear.speed;
  rotateZ(gear.rotation);

  // Draw the gear with a polished brass appearance
  fill(gear.hue, gear.saturation, gear.brightness, 0.9);
  stroke(20, 10, 90, 0.5);
  strokeWeight(1);

  // Draw gear teeth
  let toothCount = 24;
  for (let i = 0; i < toothCount; i++) {
    let angle = map(i, 0, toothCount, 0, TWO_PI);
    let x1 = cos(angle) * gear.size * 0.8;
    let y1 = sin(angle) * gear.size * 0.8;
    let x2 = cos(angle) * gear.size * 0.95;
    let y2 = sin(angle) * gear.size * 0.95;
    
    line(x1, y1, 0, x2, y2, 0);
  }

  // Draw central hub
  noStroke();
  sphere(gear.size * 0.2);

  pop();
}

function drawLightBeam(beam) {
  push();
  
  // Move beam angle over time
  beam.angle += beam.speed;
  
  let x = cos(beam.angle) * width * 2;
  let y = sin(beam.angle) * height * 2;
  
  // Draw the beam as a large, faint rectangle
  fill(180, 50, 90, beam.intensity);
  noStroke();
  rectMode(CENTER);
  rect(x, y, beam.width, height * 4);

  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
