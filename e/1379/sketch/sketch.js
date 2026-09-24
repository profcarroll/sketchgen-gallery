let rings = [];
let pulses = [];
let sweepAngle = 0;
let pulseTimer = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  frameRate(30);
}

function draw() {
  background(0);
  
  // Update sweep angle
  sweepAngle += 0.02;
  
  // Draw radar sweep
  push();
  translate(width/2, height/2);
  rotate(sweepAngle);
  
  // Draw concentric rings
  for (let i = 0; i < rings.length; i++) {
    let ring = rings[i];
    if (frameCount % ring.speed === 0) {
      ring.angle += ring.rotationSpeed;
    }
    
    push();
    rotate(ring.angle);
    stroke(180, 100, 100, 0.3);
    noFill();
    ellipse(0, 0, ring.size, ring.size);
    pop();
  }
  
  // Draw sweep line
  stroke(180, 100, 100, 0.7);
  line(0, 0, 0, -200);
  pop();
  
  // Draw pulsating dots
  for (let i = pulses.length - 1; i >= 0; i--) {
    let pulse = pulses[i];
    pulse.life -= 0.02;
    
    if (pulse.life <= 0) {
      pulses.splice(i, 1);
      continue;
    }
    
    let alpha = map(pulse.life, 0, 1, 0, 0.8);
    fill(120, 100, 100, alpha);
    noStroke();
    ellipse(pulse.x, pulse.y, pulse.size * pulse.life);
  }
  
  // Add new pulses occasionally
  pulseTimer++;
  if (pulseTimer > 30) {
    pulses.push({
      x: random(width),
      y: random(height),
      size: random(5, 15),
      life: 1
    });
    pulseTimer = 0;
  }
  
  // Add new rings occasionally
  if (frameCount % 20 === 0) {
    rings.push({
      size: random(50, 300),
      angle: random(TWO_PI),
      rotationSpeed: random(-0.01, 0.01),
      speed: floor(random(1, 10))
    });
  }
  
  // Remove old rings
  if (rings.length > 20) {
    rings.shift();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
