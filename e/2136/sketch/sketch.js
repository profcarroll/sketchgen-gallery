let planes = [];
let wavePhase = 0;
let hueOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create intersecting planes
  for (let i = 0; i < 8; i++) {
    planes.push({
      angle: i * PI / 4,
      y: map(i, 0, 7, -height/2, height/2),
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
  hueOffset += 0.2;

  // Draw planes with glowing wave effect
  for (let i = 0; i < planes.length; i++) {
    const p = planes[i];
    
    push();
    rotateY(p.angle);
    translate(0, p.y, 0);
    
    // Create grid of points with wave effect
    beginShape(POINTS);
    for (let x = -width/3; x < width/3; x += 12) {
      for (let z = -height/3; z < height/3; z += 12) {
        const dx = x - width/6;
        const dz = z - height/6;
        const dist = sqrt(dx*dx + dz*dz);
        const wave = sin(dist * 0.02 - wavePhase + p.speed * frameCount) * 0.5 + 0.5;
        
        // Glow effect based on wave
        const hue = (hueOffset + i * 45) % 360;
        const bright = map(wave, 0, 1, 50, 95);
        fill(hue, 80, bright, 0.8);
        
        vertex(x, 0, z);
      }
    }
    endShape();
    
    pop();
  }

  // Draw connecting lines between planes
  beginShape(LINES);
  for (let i = 0; i < planes.length; i++) {
    for (let j = i + 1; j < planes.length; j++) {
      const p1 = planes[i];
      const p2 = planes[j];
      
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
      const hue = (hueOffset * 2 + i * 30 + j * 20) % 360;
      const bright = map(pulse, 0, 1, 30, 90);
      
      stroke(hue, 80, bright, 0.6);
      
      // Draw connection lines
      for (let x = -width/3; x < width/3; x += 24) {
        const y1 = map(x, -width/3, width/3, -height/6, height/6);
        const y2 = map(x, -width/3, width/3, -height/6, height/6);
        
        vertex(x, y1, 0);
        vertex(x, y2, 0);
      }
      
      // Decrease pulse
      p1.pulse *= 0.94;
      p2.pulse *= 0.94;
    }
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
