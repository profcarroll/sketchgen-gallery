let ribbons = [];
let audioLevel = 0;
let time = 0;

function setup() {
  createCanvas(600, 400);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize ribbons
  for (let i = 0; i < 50; i++) {
    ribbons.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      hue: random(200, 260), // Deep blue
      saturation: random(30, 70),
      brightness: random(40, 80),
      alpha: random(0.1, 0.3)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05); // Semi-transparent background for trail effect

  time += 0.01;
  
  // Simulate audio level (since we can't use p5.sound in headless mode)
  // This mimics a dynamic audio input
  const simulatedAudio = sin(time * 2) * 0.5 + 0.5; // Varies between 0 and 1
  audioLevel = lerp(audioLevel, simulatedAudio, 0.05);

  // Update and draw ribbons
  for (let i = 0; i < ribbons.length; i++) {
    let r = ribbons[i];
    
    // Modify behavior based on audio level
    if (audioLevel > 0.5) {
      // Intense, bright colors and movement
      r.hue = lerp(r.hue, map(audioLevel, 0.5, 1, 30, 40), 0.02);
      r.saturation = lerp(r.saturation, 90, 0.02);
      r.brightness = lerp(r.brightness, 90, 0.02);
      r.alpha = lerp(r.alpha, 0.6, 0.02);
    } else {
      // Calm, deep blue colors
      r.hue = lerp(r.hue, 230, 0.01);
      r.saturation = lerp(r.saturation, 50, 0.01);
      r.brightness = lerp(r.brightness, 60, 0.01);
      r.alpha = lerp(r.alpha, 0.2, 0.01);
    }

    // Update position
    r.x += cos(r.angle) * r.speed;
    r.y += sin(r.angle) * r.speed;

    // Random angle change for organic movement
    r.angle += random(-0.1, 0.1);

    // Wrap around the canvas
    if (r.x < -50) r.x = width + 50;
    if (r.x > width + 50) r.x = -50;
    if (r.y < -50) r.y = height + 50;
    if (r.y > height + 50) r.y = -50;

    // Draw the ribbon
    fill(r.hue, r.saturation, r.brightness, r.alpha);
    
    push();
    translate(r.x, r.y);
    rotate(r.angle);
    scale(1 + audioLevel * 0.5); // Slight scaling based on intensity
    
    // Draw a flowing shape (ribbon-like)
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.2) {
      let x = cos(a) * r.size;
      let y = sin(a) * r.size * 0.5;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }

  // Add some pulsing effect based on audio
  if (audioLevel > 0.7) {
    fill(255, 100, 100, 0.1);
    ellipse(width/2, height/2, 100 + audioLevel * 200, 100 + audioLevel * 200);
  }
}
