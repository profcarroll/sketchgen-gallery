let particles = [];
let centralSource;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create central glowing source
  centralSource = {
    pos: createVector(0, 0, 0),
    radius: 40,
    hue: 10,
    saturation: 90,
    brightness: 100
  };

  // Create orbiting particles with splines
  for (let i = 0; i < 80; i++) {
    let angle = random(TWO_PI);
    let radius = random(150, 300);
    let height = random(-100, 100);
    let speed = random(0.002, 0.008);
    let size = random(2, 6);
    
    particles.push({
      pos: createVector(
        cos(angle) * radius,
        height,
        sin(angle) * radius
      ),
      vel: p5.Vector.random3D().mult(random(0.5, 2)),
      angle: angle,
      radius: radius,
      speed: speed,
      size: size,
      hue: random(10, 30), // oxidized copper hues
      saturation: random(60, 80),
      brightness: random(40, 70)
    });
  }
}

function draw() {
  background(0);
  time += 0.005;

  // Rotate the whole scene
  rotateY(time * 0.2);
  rotateX(sin(time * 0.3) * 0.1);

  // Draw central glowing source
  push();
  translate(centralSource.pos.x, centralSource.pos.y, centralSource.pos.z);
  noStroke();
  fill(centralSource.hue, centralSource.saturation, centralSource.brightness, 1);
  sphere(centralSource.radius);
  
  // Add glow effect
  for (let i = 0; i < 5; i++) {
    let alpha = map(i, 0, 4, 0.2, 0);
    fill(centralSource.hue, centralSource.saturation, centralSource.brightness, alpha);
    sphere(centralSource.radius + i * 5);
  }
  pop();

  // Draw orbiting particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Update particle position in orbit
    p.angle += p.speed;
    p.pos.x = cos(p.angle) * p.radius;
    p.pos.z = sin(p.angle) * p.radius;
    
    // Add some vertical movement
    p.pos.y += sin(time * 2 + i) * 0.5;
    
    // Draw particle
    push();
    translate(p.pos.x, p.pos.y, p.pos.z);
    
    noStroke();
    fill(p.hue, p.saturation, p.brightness, 1);
    
    // Create a fragment of sea glass effect
    let glassHue = random(180, 240); // Blue-green hues for sea glass
    fill(glassHue, 60, 80, 0.7);
    
    sphere(p.size);
    pop();
  }
  
  // Draw connecting splines between particles
  stroke(255, 0.3);
  noFill();
  
  beginShape(LINES);
  for (let i = 0; i < particles.length; i++) {
    let p1 = particles[i];
    let p2 = particles[(i + 1) % particles.length];
    
    vertex(p1.pos.x, p1.pos.y, p1.pos.z);
    vertex(p2.pos.x, p2.pos.y, p2.pos.z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
