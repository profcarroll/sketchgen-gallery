let crystals = [];
let waves = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create crystalline structures
  for (let i = 0; i < 20; i++) {
    crystals.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, -1000),
      size: random(20, 60),
      rotation: random(TWO_PI),
      pulse: random(1),
      hue: random(80, 120)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Camera movement
  let cx = sin(time * 0.3) * 200;
  let cy = cos(time * 0.2) * 100;
  let cz = -500 + sin(time * 0.1) * 200;
  camera(0, 0, cz, cx, cy, 0, 0, 1, 0);
  
  // Draw crystals
  for (let crystal of crystals) {
    push();
    translate(crystal.x, crystal.y, crystal.z);
    rotateZ(crystal.rotation + time * 0.2);
    rotateX(time * 0.1);
    
    // Pulsing green light
    let pulse = sin(time * 3 + crystal.pulse) * 0.5 + 0.5;
    let glow = map(pulse, 0, 1, 0.7, 1);
    
    // Crystal structure
    fill(crystal.hue, 80, 90 * glow, 0.8);
    noStroke();
    
    // Draw a complex crystal structure
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI * i / 6;
      let x = cos(angle) * crystal.size * 0.8;
      let y = sin(angle) * crystal.size * 0.8;
      push();
      translate(x, y, 0);
      sphere(crystal.size * 0.3);
      pop();
    }
    
    // Central core
    fill(crystal.hue, 100, 100, 0.9);
    sphere(crystal.size * 0.4);
    
    pop();
    
    // Create wave effect
    if (frameCount % 5 === 0) {
      waves.push({
        x: crystal.x,
        y: crystal.y,
        z: crystal.z,
        size: 0,
        maxsize: random(100, 200),
        hue: crystal.hue,
        alpha: 0.8
      });
    }
    
    // Update waves
    for (let i = waves.length - 1; i >= 0; i--) {
      let wave = waves[i];
      wave.size += 2;
      wave.alpha -= 0.01;
      
      if (wave.alpha <= 0) {
        waves.splice(i, 1);
        continue;
      }
      
      push();
      translate(wave.x, wave.y, wave.z);
      noFill();
      stroke(wave.hue, 100, 80, wave.alpha);
      ellipse(0, 0, wave.size, wave.size);
      pop();
    }
  }
  
  // Move crystals deeper
  for (let crystal of crystals) {
    crystal.z += 3;
    if (crystal.z > 500) {
      crystal.z = -1000;
      crystal.x = random(-width/2, width/2);
      crystal.y = random(-height/2, height/2);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
