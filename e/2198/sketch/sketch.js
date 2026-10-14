let planes = [];
let wavePhase = 0;
let hueOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create intersecting planes in a lattice structure
  for (let i = 0; i < 6; i++) {
    planes.push({
      angle: i * PI / 3,
      y: map(i, 0, 5, -height/2, height/2),
      pulse: 0,
      speed: random(0.005, 0.015)
    });
  }
}

function draw() {
  background(0);
  noStroke();

  // Move wave phase
  wavePhase += 0.02;
  hueOffset += 0.1;

  // Draw planes with glowing wave effect
  for (let i = 0; i < planes.length; i++) {
    const p = planes[i];
    
    push();
    rotateY(p.angle);
    translate(0, p.y, 0);
    
    // Create grid of points with wave effect
    beginShape(POINTS);
    for (let x = -width/3; x < width/3; x += 16) {
      for (let z = -height/3; z < height/3; z += 16) {
        const dx = x - width/6;
        const dz = z - height/6;
        const dist = sqrt(dx*dx + dz*dz);
        const wave = sin(dist * 0.02 - wavePhase + p.speed * frameCount) * 0.5 + 0.5;
        
        // Glow effect based on wave
        const hue = (hueOffset + i * 60) % 360;
        const bright = map(wave, 0, 1, 40, 90);
        fill(hue, 80, bright, 0.7);
        
        vertex(x, 0, z);
      }
    }
    endShape();
    
    pop();
  }

  // Draw connecting lines between planes with pulse effects
  beginShape(LINES);
  for (let i = 0; i < planes.length; i++) {
    const p1 = planes[i];
    
    for (let j = i + 1; j < planes.length; j++) {
      const p2 = planes[j];
      
      // Calculate distance between planes to trigger pulse effect
      const dist = abs(p1.y - p2.y);
      const pulseIntensity = map(dist, 0, height/2, 1, 0);
      
      // Update plane pulses
      if (pulseIntensity > 0.7) {
        p1.pulse = max(p1.pulse, 0.6);
        p2.pulse = max(p2.pulse, 0.6);
      }
      
      // Pulse effect on connecting lines
      const pulse = (p1.pulse + p2.pulse) / 2;
      const hue = (hueOffset * 3 + i * 45 + j * 30) % 360;
      const bright = map(pulse, 0, 1, 20, 80);
      
      stroke(hue, 90, bright, 0.5);
      
      // Draw connection lines
      for (let x = -width/3; x < width/3; x += 32) {
        const y1 = map(x, -width/3, width/3, -height/6, height/6);
        const y2 = map(x, -width/3, width/3, -height/6, height/6);
        
        vertex(x, y1, 0);
        vertex(x, y2, 0);
      }
      
      // Decrease pulse
      p1.pulse *= 0.93;
      p2.pulse *= 0.93;
    }
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
