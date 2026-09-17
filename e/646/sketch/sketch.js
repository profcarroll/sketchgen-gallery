let spheres = [];
let boxes = [];
let particles = [];
let time = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create sculptural forms
  for (let i = 0; i < 20; i++) {
    spheres.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      size: random(30, 80),
      speed: random(0.005, 0.02)
    });
  }

  for (let i = 0; i < 15; i++) {
    boxes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      size: random(40, 90),
      speed: random(0.005, 0.015)
    });
  }

  // Create particles for light field
  for (let i = 0; i < 1000; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      size: random(0.5, 3)
    });
  }
}

function draw() {
  background(240, 10, 10);
  
  time += 0.01;
  
  // Ambient lighting
  ambientLight(100);
  pointLight(255, 255, 255, 0, 0, 300);
  
  // Draw particles (light field)
  stroke(200, 80, 90, 0.7);
  noFill();
  beginShape(POINTS);
  for (let p of particles) {
    vertex(p.x, p.y, p.z);
  }
  endShape();
  
  // Draw spheres
  for (let s of spheres) {
    push();
    translate(s.x, s.y, s.z);
    rotateX(time * s.speed);
    rotateY(time * s.speed * 0.5);
    rotateZ(time * s.speed * 0.3);
    
    // Alternate material: obsidian vs quartz
    if (frameCount % 20 < 10) {
      fill(240, 80, 20); // Obsidian
      noStroke();
    } else {
      fill(200, 50, 90, 0.6); // Translucent quartz
      stroke(200, 70, 100, 0.4);
      strokeWeight(0.5);
    }
    
    sphere(s.size);
    pop();
  }
  
  // Draw boxes
  for (let b of boxes) {
    push();
    translate(b.x, b.y, b.z);
    rotateX(time * b.speed);
    rotateY(time * b.speed * 0.7);
    
    if (frameCount % 20 < 10) {
      fill(260, 90, 30); // Obsidian
      noStroke();
    } else {
      fill(220, 40, 80, 0.5); // Translucent quartz
      stroke(220, 60, 90, 0.3);
      strokeWeight(1);
    }
    
    box(b.size);
    pop();
  }
  
  // Dynamic color shifts in light field
  if (frameCount % 10 === 0) {
    background((frameCount * 0.5) % 360, 10, 10);
  }
}
