let structures = [];
let bioluminescentPools = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 1);

  // Create angular cityscape with reflective surfaces
  for (let i = 0; i < 80; i++) {
    structures.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      w: random(30, 120),
      h: random(150, 400),
      d: random(30, 120),
      rot: random(TWO_PI),
      color: color(random(200, 240), 0.7, 0.2 + random(0.1))
    });
  }

  // Create bioluminescent pools that cast geometric reflections
  for (let i = 0; i < 30; i++) {
    bioluminescentPools.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      size: random(40, 100),
      pulseSpeed: random(0.015, 0.03),
      color: color(random(100, 140), 0.9, 0.8),
      intensity: random(0.6, 1.0)
    });
  }
}

function draw() {
  time += 0.008;
  
  background(0);
  noStroke();
  
  // Camera movement for dynamic view
  let camX = sin(time * 0.15) * width/3;
  let camY = sin(time * 0.1) * height/6;
  let camZ = cos(time * 0.1) * height/2 + height/2;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Draw structures with wet reflective surfaces
  for (let s of structures) {
    push();
    translate(s.x, s.y, s.z);
    rotateY(s.rot);
    
    // Dynamic color based on time and position
    let c = lerpColor(color(220, 0.7, 0.15), color(240, 0.8, 0.25), 
      (sin(time + s.x * 0.01) + 1) * 0.5);
    fill(c);
    box(s.w, s.h, s.d);
    
    // Wet surface highlights
    fill(255, 0.2);
    beginShape();
    for (let i = 0; i < 4; i++) {
      let angle = TWO_PI * i / 4;
      let x = cos(angle) * s.w/2;
      let z = sin(angle) * s.d/2;
      vertex(x, -s.h/2 + 5, z);
    }
    endShape(CLOSE);
    pop();
  }

  // Draw bioluminescent pools with stable geometric reflections
  for (let pool of bioluminescentPools) {
    let pulse = sin(time * pool.pulseSpeed) * 0.5 + 0.5;
    let size = pool.size * pulse * pool.intensity;
    
    push();
    translate(pool.x, pool.y, pool.z);
    
    // Pool glow
    fill(pool.color);
    sphere(size);
    
    // Stable geometric reflections on ground
    noFill();
    stroke(pool.color);
    strokeWeight(2);
    ellipse(0, 0, size * 1.5, size * 0.8); // Circular reflection
    
    // Additional geometric reflections
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI * i / 6;
      let x = cos(angle) * size * 0.7;
      let z = sin(angle) * size * 0.7;
      vertex(x, 0, z);
    }
    endShape(CLOSE);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
