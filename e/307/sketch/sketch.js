let particles = [];
let connections = [];
let fontSize = 48;
let textX, textY;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles in a 3D grid
  for (let i = 0; i < 200; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-200, 200),
      hue: random(360),
      size: random(2, 6)
    });
  }

  // Set up text position
  textX = width / 2;
  textY = height / 2;

  // Precompute connections for performance
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const d = dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      if (d < 150) {
        connections.push({ p1: i, p2: j });
      }
    }
  }
}

function draw() {
  background(0, 0, 0, 0.05); // Semi-transparent background for trail effect

  time += 0.005;
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    
    // Apply rotation to particle positions
    const rotX = sin(time + i * 0.01) * 0.02;
    const rotY = cos(time + i * 0.01) * 0.02;
    const rotZ = sin(time * 0.7 + i * 0.01) * 0.01;
    
    // Rotate in 3D space
    let x = p.x * cos(rotY) - p.z * sin(rotY);
    let y = p.y;
    let z = p.x * sin(rotY) + p.z * cos(rotY);
    
    x = x * cos(rotX) - y * sin(rotX);
    y = x * sin(rotX) + y * cos(rotX);
    
    z = z * cos(rotZ) - y * sin(rotZ);
    y = z * sin(rotZ) + y * cos(rotZ);

    // Project 3D to 2D
    const scale = 400 / (400 + z);
    const px = x * scale + width / 2;
    const py = y * scale + height / 2;

    // Pulsing size effect for particles
    const pulseSize = p.size + sin(time * 2 + i) * 1.5;
    
    // Draw particle
    noStroke();
    fill(p.hue, 80, 90, 0.8);
    ellipse(px, py, pulseSize);

    // Update hue for color shift over time
    p.hue = (p.hue + 0.2) % 360;
  }

  // Draw connections between particles
  strokeWeight(0.5);
  beginShape(LINES);
  for (let i = 0; i < connections.length; i++) {
    const c = connections[i];
    const p1 = particles[c.p1];
    const p2 = particles[c.p2];

    // Apply same rotation to connection points
    const rotX = sin(time + c.p1 * 0.01) * 0.02;
    const rotY = cos(time + c.p1 * 0.01) * 0.02;
    const rotZ = sin(time * 0.7 + c.p1 * 0.01) * 0.01;

    let x1 = p1.x * cos(rotY) - p1.z * sin(rotY);
    let y1 = p1.y;
    let z1 = p1.x * sin(rotY) + p1.z * cos(rotY);
    
    x1 = x1 * cos(rotX) - y1 * sin(rotX);
    y1 = x1 * sin(rotX) + y1 * cos(rotX);
    
    z1 = z1 * cos(rotZ) - y1 * sin(rotZ);
    y1 = z1 * sin(rotZ) + y1 * cos(rotZ);

    let x2 = p2.x * cos(rotY) - p2.z * sin(rotY);
    let y2 = p2.y;
    let z2 = p2.x * sin(rotY) + p2.z * cos(rotY);
    
    x2 = x2 * cos(rotX) - y2 * sin(rotX);
    y2 = x2 * sin(rotX) + y2 * cos(rotX);
    
    z2 = z2 * cos(rotZ) - y2 * sin(rotZ);
    y2 = z2 * sin(rotZ) + y2 * cos(rotZ);

    const scale1 = 400 / (400 + z1);
    const scale2 = 400 / (400 + z2);
    
    const px1 = x1 * scale1 + width / 2;
    const py1 = y1 * scale1 + height / 2;
    const px2 = x2 * scale2 + width / 2;
    const py2 = y2 * scale2 + height / 2;

    // Pulsing connection strength
    const pulse = sin(time * 3 + i) * 0.5 + 0.5;
    const alpha = 0.1 + pulse * 0.2;

    stroke(200, 80, 90, alpha);
    vertex(px1, py1);
    vertex(px2, py2);
  }
  endShape();

  // Draw abstract gradients in the background
  drawGradient();
}

function drawGradient() {
  const gradientSteps = 50;
  for (let i = 0; i < gradientSteps; i++) {
    const t = i / gradientSteps;
    const hue = (time * 10 + t * 360) % 360;
    const alpha = 0.02;
    
    noStroke();
    fill(hue, 70, 80, alpha);
    beginShape();
    vertex(0, 0);
    vertex(width, 0);
    vertex(width, height * t);
    vertex(0, height * t);
    endShape(CLOSE);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
