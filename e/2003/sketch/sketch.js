function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  rectMode(CENTER);
  noStroke();
  // Initialize glow effect parameters
  glowParams = {
    topColor: [195, 38, 32],
    botColor: [65, 24, 60],
    pulseIntensity: 0,
    baseAlpha: 180
  };
}

function draw() {
  background(42, 22, 26);
  
  let t = frameCount * 0.015;
  
  // Breathing modulations for soft pulsing effect
  let topBreathe = sin(t * 0.8) * 8;
  let botBreathe = cos(t * 0.6) * 7;
  let colorShift = sin(t * 0.5) * 15;

  // Update pulse intensity from click
  glowParams.pulseIntensity *= 0.95; // Slow decay

  // Top field with glowing effect and breathing
  drawGlowingField(
    0, -height * 0.15,
    width * 0.72 + topBreathe, height * 0.38 + topBreathe * 0.5,
    glowParams.topColor[0] + colorShift,
    glowParams.topColor[1] + colorShift * 0.4,
    glowParams.topColor[2],
    30
  );

  // Bottom field with glowing effect and breathing
  drawGlowingField(
    0, height * 0.15,
    width * 0.72 + botBreathe, height * 0.34 + botBreathe * 0.5,
    glowParams.botColor[0] - colorShift * 0.3,
    glowParams.botColor[1],
    glowParams.botColor[2] + colorShift * 0.5,
    30
  );
}

function drawGlowingField(x, y, w, h, r, g, b, steps) {
  // Create a soft glowing effect with layered rectangles
  for (let i = steps; i >= 1; i--) {
    let factor = map(i, 1, steps, 1.0, 0.7);
    let alpha = map(i, 1, steps, 4, glowParams.baseAlpha);
    // Add a subtle pulse effect to the glow
    alpha += glowParams.pulseIntensity * (i / steps) * 20;
    
    fill(r, g, b, alpha);
    push();
    translate(x, y);
    rect(0, 0, w * factor, h * factor, 12);
    pop();
  }
}

function mousePressed() {
  // Trigger a bright pulse effect on click
  glowParams.pulseIntensity = 255;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
