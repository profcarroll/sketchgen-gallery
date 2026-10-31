let crystals = [];
let gridLines = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  frameRate(30);

  // Create a grid of base points
  for (let x = -width/2; x < width/2; x += 100) {
    for (let y = -height/2; y < height/2; y += 100) {
      gridLines.push({x, y});
    }
  }

  // Initialize crystals
  for (let i = 0; i < 50; i++) {
    crystals.push({
      x: random(-width/3, width/3),
      y: random(-height/3, height/3),
      z: random(-100, 100),
      size: random(20, 60),
      hue: random(10, 40), // Rusty orange to brown
      alpha: random(0.7, 1),
      growth: random(0.01, 0.03),
      rotX: random(TWO_PI),
      rotY: random(TWO_PI),
      rotZ: random(TWO_PI),
      speed: random(0.005, 0.01),
      age: random(100)
    });
  }
}

function draw() {
  background(20, 30, 10); // Deep dark background
  time += 0.01;

  // Camera movement for a sense of scale and depth
  let camX = sin(time * 0.1) * 200;
  let camY = cos(time * 0.1) * 200;
  let camZ = 500 + sin(time * 0.05) * 300;

  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Draw the grid base
  stroke(40, 20, 50);
  strokeWeight(1);
  beginShape(LINES);
  for (let point of gridLines) {
    vertex(point.x - 50, point.y, 0);
    vertex(point.x + 50, point.y, 0);
  }
  endShape();

  // Draw crystals
  noStroke();
  for (let crystal of crystals) {
    push();
    translate(crystal.x, crystal.y, crystal.z);
    
    // Apply rotation based on time and position
    rotateX(crystal.rotX + time * crystal.speed);
    rotateY(crystal.rotY + time * crystal.speed * 0.7);
    rotateZ(crystal.rotZ + time * crystal.speed * 0.3);

    // Grow the crystal over time
    crystal.size += sin(time + crystal.age) * crystal.growth;
    
    // Color based on hue and age
    fill(crystal.hue, 60, 80, crystal.alpha);
    
    // Draw a complex crystal shape using multiple geometries
    push();
    scale(crystal.size / 100);
    // Central core
    sphere(50);
    pop();
    
    // Crystal arms extending from the core
    for (let i = 0; i < 6; i++) {
      push();
      rotateZ(i * TWO_PI / 6);
      translate(0, -crystal.size * 0.7, 0);
      scale(1, crystal.size * 0.3, 1);
      box(20, 40, 20);
      pop();
    }
    
    // Outer shell
    push();
    scale(crystal.size / 80 + 0.5);
    sphere(60);
    pop();

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
