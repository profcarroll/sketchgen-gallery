function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
}

function draw() {
  background(20, 25, 30);
  
  // Draw intricate clockwork tapestry with rhythmic repetition
  drawClockworkTapestry();
}

function drawClockworkTapestry() {
  const threadCount = 1500;
  const threads = [];
  
  // Pre-generate thread paths
  for (let i = 0; i < threadCount; i++) {
    const startX = random(width);
    const startY = random(height);
    const endX = random(width);
    const endY = random(height);
    
    threads.push({
      x: startX,
      y: startY,
      targetX: endX,
      targetY: endY,
      progress: 0,
      speed: random(0.001, 0.005),
      width: random(0.5, 2),
      hue: (i * 137.5) % 360, // Golden angle progression for color
      saturation: 40 + random(20),
      brightness: 30 + random(30)
    });
  }
  
  // Draw threads with pulsing rhythm
  for (let i = 0; i < threadCount; i++) {
    const t = threads[i];
    
    // Update progress with rhythmic pulse
    t.progress += t.speed * (1 + sin(frameCount * 0.02) * 0.3);
    if (t.progress > 1) t.progress = 0;
    
    // Interpolate position along path
    const x = lerp(t.x, t.targetX, t.progress);
    const y = lerp(t.y, t.targetY, t.progress);
    
    // Pulsing brightness for kinetic energy
    const pulse = sin(frameCount * 0.05 + i) * 0.2 + 0.8;
    const colorBrightness = t.brightness * pulse;
    
    stroke(t.hue, t.saturation, colorBrightness);
    strokeWeight(t.width);
    
    // Draw thread as a line
    if (i > 0) {
      const prev = threads[i - 1];
      line(prev.x, prev.y, x, y);
    }
    
    // Update thread's current position for next frame
    t.x = x;
    t.y = y;
  }
  
  // Add subtle gear-like structure
  drawGearStructure();
}

function drawGearStructure() {
  const gearCount = 20;
  const maxRadius = min(width, height) * 0.3;
  
  for (let i = 0; i < gearCount; i++) {
    const angle = (i / gearCount) * TWO_PI + frameCount * 0.001;
    const radius = (maxRadius * (i % 2 ? 0.5 : 0.7)) * (0.8 + sin(frameCount * 0.01 + i) * 0.2);
    
    const x = width / 2 + cos(angle) * radius;
    const y = height / 2 + sin(angle) * radius;
    
    // Draw gear teeth
    stroke(100, 120, 140);
    strokeWeight(1);
    noFill();
    
    beginShape();
    for (let j = 0; j < 12; j++) {
      const toothAngle = angle + (j / 12) * TWO_PI;
      const toothRadius = radius + (j % 2 ? 5 : -3);
      vertex(
        x + cos(toothAngle) * toothRadius,
        y + sin(toothAngle) * toothRadius
      );
    }
    endShape(CLOSE);
  }
}
