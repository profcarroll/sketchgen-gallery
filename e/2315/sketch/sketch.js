let patches = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize irregular organic patches
  for (let i = 0; i < 30; i++) {
    patches.push({
      x: random(-width/3, width/3),
      y: random(-height/3, height/3),
      z: random(-200, 200),
      size: random(30, 80),
      growth: 0,
      maxGrowth: random(0.5, 1.2),
      hue: random(10, 40),
      saturation: random(60, 90),
      brightness: random(70, 90)
    });
  }
}

function draw() {
  background(0);
  time += 0.005;
  
  // Camera slowly orbits the scene
  let camX = sin(time * 0.1) * 400;
  let camY = cos(time * 0.05) * 200;
  camera(camX, camY, 600, 0, 0, 0, 0, 1, 0);
  
  // Draw dark substrate
  drawSubstrate();
  
  // Update and display patches
  for (let i = 0; i < patches.length; i++) {
    let p = patches[i];
    
    // Grow patch over time
    if (p.growth < p.maxGrowth) {
      p.growth += 0.001;
    }
    
    push();
    translate(p.x, p.y, p.z);
    
    // Pulsating glow effect
    let pulse = sin(time * 2 + i) * 0.1 + 0.9;
    fill(p.hue, p.saturation, p.brightness * pulse, 0.6);
    
    // Draw organic shape that pulls inward
    drawOrganicShape(p.size * p.growth);
    
    pop();
  }
}

function drawSubstrate() {
  // Draw a dark sediment layer at the bottom
  noStroke();
  fill(20, 10, 10, 0.3);
  beginShape(QUAD_STRIP);
  for (let i = 0; i < 20; i++) {
    let angle = map(i, 0, 19, 0, TWO_PI);
    let x = cos(angle) * 600;
    let y = sin(angle) * 600;
    vertex(x, -300, y);
    vertex(x, -290, y);
  }
  endShape();
}

function drawOrganicShape(size) {
  // Draw an amorphous organic shape
  push();
  
  // Central core
  fill(15, 80, 60, 0.7);
  sphere(size * 0.3);
  
  // Organic arms that pull inward
  for (let i = 0; i < 8; i++) {
    let angle = map(i, 0, 7, 0, TWO_PI);
    let armLength = size * 0.8;
    
    push();
    rotateY(angle);
    
    // Arm shape that curves inward
    fill(25, 70, 50, 0.6);
    beginShape();
    vertex(0, 0, 0);
    bezierVertex(
      armLength * 0.3, armLength * 0.1, 0,
      armLength * 0.5, -armLength * 0.1, 0,
      armLength * 0.7, 0, 0
    );
    endShape(CLOSE);
    
    pop();
  }
  
  // Inner structure forming dense tissue
  for (let i = 0; i < 12; i++) {
    let angle = map(i, 0, 11, 0, TWO_PI);
    let armLength = size * 0.6;
    
    push();
    rotateY(angle);
    
    // Inner tissue strands
    fill(30, 50, 40, 0.5);
    beginShape();
    vertex(0, 0, 0);
    bezierVertex(
      armLength * 0.2, armLength * 0.05, 0,
      armLength * 0.4, -armLength * 0.05, 0,
      armLength * 0.5, 0, 0
    );
    endShape(CLOSE);
    
    pop();
  }
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
