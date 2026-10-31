let lightPattern;
let glowBall;
const TOTAL_LINES = 200;
const PULSE_SPEED = 0.02;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create the glowing disc object
  glowBall = {
    x: width/2,
    y: height/3,
    radius: 60,
    hue: 180,
    saturation: 255,
    brightness: 255,
    pulsePhase: random(TWO_PI)
  };
  
  // Create semicircular light pattern
  lightPattern = [];
  const startAngle = PI;
  const endAngle = TWO_PI;
  const segments = TOTAL_LINES;
  
  for (let i = 0; i < segments; i++) {
    const angle = map(i, 0, segments - 1, startAngle, endAngle);
    lightPattern.push({
      angle: angle,
      baseLength: random(200, 400),
      pulsePhase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  
  // Draw the ground field
  fill(10, 15, 25);
  noStroke();
  rect(0, height/2, width, height/2);
  
  // Update and draw the glowing disc
  const pulse = sin(frameCount * PULSE_SPEED + glowBall.pulsePhase) * 0.5 + 0.5;
  const glowIntensity = map(pulse, 0, 1, 100, 255);
  
  // Draw the glow ball with soft outer glow
  noStroke();
  fill(glowBall.hue, glowBall.saturation, glowBall.brightness, glowIntensity * 0.3);
  ellipse(glowBall.x, glowBall.y, glowBall.radius * 2.5, glowBall.radius * 2.5);
  
  fill(glowBall.hue, glowBall.saturation, glowBall.brightness, glowIntensity * 0.7);
  ellipse(glowBall.x, glowBall.y, glowBall.radius * 1.5, glowBall.radius * 1.5);
  
  fill(glowBall.hue, glowBall.saturation, glowBall.brightness, glowIntensity);
  ellipse(glowBall.x, glowBall.y, glowBall.radius, glowBall.radius);
  
  // Draw the semicircular light pattern
  stroke(180, 255, 255, 200);
  strokeWeight(2);
  noFill();
  
  beginShape();
  for (let i = 0; i < lightPattern.length; i++) {
    const line = lightPattern[i];
    const pulse = sin(frameCount * PULSE_SPEED + line.pulsePhase) * 0.5 + 0.5;
    const intensity = map(pulse, 0, 1, 100, 255);
    stroke(180, 255, 255, intensity);
    
    const length = line.baseLength * (0.7 + pulse * 0.3);
    const x = glowBall.x + cos(line.angle) * length;
    const y = height/2 + sin(line.angle) * length;
    
    if (i === 0) {
      vertex(glowBall.x, height/2);
    }
    vertex(x, y);
  }
  endShape();
  
  // Draw the central focus point
  fill(180, 255, 255, 255);
  noStroke();
  ellipse(glowBall.x, height/2, 8, 8);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
