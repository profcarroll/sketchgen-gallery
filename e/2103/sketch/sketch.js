let tubes = [];
let particles = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create lava tube structures
  for (let i = 0; i < 8; i++) {
    tubes.push({
      x: random(-width/3, width/3),
      y: random(-height/3, height/3),
      z: random(-500, 500),
      radius: random(80, 150),
      rotation: random(TWO_PI),
      twist: random(TWO_PI),
      segments: 20,
      phase: random(TWO_PI)
    });
  }
  
  // Create particles inside tubes
  for (let i = 0; i < 300; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      size: random(1, 4),
      speed: random(0.001, 0.003),
      hue: random(200, 260), // sapphire to amethyst range
      life: random(0.5, 1),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.1);
  
  time += 0.002;
  
  // Draw lava tubes
  for (let i = 0; i < tubes.length; i++) {
    let tube = tubes[i];
    
    push();
    
    translate(tube.x, tube.y, tube.z);
    rotateZ(tube.rotation);
    rotateY(time * 0.1 + tube.twist);
    
    // Draw tube structure
    noFill();
    stroke(tube.hue, 80, 60, 0.3);
    strokeWeight(2);
    
    beginShape();
    for (let j = 0; j < tube.segments; j++) {
      let angle = map(j, 0, tube.segments, 0, TWO_PI);
      let x = cos(angle) * tube.radius;
      let y = sin(angle) * tube.radius;
      let z = sin(time + angle * 2) * 30;
      
      vertex(x, y, z);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Draw particles with pulsing glow
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    push();
    
    // Update particle position along tube path
    p.phase += p.speed;
    let angle = p.phase;
    let radius = 80 + sin(time * 2 + p.phase) * 30;
    let zOffset = sin(time + p.phase) * 50;
    
    p.x = cos(angle) * radius;
    p.y = sin(angle) * radius;
    p.z += zOffset * 0.1;
    
    // Keep particles within bounds
    if (p.z > 500) p.z = -500;
    if (p.z < -500) p.z = 500;
    
    translate(p.x, p.y, p.z);
    
    // Pulsing glow effect
    let pulse = sin(time * 3 + p.phase) * 0.5 + 0.5;
    let size = p.size * (1 + pulse * 2);
    
    noStroke();
    fill(p.hue, 90, 80, 0.7);
    sphere(size, 4, 3);
    
    pop();
  }
  
  // Add subtle energy conduits
  for (let i = 0; i < tubes.length; i++) {
    let tube = tubes[i];
    
    push();
    translate(tube.x, tube.y, tube.z);
    rotateZ(tube.rotation);
    
    noFill();
    stroke(60, 70, 80, 0.2);
    strokeWeight(1);
    
    for (let j = 0; j < 5; j++) {
      beginShape();
      let offset = sin(time * 0.5 + j) * 30;
      for (let k = 0; k < tube.segments; k++) {
        let angle = map(k, 0, tube.segments, 0, TWO_PI);
        let x = cos(angle) * (tube.radius + offset);
        let y = sin(angle) * (tube.radius + offset);
        let z = sin(time + angle * 2 + j) * 10;
        
        vertex(x, y, z);
      }
      endShape(CLOSE);
    }
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
