let crystals = [];
let time = 0;
let pendulumAngle = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create nested crystal formations
  for (let i = 0; i < 50; i++) {
    let x = random(-width/3, width/3);
    let y = random(-height/4, height/4);
    let z = random(-200, -50);
    let size = random(10, 40);
    crystals.push({
      x,
      y,
      z,
      size,
      hue: random(200, 280),
      saturation: random(70, 90),
      brightness: random(60, 90),
      spinX: random(0.01, 0.03),
      spinY: random(0.01, 0.03),
      spinZ: random(0.01, 0.03),
      pulseSpeed: random(0.02, 0.05),
      connections: []
    });
  }

  // Connect crystals to form a network
  for (let i = 0; i < crystals.length; i++) {
    let c1 = crystals[i];
    for (let j = i + 1; j < crystals.length; j++) {
      let c2 = crystals[j];
      let d = dist(c1.x, c1.y, c1.z, c2.x, c2.y, c2.z);
      if (d < 150) {
        c1.connections.push(j);
        c2.connections.push(i);
      }
    }
  }
}

function draw() {
  background(20, 10, 5); // Deep space black

  time += 0.01;
  pendulumAngle = sin(time * 0.3) * 0.2;

  // Central pendulum effect
  push();
  translate(0, 0, -200);
  rotateY(pendulumAngle);
  stroke(240, 80, 100);
  strokeWeight(2);
  line(-50, 0, 0, 50, 0, 0);
  pop();

  // Draw crystals
  for (let crystal of crystals) {
    push();
    translate(crystal.x, crystal.y, crystal.z);
    
    // Pulsing and spinning effect
    let pulse = sin(time * crystal.pulseSpeed + crystal.x * 0.01) * 0.5 + 0.5;
    let brightness = crystal.brightness * (0.7 + pulse * 0.3);
    
    rotateX(time * crystal.spinX);
    rotateY(time * crystal.spinY);
    rotateZ(time * crystal.spinZ);

    // Crystal structure
    noStroke();
    fill(crystal.hue, crystal.saturation, brightness);
    
    push();
    scale(crystal.size);
    drawCrystalStructure();
    pop();

    // Connections between crystals
    stroke(crystal.hue, 60, 80, 0.5);
    strokeWeight(1);
    for (let i = 0; i < crystal.connections.length; i++) {
      let other = crystals[crystal.connections[i]];
      line(0, 0, 0, other.x - crystal.x, other.y - crystal.y, other.z - crystal.z);
    }

    pop();
  }
}

function drawCrystalStructure() {
  // Draw a simple crystal shape with nested structures
  push();
  scale(1, 1, 0.5);
  sphere(1, 8, 6);
  pop();

  push();
  rotateX(PI/4);
  rotateY(PI/4);
  scale(0.7, 0.7, 1);
  sphere(1, 8, 6);
  pop();

  push();
  rotateX(-PI/4);
  rotateY(-PI/4);
  scale(0.5, 0.5, 1);
  sphere(1, 8, 6);
  pop();
}
