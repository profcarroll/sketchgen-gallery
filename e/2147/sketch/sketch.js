let crystals = [];
let zoom = 1;
let targetZoom = 1;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create crystalline structures at the junction
  for (let i = 0; i < 150; i++) {
    crystals.push({
      x: random(-30, 30),
      y: random(-30, 30),
      z: random(-30, 30),
      size: random(0.5, 2),
      hue: random(360),
      saturation: random(80, 100),
      brightness: random(70, 100),
      angle: random(TWO_PI),
      spin: random(-0.01, 0.01),
      fractalDepth: floor(random(2, 5)),
      points: []
    });
  }
  
  // Generate fractal patterns for each crystal
  for (let crystal of crystals) {
    generateFractal(crystal);
  }
}

function draw() {
  background(0);
  
  // Smooth zoom effect
  zoom += (targetZoom - zoom) * 0.02;
  
  // Zoom into the center
  translate(0, 0, -300 / zoom);
  
  // Slow rotation for dynamic view
  rotateY(frameCount * 0.001);
  rotateX(frameCount * 0.0005);
  
  // Draw crystals with fractal patterns
  noStroke();
  for (let crystal of crystals) {
    push();
    
    translate(crystal.x, crystal.y, crystal.z);
    rotateZ(crystal.angle);
    
    // Apply spin
    crystal.angle += crystal.spin;
    
    // Create color with slight variation
    let c = color(crystal.hue, crystal.saturation, crystal.brightness);
    fill(c);
    
    // Draw main crystal shape
    drawCrystal(crystal);
    
    pop();
  }
  
  // Zoom deeper over time
  if (zoom < 15) {
    targetZoom += 0.03;
  }
}

function generateFractal(crystal) {
  crystal.points = [];
  const numPoints = 8 + crystal.fractalDepth * 4;
  
  for (let i = 0; i < numPoints; i++) {
    let angle = map(i, 0, numPoints, 0, TWO_PI);
    let radius = crystal.size * 1.5 * (1 + sin(frameCount * 0.01 + i));
    
    crystal.points.push({
      x: cos(angle) * radius,
      y: sin(angle) * radius,
      z: random(-crystal.size, crystal.size)
    });
  }
}

function drawCrystal(crystal) {
  // Draw base hexagonal crystal
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = map(i, 0, 6, 0, TWO_PI);
    let x = cos(angle) * crystal.size;
    let y = sin(angle) * crystal.size;
    vertex(x, y, 0);
  }
  endShape(CLOSE);
  
  // Draw fractal pattern
  beginShape(POINTS);
  for (let point of crystal.points) {
    vertex(point.x, point.y, point.z);
  }
  endShape();
}
