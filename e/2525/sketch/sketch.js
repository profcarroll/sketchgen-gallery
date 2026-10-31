let crystals = [];
let seismicWaves = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  pixelDensity(1);

  // Create crystalline structures
  for (let i = 0; i < 200; i++) {
    crystals.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(5, 20),
      rotationX: random(TWO_PI),
      rotationY: random(TWO_PI),
      rotationZ: random(TWO_PI),
      rotationSpeedX: random(-0.01, 0.01),
      rotationSpeedY: random(-0.01, 0.01),
      rotationSpeedZ: random(-0.01, 0.01),
      hue: random(360),
      saturation: random(70, 100),
      brightness: random(80, 100),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(20, 5, 10); // Deep dark blue-gray
  time += 0.02;

  // Draw crystalline structures
  for (let crystal of crystals) {
    push();
    
    translate(crystal.x, crystal.y, crystal.z);
    
    // Apply pulsing effect based on time and position
    let pulse = sin(time + crystal.phase) * 0.3 + 1.0;
    let scale = crystal.size * pulse;
    
    // Apply rotation
    rotateX(crystal.rotationX);
    rotateY(crystal.rotationY);
    rotateZ(crystal.rotationZ);
    
    // Draw geometric crystal structure
    fill(crystal.hue, crystal.saturation, crystal.brightness, 0.8);
    noStroke();
    
    // Create a complex geometric shape (like a truncated octahedron)
    beginShape();
    for (let i = 0; i < 24; i++) {
      let angle1 = map(i, 0, 24, 0, TWO_PI);
      let angle2 = map(i % 6, 0, 6, 0, TWO_PI/3);
      let x = cos(angle1) * scale * (i % 2 === 0 ? 1.2 : 1);
      let y = sin(angle1) * scale * (i % 2 === 0 ? 1.2 : 1);
      let z = cos(angle2) * scale * 0.5;
      vertex(x, y, z);
    }
    endShape(CLOSE);
    
    // Update rotation
    crystal.rotationX += crystal.rotationSpeedX;
    crystal.rotationY += crystal.rotationSpeedY;
    crystal.rotationZ += crystal.rotationSpeedZ;
    
    pop();
  }

  // Create seismic ripple effect
  if (frameCount % 30 === 0) {
    seismicWaves.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      radius: 0,
      maxRadius: random(150, 300),
      opacity: 1
    });
  }

  // Update and draw seismic waves
  for (let i = seismicWaves.length - 1; i >= 0; i--) {
    let wave = seismicWaves[i];
    wave.radius += 2;
    wave.opacity -= 0.01;

    if (wave.opacity <= 0) {
      seismicWaves.splice(i, 1);
      continue;
    }

    push();
    translate(wave.x, wave.y, 0);
    
    // Create ripple effect with pulsing color
    let hue = (time * 20 + wave.radius * 0.5) % 360;
    stroke(hue, 80, 100, wave.opacity);
    noFill();
    ellipse(0, 0, wave.radius * 2);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
