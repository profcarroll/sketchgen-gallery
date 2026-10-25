let structures = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create petrified forest cross-sections
  for (let i = 0; i < 150; i++) {
    structures.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      sizeX: random(20, 80),
      sizeY: random(20, 80),
      sizeZ: random(50, 150),
      rotation: random(TWO_PI),
      hue: random(180, 240), // Blue to cyan range
      saturation: random(60, 80),
      brightness: random(70, 90),
      opacity: random(0.3, 0.7),
      growth: random(0.001, 0.005)
    });
  }
}

function draw() {
  background(20, 10, 5); // Deep black background

  time += 0.002;

  // Camera movement
  let camX = sin(time * 0.3) * width/6;
  let camY = sin(time * 0.2) * height/8;
  let camZ = cos(time * 0.2) * width/4 + 500;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Draw structures
  for (let structure of structures) {
    push();
    translate(structure.x, structure.y, structure.z);
    rotateY(structure.rotation);
    
    // Simulate slow accretion
    let scale = sin(time * structure.growth + PI/2) * 0.5 + 0.5;
    
    fill(structure.hue, structure.saturation, structure.brightness, structure.opacity);
    noStroke();

    // Draw a crystalline cross-section (simplified)
    beginShape(QUADS);
    vertex(-structure.sizeX/2, -structure.sizeY/2, -structure.sizeZ/2 * scale);
    vertex(structure.sizeX/2, -structure.sizeY/2, -structure.sizeZ/2 * scale);
    vertex(structure.sizeX/2, structure.sizeY/2, -structure.sizeZ/2 * scale);
    vertex(-structure.sizeX/2, structure.sizeY/2, -structure.sizeZ/2 * scale);
    
    vertex(-structure.sizeX/2, -structure.sizeY/2, structure.sizeZ/2 * scale);
    vertex(structure.sizeX/2, -structure.sizeY/2, structure.sizeZ/2 * scale);
    vertex(structure.sizeX/2, structure.sizeY/2, structure.sizeZ/2 * scale);
    vertex(-structure.sizeX/2, structure.sizeY/2, structure.sizeZ/2 * scale);
    endShape();

    // Draw internal cross-hatching
    stroke(structure.hue, structure.saturation, 100, 0.5);
    strokeWeight(0.5);
    noFill();
    
    beginShape(LINES);
    vertex(-structure.sizeX/2, -structure.sizeY/2, 0);
    vertex(structure.sizeX/2, structure.sizeY/2, 0);
    vertex(structure.sizeX/2, -structure.sizeY/2, 0);
    vertex(-structure.sizeX/2, structure.sizeY/2, 0);
    endShape();

    pop();
  }
}

function mousePressed() {
  // Create a data spike effect
  let spike = {
    x: random(-width/2, width/2),
    y: random(-height/2, height/2),
    z: random(-300, 300),
    size: random(100, 300),
    hue: random(300, 360), // Magenta range
    pulse: 0
  };
  
  // Flash effect at click location
  stroke(spike.hue, 100, 100, 0.8);
  noFill();
  strokeWeight(5);
  
  beginShape(LINES);
  vertex(spike.x - spike.size/2, spike.y, spike.z);
  vertex(spike.x + spike.size/2, spike.y, spike.z);
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
