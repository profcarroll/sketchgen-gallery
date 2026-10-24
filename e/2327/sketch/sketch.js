let crystals = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial crystal formations
  for (let i = 0; i < 30; i++) {
    crystals.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, -100),
      size: random(20, 60),
      age: 0,
      maxAge: random(300, 600),
      color: color(random(200, 260), 80, 90, 0.8),
      pulseOffset: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Camera movement
  let camX = sin(time * 0.05) * 200;
  let camY = cos(time * 0.03) * 100;
  camera(camX, camY, height / 2, 0, 0, 0, 0, 1, 0);
  
  // Draw and update crystals
  for (let i = crystals.length - 1; i >= 0; i--) {
    let c = crystals[i];
    c.age++;
    
    if (c.age > c.maxAge) {
      crystals.splice(i, 1);
      continue;
    }
    
    // Pulsing effect with rhythmic wave
    let pulse = sin(c.age * 0.05 + time + c.pulseOffset) * 0.4 + 0.6;
    let size = c.size * pulse;
    
    push();
    translate(c.x, c.y, c.z);
    
    // Draw crystal with organic growth
    fill(c.color);
    noStroke();
    
    // Core structure
    sphere(size * 0.3, 6, 4);
    
    // Branching structures that grow and reform
    for (let j = 0; j < 8; j++) {
      let angle = TWO_PI * j / 8;
      let branchLength = size * 0.5 + sin(time * 0.5 + j) * 10;
      
      push();
      rotate(angle);
      translate(0, 0, branchLength);
      scale(1, 1, branchLength * 0.3);
      sphere(size * 0.2, 4, 2);
      pop();
    }
    
    // Organic flowing surface
    for (let j = 0; j < 12; j++) {
      let angle = TWO_PI * j / 12;
      let r = size * 0.8 + sin(time * 0.3 + j) * 5;
      
      push();
      rotate(angle);
      translate(r, 0, 0);
      sphere(size * 0.1, 4, 2);
      pop();
    }
    
    pop();
  }
  
  // Occasionally spawn new crystals
  if (frameCount % 90 === 0 && crystals.length < 60) {
    crystals.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: -800,
      size: random(30, 70),
      age: 0,
      maxAge: random(400, 700),
      color: color(random(200, 260), 80, 90, 0.8),
      pulseOffset: random(TWO_PI)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
