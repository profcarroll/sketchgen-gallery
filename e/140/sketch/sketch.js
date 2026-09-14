let gridLines = [];
let glitchTime = 0;
let isGlitching = false;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  noStroke();

  // Create initial grid structure
  for (let i = 0; i < 20; i++) {
    let x = map(i, 0, 19, -width/2, width/2);
    let y = map(i, 0, 19, -height/2, height/2);
    gridLines.push({x: x, y: y});
  }
}

function draw() {
  background(0);
  ambientLight(50);
  pointLight(255, 255, 255, 0, 0, 100);

  // Continuous motion
  glitchTime += 0.01;
  
  if (isGlitching) {
    // Glitch effect
    let glitchOffset = sin(glitchTime * 100) * 50;
    for (let i = 0; i < gridLines.length; i++) {
      let line = gridLines[i];
      push();
      translate(line.x, line.y);
      rotateZ(sin(glitchTime + i) * 20);
      rotateY(cos(glitchTime + i) * 20);
      fill(255, 0, 255); // Neon pink
      box(10, 10, 10);
      pop();
    }
  } else {
    for (let i = 0; i < gridLines.length; i++) {
      let line = gridLines[i];
      push();
      translate(line.x, line.y);
      rotateZ(sin(glitchTime + i) * 10);
      rotateY(cos(glitchTime + i) * 10);
      fill(0, 255, 255); // Neon cyan
      box(10, 10, 10);
      pop();
    }
  }

  // Add floating geometric structures
  for (let i = 0; i < 30; i++) {
    let x = sin(glitchTime * 10 + i * 20) * width/4;
    let y = cos(glitchTime * 10 + i * 20) * height/4;
    let z = sin(glitchTime * 5 + i * 10) * 100;

    push();
    translate(x, y, z);
    rotateX(glitchTime * 30 + i * 5);
    rotateY(glitchTime * 20 + i * 7);
    fill(255, 255, 0); // Neon yellow
    sphere(10);
    pop();
  }

  // Add connecting lines between structures
  stroke(255, 0, 255);
  noFill();
  for (let i = 0; i < 30; i += 5) {
    let x1 = sin(glitchTime * 10 + i * 20) * width/4;
    let y1 = cos(glitchTime * 10 + i * 20) * height/4;
    let z1 = sin(glitchTime * 5 + i * 10) * 100;

    let x2 = sin(glitchTime * 10 + (i+5) * 20) * width/4;
    let y2 = cos(glitchTime * 10 + (i+5) * 20) * height/4;
    let z2 = sin(glitchTime * 5 + (i+5) * 10) * 100;

    line(x1, y1, z1, x2, y2, z2);
  }
}

function mousePressed() {
  isGlitching = true;
  setTimeout(() => {
    isGlitching = false;
  }, 500);
}
