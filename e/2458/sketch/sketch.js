let coralStructures = [];
let time = 0;
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create coral-like structures at microscopic scale
  for (let i = 0; i < 500; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-1000, 1000);
    let size = random(2, 8);
    
    coralStructures.push({
      x: x,
      y: y,
      z: z,
      size: size,
      age: random(TWO_PI),
      hue: random(150, 220), // cool blue-green tones
      saturation: random(60, 80),
      brightness: random(70, 90)
    });
  }
  
  // Create micro-particles to simulate sediment and decay
  for (let i = 0; i < 1500; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-1500, 1500),
      size: random(0.2, 1.5),
      speed: random(0.0005, 0.003),
      opacity: random(0.05, 0.2)
    });
  }
}

function draw() {
  background(200, 10, 5); // deep blue-gray base
  
  time += 0.001;
  
  // Slow camera rotation for immersive effect
  let rotX = map(sin(time * 0.05), -1, 1, -0.1, 0.1);
  let rotY = map(cos(time * 0.03), -1, 1, -0.1, 0.1);
  rotateX(rotX);
  rotateY(rotY);
  
  // Draw coral structures
  noStroke();
  for (let structure of coralStructures) {
    let ageEffect = sin(time * 0.5 + structure.age) * 0.3;
    let scale = 1 + ageEffect;
    
    push();
    translate(structure.x, structure.y, structure.z);
    
    // Simulate calcium carbonate crystal growth and decay
    fill(structure.hue, structure.saturation, structure.brightness, 0.8);
    
    // Create organic-looking coral shapes using multiple spheres
    let numSpheres = floor(random(3, 7));
    for (let i = 0; i < numSpheres; i++) {
      let angle = random(TWO_PI);
      let dist = random(0, structure.size * 0.8);
      let sphereX = cos(angle) * dist;
      let sphereY = sin(angle) * dist;
      let sphereSize = random(structure.size * 0.3, structure.size * 0.7);
      
      push();
      translate(sphereX, sphereY, 0);
      sphere(sphereSize, 4, 4); // Low detail spheres for performance
      pop();
    }
    
    pop();
  }
  
  // Draw sediment particles
  beginShape(POINTS);
  for (let particle of particles) {
    // Slow drifting motion simulating sediment movement
    particle.z += particle.speed;
    particle.x += sin(time * 0.3 + particle.z * 0.005) * 0.1;
    particle.y += cos(time * 0.2 + particle.z * 0.005) * 0.1;
    
    // Reset particles that drift too far
    if (particle.z > 1500) {
      particle.z = -1500;
      particle.x = random(-width/2, width/2);
      particle.y = random(-height/2, height/2);
    }
    
    fill(180, 15, 95, particle.opacity);
    vertex(particle.x, particle.y, particle.z);
  }
  endShape();
  
  // Add subtle ambient glow
  noStroke();
  fill(180, 10, 20, 0.03);
  sphere(width * 1.5, 6, 6);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
