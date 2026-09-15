let forms = [];
let particles = [];
let grid = [];
let synthesisActive = false;
let synthesisCenter;
let synthesisTime = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize forms
  for (let i = 0; i < 20; i++) {
    forms.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-200, 200),
      size: random(50, 150),
      rotation: random(TWO_PI),
      type: floor(random(3)),
      color: color(random(20, 40), random(30, 60), random(70, 90), 0.7)
    });
  }
  
  // Initialize particles
  for (let i = 0; i < 500; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      size: random(1, 4),
      speed: random(0.5, 2)
    });
  }
  
  // Grid for spatial hashing
  let gridSize = 50;
  for (let x = -width/2; x < width/2; x += gridSize) {
    grid.push([]);
    for (let y = -height/2; y < height/2; y += gridSize) {
      grid[grid.length-1].push([]);
    }
  }
}

function draw() {
  background(0, 0, 5);
  
  // Update and draw particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Slow drift
    p.x += sin(frameCount * 0.001 + i) * p.speed;
    p.y += cos(frameCount * 0.001 + i) * p.speed;
    p.z += sin(frameCount * 0.0005 + i) * p.speed;
    
    // Wrap around
    if (p.x > width/2 + 50) p.x = -width/2 - 50;
    if (p.x < -width/2 - 50) p.x = width/2 + 50;
    if (p.y > height/2 + 50) p.y = -height/2 - 50;
    if (p.y < -height/2 - 50) p.y = height/2 + 50;
    
    // Draw particle
    push();
    translate(p.x, p.y, p.z);
    noStroke();
    fill(200, 30, 90, 0.6);
    sphere(p.size);
    pop();
  }
  
  // Draw forms
  for (let i = 0; i < forms.length; i++) {
    let f = forms[i];
    
    // Slow movement and rotation
    f.x += sin(frameCount * 0.0002 + i) * 0.5;
    f.y += cos(frameCount * 0.0003 + i) * 0.5;
    f.z += sin(frameCount * 0.0001 + i) * 0.2;
    f.rotation += 0.002;
    
    // Draw form based on type
    push();
    translate(f.x, f.y, f.z);
    rotateZ(f.rotation);
    
    noStroke();
    
    switch (f.type) {
      case 0: // Grid
        fill(f.color);
        box(f.size, f.size, 5);
        break;
      case 1: // Schematic lines
        stroke(f.color);
        strokeWeight(2);
        line(-f.size/2, -f.size/2, 0, f.size/2, f.size/2, 0);
        line(f.size/2, -f.size/2, 0, -f.size/2, f.size/2, 0);
        break;
      case 2: // Silk screen
        fill(f.color);
        ellipse(0, 0, f.size, f.size);
        break;
    }
    
    pop();
  }
  
  // Handle synthesis
  if (synthesisActive) {
    synthesisTime++;
    let t = map(min(synthesisTime, 120), 0, 120, 0, 1);
    
    // Draw synthetic object
    push();
    translate(0, 0, 0);
    rotateX(t * PI/4);
    rotateY(t * PI/3);
    rotateZ(t * PI/6);
    
    noStroke();
    fill(255, 90, 90, 0.8);
    sphere(100, 10, 10);
    
    pop();
    
    // Dissolve after a while
    if (synthesisTime > 120) {
      synthesisActive = false;
      synthesisTime = 0;
    }
  }
}

function mousePressed() {
  if (!synthesisActive) {
    synthesisActive = true;
    synthesisCenter = {x: mouseX, y: mouseY};
    synthesisTime = 0;
  }
}
