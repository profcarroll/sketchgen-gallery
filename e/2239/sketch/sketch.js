let gasParticles = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Create a large number of gas particles with varying properties
  for (let i = 0; i < 3000; i++) {
    gasParticles.push({
      x: random(-width * 2, width * 2),
      y: random(-height * 2, height * 2),
      z: random(-1000, 1000),
      size: random(0.5, 3),
      speed: random(0.0001, 0.0005),
      phase: random(TWO_PI),
      color: [random(100, 255), random(150, 255), random(200, 255)]
    });
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Slowly rotate the entire scene
  rotateY(time * 0.002);
  rotateX(sin(time * 0.001) * 0.1);
  
  // Draw gas particles in batches for performance
  beginShape(POINTS);
  for (let particle of gasParticles) {
    // Update position slowly over time
    particle.x += sin(time * particle.speed + particle.phase) * 0.5;
    particle.y += cos(time * particle.speed + particle.phase) * 0.5;
    particle.z += sin(time * particle.speed * 0.5 + particle.phase) * 0.3;
    
    // Create a pulsing glow effect
    let pulse = sin(time * particle.speed + particle.phase) * 0.5 + 0.5;
    let size = particle.size * pulse;
    
    // Set color with bioluminescent hues
    fill(particle.color[0], particle.color[1], particle.color[2], 150);
    
    // Draw each particle as a point in 3D space
    vertex(particle.x, particle.y, particle.z);
  }
  endShape();
  
  // Create layered structures using a simple grid-based approach
  for (let i = 0; i < 20; i++) {
    push();
    let layerY = map(i, 0, 19, -height * 0.5, height * 0.5);
    translate(0, layerY, 0);
    
    // Create a subtle wave effect for the layers
    let wave = sin(time * 0.01 + i * 0.2) * 50;
    scale(1, 0.5, 1);
    
    // Draw a semi-transparent plane to represent gas strata
    fill(0, 100, 200, 30);
    noStroke();
    plane(width * 2, 40);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
