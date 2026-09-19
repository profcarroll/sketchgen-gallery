let cubeRotation = 0;
let globeSplines = [];
let emeraldParticles = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create decorative globe splines
  for (let i = 0; i < 8; i++) {
    globeSplines.push({
      angle: i * TWO_PI / 8,
      radius: 200 + random(-50, 50),
      rotation: random(TWO_PI),
      speed: random(0.001, 0.003)
    });
  }

  // Create emerald particles for crystalline latticework
  for (let i = 0; i < 1000; i++) {
    emeraldParticles.push({
      x: random(-100, 100),
      y: random(-100, 100),
      z: random(-100, 100),
      size: random(0.5, 2),
      speed: random(0.001, 0.005)
    });
  }
}

function draw() {
  background(0);
  noStroke();

  // Rotate the entire scene slowly
  rotateY(frameCount * 0.001);
  rotateX(frameCount * 0.0005);

  // Draw central rotating cube
  push();
  rotateY(cubeRotation);
  rotateX(cubeRotation * 0.7);
  cubeRotation += 0.01;
  
  // Copper segments on cube
  fill(30, 80, 60); // Tarnished copper color
  stroke(20, 90, 50);
  strokeWeight(1);
  box(100);
  
  // Emerald glass tracery on cube faces
  for (let i = 0; i < 6; i++) {
    push();
    translate(
      (i % 2 === 0 ? -50 : 50) * (i < 3 ? 1 : -1),
      (i % 3 === 0 ? -50 : 50) * (i < 3 ? 1 : -1),
      0
    );
    fill(140, 90, 80, 0.7); // Emerald glass
    stroke(140, 100, 90);
    strokeWeight(0.5);
    box(30, 30, 5);
    pop();
  }
  pop();

  // Draw globe splines
  for (let spline of globeSplines) {
    push();
    rotateY(spline.angle + frameCount * spline.speed);
    translate(0, 0, spline.radius);
    
    // Copper wireframe
    stroke(30, 80, 60);
    strokeWeight(1);
    noFill();
    sphere(20, 8, 8);
    
    // Emerald tracery segments
    fill(140, 90, 80, 0.5);
    stroke(140, 100, 90);
    strokeWeight(0.5);
    beginShape(POINTS);
    for (let i = 0; i < 200; i++) {
      let a = map(i, 0, 200, 0, TWO_PI * 4);
      let x = sin(a) * 18;
      let y = cos(a) * 18;
      let z = sin(a * 0.5) * 10;
      vertex(x, y, z);
    }
    endShape();
    pop();
  }

  // Draw crystalline latticework particles
  fill(140, 90, 80, 0.8); // Emerald color
  stroke(140, 100, 90);
  strokeWeight(0.5);
  beginShape(POINTS);
  for (let p of emeraldParticles) {
    p.x += sin(frameCount * p.speed) * 0.5;
    p.y += cos(frameCount * p.speed) * 0.5;
    p.z += sin(frameCount * p.speed * 0.7) * 0.5;
    
    vertex(p.x, p.y, p.z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
