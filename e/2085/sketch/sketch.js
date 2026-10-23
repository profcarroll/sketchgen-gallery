let crystals = [];
let particles = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial crystal formations
  for (let i = 0; i < 20; i++) {
    crystals.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, -100),
      size: random(20, 60),
      age: 0,
      maxAge: random(200, 400),
      color: color(random(200, 260), 80, 90, 0.8)
    });
  }
  
  // Create background particles
  for (let i = 0; i < 1000; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-800, -200),
      size: random(0.5, 2),
      speed: random(0.1, 0.3)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Camera movement
  let camX = sin(time * 0.1) * 200;
  let camY = cos(time * 0.05) * 100;
  camera(camX, camY, height / 2, 0, 0, 0, 0, 1, 0);
  
  // Draw background particles
  stroke(200, 30, 80, 0.3);
  strokeWeight(0.5);
  noFill();
  
  for (let p of particles) {
    let x = p.x + sin(time * p.speed) * 10;
    let y = p.y + cos(time * p.speed) * 10;
    let z = p.z + sin(time * p.speed * 0.5) * 10;
    
    point(x, y, z);
  }
  
  // Draw and update crystals
  for (let i = crystals.length - 1; i >= 0; i--) {
    let c = crystals[i];
    c.age++;
    
    if (c.age > c.maxAge) {
      crystals.splice(i, 1);
      continue;
    }
    
    // Pulsing effect
    let pulse = sin(c.age * 0.1 + time) * 0.3 + 0.7;
    let size = c.size * pulse;
    
    push();
    translate(c.x, c.y, c.z);
    
    // Draw crystal with multiple layers
    fill(c.color);
    noStroke();
    
    // Base structure
    for (let j = 0; j < 6; j++) {
      rotate(PI / 3);
      push();
      scale(1, 1, size * 0.5);
      sphere(size * 0.3, 4, 2);
      pop();
    }
    
    // Growing branches
    for (let j = 0; j < 8; j++) {
      let angle = TWO_PI * j / 8;
      let branchLength = size * 0.5;
      
      push();
      rotate(angle);
      translate(0, 0, branchLength);
      scale(1, 1, branchLength * 0.3);
      sphere(size * 0.2, 4, 2);
      pop();
    }
    
    pop();
  }
  
  // Occasionally spawn new crystals
  if (frameCount % 60 === 0 && crystals.length < 50) {
    crystals.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: -800,
      size: random(30, 70),
      age: 0,
      maxAge: random(300, 500),
      color: color(random(200, 260), 80, 90, 0.8)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
