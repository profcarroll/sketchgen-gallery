let fragments = [];
let patternLines = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 1);

  // Create stone fragments with random positions and rotations
  for (let i = 0; i < 300; i++) {
    fragments.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      size: random(10, 50),
      rotationX: random(TWO_PI),
      rotationY: random(TWO_PI),
      rotationZ: random(TWO_PI),
      rx: random(-0.001, 0.001),
      ry: random(-0.001, 0.001),
      rz: random(-0.001, 0.001),
      color: color(random(0.05, 0.15), random(0.4, 0.7), random(0.3, 0.6)),
      collapseTime: random(1000, 5000)
    });
  }

  // Create geometric patterns in the rock
  for (let i = 0; i < 200; i++) {
    patternLines.push({
      x1: random(-width/2, width/2),
      y1: random(-height/2, height/2),
      z1: random(-500, 500),
      x2: random(-width/2, width/2),
      y2: random(-height/2, height/2),
      z2: random(-500, 500),
      hue: random(0.05, 0.15),
      saturation: random(0.3, 0.6),
      brightness: random(0.7, 0.9)
    });
  }
}

function draw() {
  background(0.02);
  noStroke();

  // Camera slowly orbits the scene
  time = millis() * 0.0002;
  camera(
    sin(time) * width/2,
    sin(time * 0.5) * height/4,
    cos(time) * width/2 + 300,
    0, 0, 0,
    0, 1, 0
  );

  // Update and draw fragments
  for (let i = 0; i < fragments.length; i++) {
    let f = fragments[i];
    
    // Apply slow rotation to each fragment
    f.rotationX += f.rx;
    f.rotationY += f.ry;
    f.rotationZ += f.rz;

    // Random collapse effect over time
    if (frameCount > f.collapseTime) {
      f.x += random(-0.5, 0.5);
      f.y += random(-0.5, 0.5);
      f.z += random(-0.5, 0.5);
      f.size *= 0.99;
    }

    // Draw fragment
    push();
    translate(f.x, f.y, f.z);
    rotateX(f.rotationX);
    rotateY(f.rotationY);
    rotateZ(f.rotationZ);
    
    // Create a rough stone-like appearance with multiple polygons
    fill(f.color);
    for (let j = 0; j < 5; j++) {
      let angle = map(j, 0, 5, 0, TWO_PI);
      let radius = f.size * (0.8 + sin(time * 2 + j) * 0.2);
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      
      push();
      translate(x, y, 0);
      sphere(f.size * 0.2, 3, 2);
      pop();
    }
    
    // Draw main fragment as a polyhedron
    beginShape();
    for (let j = 0; j < 8; j++) {
      let angle = map(j, 0, 8, 0, TWO_PI);
      let x = cos(angle) * f.size;
      let y = sin(angle) * f.size;
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    
    pop();
  }

  // Draw geometric patterns revealed by erosion
  strokeWeight(1);
  
  beginShape(LINES);
  for (let i = 0; i < patternLines.length; i++) {
    let line = patternLines[i];
    
    stroke(line.hue, line.saturation, line.brightness);
    vertex(line.x1, line.y1, line.z1);
    vertex(line.x2, line.y2, line.z2);
  }
  endShape();

  // Add subtle flowing lines to show fault activity
  stroke(0.1, 0.3, 0.8);
  strokeWeight(0.5);
  beginShape(LINES);
  for (let i = 0; i < 200; i++) {
    let t = i / 200;
    let x = map(t, 0, 1, -width/2, width/2);
    let y = sin(t * TWO_PI * 3 + time) * height/4;
    let z = random(-500, 500);
    
    vertex(x, y, z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
