let waves = [];
let particles = [];
let cabinet;
let intensity = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create cabinet frame
  cabinet = {
    width: width * 0.9,
    height: height * 0.9,
    depth: 200,
    border: 20
  };
  
  // Initialize waves
  for (let i = 0; i < 50; i++) {
    waves.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      size: random(100, 300),
      speed: random(0.001, 0.005),
      phase: random(TWO_PI)
    });
  }
  
  // Initialize particles
  for (let i = 0; i < 1000; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-cabinet.depth/2, cabinet.depth/2),
      size: random(1, 3),
      speed: random(0.001, 0.005),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  
  // Increase intensity with click
  if (intensity > 0) {
    intensity -= 0.02;
  }
  
  // Draw cabinet
  push();
  translate(0, 0, -cabinet.depth/2 - 50);
  stroke(100, 100, 80);
  fill(0, 0, 20);
  box(cabinet.width, cabinet.height, cabinet.depth);
  
  // Cabinet details
  stroke(100, 100, 60);
  noFill();
  for (let i = 0; i < 8; i++) {
    push();
    translate(-cabinet.width/2 + i * cabinet.width/7, -cabinet.height/2 + 50, 0);
    box(30, 100, 10);
    pop();
  }
  
  // Draw waves
  for (let wave of waves) {
    const time = frameCount * wave.speed + wave.phase;
    const size = wave.size + sin(time) * 50;
    const alpha = map(sin(time), -1, 1, 0.1, 0.3);
    
    push();
    translate(wave.x, wave.y, 0);
    noStroke();
    fill(240, 80, 60, alpha);
    sphere(size/2);
    pop();
    
    // Add teal glow
    push();
    translate(wave.x, wave.y, 0);
    noStroke();
    fill(180, 90, 70, alpha * 0.5);
    sphere(size/3);
    pop();
  }
  
  // Draw particles
  beginShape(POINTS);
  for (let particle of particles) {
    const time = frameCount * particle.speed + particle.phase;
    const x = particle.x + sin(time) * 20;
    const y = particle.y + cos(time) * 20;
    const z = particle.z + sin(time * 0.5) * 10;
    
    // Color based on position and time
    const hue = (frameCount * 0.3 + x * 0.01 + y * 0.01) % 360;
    const saturation = 80 + sin(time) * 20;
    const brightness = 70 + cos(time * 0.7) * 30;
    
    fill(hue, saturation, brightness, 0.7);
    
    vertex(x, y, z);
  }
  endShape();
  
  // Add energy bursts
  if (intensity > 0) {
    const burstCount = int(intensity * 5);
    for (let i = 0; i < burstCount; i++) {
      const x = random(-width/4, width/4);
      const y = random(-height/4, height/4);
      const size = random(20, 80) * intensity;
      
      push();
      translate(x, y, 0);
      noStroke();
      fill(240, 100, 100, 0.5 * intensity);
      sphere(size);
      pop();
    }
  }
  
  pop();
}

function mousePressed() {
  intensity = 1;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
