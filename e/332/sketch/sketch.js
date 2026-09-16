let particles = [];
let tunnels = [];
let plasmaBursts = [];
let time = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  noStroke();
  
  // Initialize particles
  for (let i = 0; i < 1000; i++) {
    particles.push({
      x: random(-500, 500),
      y: random(-500, 500),
      z: random(-500, 500),
      size: random(1, 3),
      speed: random(0.5, 2)
    });
  }
  
  // Initialize tunnel segments
  for (let i = 0; i < 200; i++) {
    tunnels.push({
      x: random(-400, 400),
      y: random(-400, 400),
      z: -1000 + i * 10,
      size: random(50, 150),
      rotation: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  
  // Camera movement
  let camX = sin(time * 0.001) * 200;
  let camY = cos(time * 0.0015) * 100;
  camera(0, 0, 300 + camY, 0, 0, 0, 0, 1, 0);
  
  // Rotate the whole scene
  rotateY(time * 0.0005);
  rotateX(time * 0.0003);
  
  // Draw tunnel lattice
  push();
  for (let i = 0; i < tunnels.length; i++) {
    let t = tunnels[i];
    translate(t.x, t.y, t.z);
    rotateZ(t.rotation + time * 0.001);
    
    // Draw crystal lattice structure
    fill(255, 100, 200, 100);
    push();
    scale(1, 1, t.size / 100);
    box(100);
    pop();
    
    // Inner lattice
    fill(100, 200, 255, 80);
    for (let j = 0; j < 4; j++) {
      rotateY(PI / 2);
      push();
      translate(0, 0, t.size / 2);
      scale(0.5, 0.5, 1);
      box(50);
      pop();
    }
    
    // Light emission
    if (frameCount % 60 === i % 60) {
      fill(255, 200, 0, 200);
      sphere(t.size * 0.3);
    }
  }
  pop();
  
  // Draw particles
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    fill(100, 255, 255, 150);
    vertex(p.x, p.y, p.z);
  }
  endShape();
  
  // Update and draw plasma bursts
  for (let i = plasmaBursts.length - 1; i >= 0; i--) {
    let burst = plasmaBursts[i];
    burst.life -= 2;
    if (burst.life <= 0) {
      plasmaBursts.splice(i, 1);
      continue;
    }
    
    // Draw plasma tendrils
    stroke(255, 100, 0, burst.life);
    strokeWeight(3);
    line(burst.x, burst.y, burst.z, burst.x + random(-50, 50), burst.y + random(-50, 50), burst.z + random(-50, 50));
    
    // Draw glow
    noStroke();
    fill(255, 100, 0, burst.life * 0.5);
    sphere(burst.size * 2);
  }
  
  // Occasionally create plasma bursts
  if (frameCount % 30 === 0) {
    plasmaBursts.push({
      x: random(-300, 300),
      y: random(-300, 300),
      z: random(-500, -100),
      size: random(20, 40),
      life: 100
    });
  }
  
  time++;
}
