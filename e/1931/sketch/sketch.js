let planes = [];
let connections = [];
let wavePhase = 0;
let typography1, typography2;
let drift1 = { x: 0, y: 0, vx: 0.2, vy: 0.1 };
let drift2 = { x: 0, y: 0, vx: -0.15, vy: 0.12 };

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create intersecting planes
  for (let i = 0; i < 6; i++) {
    planes.push({
      angle: i * PI / 3,
      y: map(i, 0, 5, -height/2, height/2),
      pulse: 0
    });
  }

  // Setup connections between planes
  for (let i = 0; i < planes.length; i++) {
    for (let j = i + 1; j < planes.length; j++) {
      connections.push({ i, j });
    }
  }

  // Setup typography
  typography1 = "DATA";
  typography2 = "VISUALIZATION";
}

function draw() {
  background(0);
  noStroke();

  // Move wave phase
  wavePhase += 0.03;

  // Draw planes with glowing wave effect
  for (let i = 0; i < planes.length; i++) {
    const p = planes[i];
    
    push();
    rotateY(p.angle);
    translate(0, p.y, 0);
    
    // Create grid of points with wave effect
    beginShape(POINTS);
    for (let x = -width/3; x < width/3; x += 15) {
      for (let z = -height/3; z < height/3; z += 15) {
        const dx = x - width/6;
        const dz = z - height/6;
        const dist = sqrt(dx*dx + dz*dz);
        const wave = sin(dist * 0.02 - wavePhase) * 0.5 + 0.5;
        
        // Glow effect based on wave
        const hue = (frameCount * 1.5 + i * 60) % 360;
        const bright = map(wave, 0, 1, 60, 90);
        fill(hue, 80, bright, 0.7);
        
        vertex(x, 0, z);
      }
    }
    endShape();
    
    pop();
  }

  // Draw connecting lines between planes
  beginShape(LINES);
  for (let i = 0; i < connections.length; i++) {
    const c = connections[i];
    const p1 = planes[c.i];
    const p2 = planes[c.j];
    
    // Calculate distance between planes to trigger pulse effect
    const dist = abs(p1.y - p2.y);
    const pulseIntensity = map(dist, 0, height/2, 1, 0);
    
    // Update plane pulses
    if (pulseIntensity > 0.8) {
      p1.pulse = max(p1.pulse, 0.5);
      p2.pulse = max(p2.pulse, 0.5);
    }
    
    // Pulse effect on connecting lines
    const pulse = (p1.pulse + p2.pulse) / 2;
    const hue = (frameCount * 2 + c.i * 40) % 360;
    const bright = map(pulse, 0, 1, 40, 100);
    
    stroke(hue, 80, bright, 0.8);
    
    // Draw connection lines
    for (let x = -width/3; x < width/3; x += 30) {
      const y1 = map(x, -width/3, width/3, -height/6, height/6);
      const y2 = map(x, -width/3, width/3, -height/6, height/6);
      
      vertex(x, y1, 0);
      vertex(x, y2, 0);
    }
    
    // Decrease pulse
    p1.pulse *= 0.95;
    p2.pulse *= 0.95;
  }
  endShape();

  // Update drift positions
  drift1.x += drift1.vx;
  drift1.y += drift1.vy;
  if (drift1.x > width || drift1.x < -100) drift1.vx *= -1;
  if (drift1.y > height || drift1.y < -50) drift1.vy *= -1;

  drift2.x += drift2.vx;
  drift2.y += drift2.vy;
  if (drift2.x > width || drift2.x < -150) drift2.vx *= -1;
  if (drift2.y > height || drift2.y < -60) drift2.vy *= -1;

  // Draw typography
  fill(255);
  textSize(48);
  textAlign(CENTER, CENTER);
  text(typography1, drift1.x, drift1.y);
  text(typography2, drift2.x, drift2.y);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
