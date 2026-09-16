let planes = [];
let wavePhase = 0;
let typography1, typography2;
let drift1 = { x: 0, y: 0, vx: 0.2, vy: 0.1 };
let drift2 = { x: 0, y: 0, vx: -0.15, vy: 0.12 };

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create intersecting planes
  for (let i = 0; i < 8; i++) {
    planes.push({
      angle: i * PI / 4,
      y: map(i, 0, 7, -height/2, height/2)
    });
  }

  // Setup typography
  typography1 = "DATA";
  typography2 = "VISUALIZATION";
}

function draw() {
  background(0);
  noStroke();

  // Move wave phase
  wavePhase += 0.05;

  // Draw planes with glowing wave effect
  for (let i = 0; i < planes.length; i++) {
    const p = planes[i];
    
    push();
    rotateY(p.angle);
    translate(0, p.y, 0);
    
    // Create grid of points
    beginShape(POINTS);
    for (let x = -width/2; x < width/2; x += 20) {
      for (let z = -height/2; z < height/2; z += 20) {
        const dx = x - width/4;
        const dz = z - height/4;
        const dist = sqrt(dx*dx + dz*dz);
        const wave = sin(dist * 0.02 - wavePhase) * 0.5 + 0.5;
        
        // Glow effect based on wave
        const hue = (frameCount * 2 + i * 45) % 360;
        const bright = map(wave, 0, 1, 70, 100);
        fill(hue, 80, bright, 0.8);
        
        vertex(x, 0, z);
      }
    }
    endShape();
    
    pop();
  }

  // Draw connecting lines between planes
  beginShape(LINES);
  for (let i = 0; i < planes.length - 1; i++) {
    const p1 = planes[i];
    const p2 = planes[i+1];
    
    for (let x = -width/2; x < width/2; x += 40) {
      const y1 = map(x, -width/2, width/2, -height/4, height/4);
      const y2 = map(x, -width/2, width/2, -height/4, height/4);
      
      const hue = (frameCount * 2 + i * 30) % 360;
      const bright = 80;
      
      stroke(hue, 70, bright, 0.6);
      vertex(x, y1, 0);
      vertex(x, y2, 0);
    }
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
