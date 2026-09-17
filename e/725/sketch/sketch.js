let ribbons = [];
let numRibbons = 12;
let flowSpeed = 0.01;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 1);

  // Create ribbons with different properties
  for (let i = 0; i < numRibbons; i++) {
    let r = {
      points: [],
      hue: i / numRibbons,
      width: random(20, 60),
      speed: random(0.005, 0.015),
      noiseScale: random(0.01, 0.03),
      noiseStrength: random(0.5, 2)
    };
    ribbons.push(r);
  }
}

function draw() {
  background(0);
  time += flowSpeed;

  // Camera movement for depth effect
  let camX = sin(time * 0.1) * 200;
  let camY = cos(time * 0.1) * 100;
  camera(0, 0, 500 + camY, 0, 0, 0, 0, 1, 0);

  // Draw ribbons
  for (let r of ribbons) {
    drawRibbon(r);
  }
}

function drawRibbon(r) {
  beginShape();
  noFill();
  stroke(r.hue, 0.8, 1, 0.8);
  strokeWeight(2);

  let t = time * r.speed;
  for (let i = 0; i < 100; i++) {
    let x = map(i, 0, 99, -width/2, width/2);
    let y = sin(x * r.noiseScale + t) * r.noiseStrength * 50;
    let z = cos(x * r.noiseScale * 0.5 + t) * r.noiseStrength * 30;
    
    vertex(x, y, z);
  }
  endShape();
  
  // Draw edges as glowing lines
  stroke(r.hue, 1, 1, 0.6);
  strokeWeight(1);
  beginShape();
  for (let i = 0; i < 100; i++) {
    let x = map(i, 0, 99, -width/2, width/2);
    let y = sin(x * r.noiseScale + t) * r.noiseStrength * 50 - r.width/2;
    let z = cos(x * r.noiseScale * 0.5 + t) * r.noiseStrength * 30;
    
    vertex(x, y, z);
  }
  endShape();
  
  beginShape();
  for (let i = 0; i < 100; i++) {
    let x = map(i, 0, 99, -width/2, width/2);
    let y = sin(x * r.noiseScale + t) * r.noiseStrength * 50 + r.width/2;
    let z = cos(x * r.noiseScale * 0.5 + t) * r.noiseStrength * 30;
    
    vertex(x, y, z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
