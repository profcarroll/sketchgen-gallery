let plates = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial tectonic plates
  for (let i = 0; i < 8; i++) {
    plates.push({
      x: random(-width/3, width/3),
      y: random(-height/3, height/3),
      z: random(-200, 200),
      size: random(150, 300),
      rotation: random(TWO_PI),
      speed: random(0.001, 0.003),
      color: color(random(180, 240), 60, 70, 0.9),
      pulseOffset: random(TWO_PI),
      segments: []
    });
  }
  
  // Initialize plate segments
  for (let p of plates) {
    let numSegments = floor(random(3, 7));
    for (let i = 0; i < numSegments; i++) {
      p.segments.push({
        angle: TWO_PI * i / numSegments,
        length: random(50, 150),
        width: random(20, 60)
      });
    }
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Camera movement
  let camX = sin(time * 0.02) * 100;
  let camY = cos(time * 0.015) * 50;
  camera(camX, camY, height / 2, 0, 0, 0, 0, 1, 0);
  
  // Draw and update plates
  for (let p of plates) {
    // Slow drift movement
    p.x += sin(p.rotation) * p.speed * 5;
    p.y += cos(p.rotation) * p.speed * 5;
    
    // Boundary interaction effect
    let interaction = false;
    for (let other of plates) {
      if (other !== p) {
        let d = dist(p.x, p.y, other.x, other.y);
        if (d < p.size/2 + other.size/2) {
          interaction = true;
        }
      }
    }
    
    // Pulsing bioluminescent wave
    let pulse = sin(time * 0.5 + p.pulseOffset) * 0.3 + 0.7;
    let glowIntensity = interaction ? 1 : 0.3;
    
    push();
    translate(p.x, p.y, p.z);
    rotateZ(p.rotation);
    
    // Draw plate with geometric segments
    fill(p.color);
    noStroke();
    
    for (let seg of p.segments) {
      let x1 = cos(seg.angle) * seg.length/2;
      let y1 = sin(seg.angle) * seg.length/2;
      let x2 = cos(seg.angle + PI) * seg.length/2;
      let y2 = sin(seg.angle + PI) * seg.length/2;
      
      // Create a folded origami-like surface
      beginShape();
      vertex(x1, y1, 0);
      vertex(x2, y2, 0);
      vertex(x2, y2, seg.width * pulse * glowIntensity);
      vertex(x1, y1, seg.width * pulse * glowIntensity);
      endShape(CLOSE);
    }
    
    // Draw central core
    fill(color(200, 50, 80, 0.6));
    sphere(p.size * 0.1, 6, 4);
    
    pop();
  }
  
  // Occasionally spawn new plates
  if (frameCount % 300 === 0 && plates.length < 12) {
    plates.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-200, 200),
      size: random(150, 300),
      rotation: random(TWO_PI),
      speed: random(0.001, 0.003),
      color: color(random(180, 240), 60, 70, 0.9),
      pulseOffset: random(TWO_PI),
      segments: []
    });
    
    // Initialize new plate segments
    let p = plates[plates.length - 1];
    let numSegments = floor(random(3, 7));
    for (let i = 0; i < numSegments; i++) {
      p.segments.push({
        angle: TWO_PI * i / numSegments,
        length: random(50, 150),
        width: random(20, 60)
      });
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
