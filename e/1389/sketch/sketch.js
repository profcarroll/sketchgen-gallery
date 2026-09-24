let shapes = [];
let palette1, palette2;
let time = 0;
let patternMode = false;
let patternTime = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create two palettes
  palette1 = [
    color(200, 80, 20),   // Deep blue
    color(180, 70, 30),   // Mid blue
    color(60, 50, 40),    // Golden yellow
    color(40, 40, 50),    // Pale gold
    color(200, 90, 15)    // Deep turquoise
  ];
  
  palette2 = [
    color(210, 100, 30),  // Deeper blue
    color(190, 90, 40),   // Deeper mid blue
    color(70, 60, 50),    // Rich gold
    color(50, 50, 60),    // Deeper pale gold
    color(210, 100, 20)   // Deep turquoise
  ];
  
  // Initialize shapes
  for (let i = 0; i < 100; i++) {
    shapes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      size: random(50, 200),
      speed: random(0.001, 0.005),
      hue: random(360),
      rotation: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 0, 1);
  
  time += 0.002;
  
  // Draw gradient background
  drawGradient();
  
  if (patternMode) {
    patternTime += 0.05;
    drawPattern();
  } else {
    drawShapes();
  }
}

function drawGradient() {
  // Create a subtle gradient from top to bottom
  for (let y = -height/2; y < height/2; y += 10) {
    let inter = map(y, -height/2, height/2, 0, 1);
    let c = lerpColor(palette1[0], palette1[4], inter);
    stroke(c);
    line(-width/2, y, width/2, y);
  }
}

function drawShapes() {
  for (let shape of shapes) {
    push();
    
    // Move shape
    shape.x += sin(time * shape.speed) * 0.5;
    shape.y += cos(time * shape.speed) * 0.5;
    shape.rotation += 0.01;
    
    // Keep shapes in bounds
    if (shape.x > width/2 + 200) shape.x = -width/2 - 200;
    if (shape.x < -width/2 - 200) shape.x = width/2 + 200;
    if (shape.y > height/2 + 200) shape.y = -height/2 - 200;
    if (shape.y < -height/2 - 200) shape.y = height/2 + 200;
    
    translate(shape.x, shape.y, shape.z);
    rotateZ(shape.rotation);
    
    // Draw fluid shape
    noStroke();
    fill(shape.hue, 80, 70, 0.3);
    sphere(shape.size * 0.5, 6, 4);
    
    pop();
  }
}

function drawPattern() {
  // Create geometric pattern from shapes
  let patternSize = map(sin(patternTime), -1, 1, 100, 300);
  
  for (let i = 0; i < 12; i++) {
    push();
    
    let angle = TWO_PI * i / 12;
    let radius = patternSize;
    
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    
    translate(x, y);
    
    // Draw connecting lines
    stroke(255, 80, 90, 0.7);
    noFill();
    beginShape();
    for (let j = 0; j < 12; j++) {
      let a = TWO_PI * j / 12;
      vertex(cos(a) * 50, sin(a) * 50);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Fade out pattern over time
  if (patternTime > TWO_PI) {
    patternMode = false;
    patternTime = 0;
  }
}

function mousePressed() {
  patternMode = true;
  patternTime = 0;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
