let pyramids = [];
let particles = [];
let sediment = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create pyramidal structures
  for (let i = 0; i < 8; i++) {
    pyramids.push({
      x: random(-width/2, width/2),
      y: height/2,
      z: random(-300, -500),
      size: random(40, 80),
      rotation: random(TWO_PI),
      color: color(random(180, 240), 70, 90)
    });
  }
  
  // Create sediment particles
  for (let i = 0; i < 200; i++) {
    sediment.push({
      x: random(-width/2, width/2),
      y: height/2,
      z: random(-600, -100),
      size: random(2, 8),
      speed: random(0.1, 0.5)
    });
  }
  
  // Create floating particles
  for (let i = 0; i < 300; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-600, -100),
      size: random(0.5, 3),
      speed: random(0.2, 1),
      hue: random(180, 240)
    });
  }
}

function draw() {
  background(0);
  
  // Ambient lighting
  pointLight(255, 255, 255, 0, -height/2, 0);
  ambientLight(30);
  
  // Move particles with currents
  for (let p of particles) {
    p.x += random(-0.5, 0.5);
    p.y += random(-0.3, 0.3);
    p.z += p.speed;
    
    if (p.z > 100) {
      p.z = -600;
      p.x = random(-width/2, width/2);
      p.y = random(-height/2, height/2);
    }
  }
  
  // Draw sediment
  beginShape(POINTS);
  for (let s of sediment) {
    s.z += s.speed;
    if (s.z > 100) {
      s.z = -600;
      s.x = random(-width/2, width/2);
    }
    
    fill(50, 30, 80);
    vertex(s.x, s.y, s.z);
  }
  endShape();
  
  // Draw pyramids
  for (let p of pyramids) {
    push();
    translate(p.x, p.y, p.z);
    rotateY(p.rotation);
    
    fill(p.color);
    noStroke();
    
    beginShape(TRIANGLES);
    vertex(0, -p.size/2, 0);
    vertex(-p.size/2, p.size/2, -p.size/2);
    vertex(p.size/2, p.size/2, -p.size/2);
    
    vertex(0, -p.size/2, 0);
    vertex(p.size/2, p.size/2, -p.size/2);
    vertex(p.size/2, p.size/2, p.size/2);
    
    vertex(0, -p.size/2, 0);
    vertex(p.size/2, p.size/2, p.size/2);
    vertex(-p.size/2, p.size/2, p.size/2);
    
    vertex(0, -p.size/2, 0);
    vertex(-p.size/2, p.size/2, p.size/2);
    vertex(-p.size/2, p.size/2, -p.size/2);
    endShape();
    
    pop();
  }
  
  // Draw floating particles
  beginShape(POINTS);
  for (let p of particles) {
    fill(p.hue, 80, 95, 0.7);
    vertex(p.x, p.y, p.z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
