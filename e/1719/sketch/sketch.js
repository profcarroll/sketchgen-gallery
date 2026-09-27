let chars = [];
let wakeText = "Once upon a time and a very good time it was there was a moocow coming down along and loa..."; // Shortened for brevity

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize characters with a vortex pattern
  for (let i = 0; i < 500; i++) {
    chars.push({
      x: random(width),
      y: random(height),
      size: random(12, 28),
      char: random(wakeText.split('')),
      hue: random(180, 240),
      saturation: random(60, 90),
      brightness: random(40, 70),
      alpha: random(0.3, 0.7),
      speedX: 0,
      speedY: 0,
      angle: random(TWO_PI),
      spin: random(-0.02, 0.02),
      life: random(100, 300),
      maxLife: 300,
      solid: false,
      vortex: true,
      targetX: 0,
      targetY: 0
    });
  }
}

function draw() {
  background(0, 0, 10, 0.05);
  
  // Periodically trigger coalescence every 3 seconds
  if (frameCount % 90 === 0) {
    triggerCoalescence();
  }
  
  // Update and draw characters
  for (let i = chars.length - 1; i >= 0; i--) {
    let c = chars[i];
    
    if (!c.solid) {
      // Apply vortex motion
      let centerX = width / 2;
      let centerY = height / 2;
      let dx = c.x - centerX;
      let dy = c.y - centerY;
      let distance = sqrt(dx * dx + dy * dy);
      
      // Vortex effect with decreasing influence as distance increases
      if (distance > 50) {
        let angle = atan2(dy, dx);
        let speed = map(distance, 50, width/2, 0.1, 0.02);
        c.speedX += sin(angle + PI/2) * speed;
        c.speedY += cos(angle + PI/2) * speed;
      }
      
      // Apply movement
      c.x += c.speedX;
      c.y += c.speedY;
      
      // Dampen velocity
      c.speedX *= 0.95;
      c.speedY *= 0.95;
      
      // Add some random motion to keep it organic
      c.speedX += random(-0.1, 0.1);
      c.speedY += random(-0.1, 0.1);
      
      // Rotation
      c.angle += c.spin;
      
      // Bounce off edges
      if (c.x < 0 || c.x > width) c.speedX *= -1;
      if (c.y < 0 || c.y > height) c.speedY *= -1;
    } else {
      // Solid state: move towards target position
      c.x += (c.targetX - c.x) * 0.05;
      c.y += (c.targetY - c.y) * 0.05;
      
      // Fade in and grow
      c.size = lerp(c.size, 24, 0.1);
      c.alpha = lerp(c.alpha, 1.0, 0.1);
    }
    
    // Fade out over time
    if (!c.solid) {
      c.life -= 1;
    }
    
    // Reset if life ends or off-screen
    if (c.life <= 0 || c.x < -50 || c.x > width + 50 || c.y < -50 || c.y > height + 50) {
      chars.splice(i, 1);
      chars.push({
        x: random(width),
        y: random(height),
        size: random(12, 28),
        char: random(wakeText.split('')),
        hue: random(180, 240),
        saturation: random(60, 90),
        brightness: random(40, 70),
        alpha: random(0.3, 0.7),
        speedX: 0,
        speedY: 0,
        angle: random(TWO_PI),
        spin: random(-0.02, 0.02),
        life: random(100, 300),
        maxLife: 300,
        solid: false,
        vortex: true,
        targetX: 0,
        targetY: 0
      });
    }
    
    // Draw character
    push();
    translate(c.x, c.y);
    rotate(c.angle);
    fill(c.hue, c.saturation, c.brightness, c.alpha);
    noStroke();
    textSize(c.size);
    textAlign(CENTER, CENTER);
    text(c.char, 0, 0);
    pop();
  }
}

function triggerCoalescence() {
  // Sort characters by distance to center
  chars.sort((a, b) => {
    let distA = dist(a.x, a.y, width/2, height/2);
    let distB = dist(b.x, b.y, width/2, height/2);
    return distA - distB;
  });
  
  // Arrange first 100 characters in lines
  let lineCount = 5;
  let charsPerLine = 20;
  let lineHeight = height / (lineCount + 1);
  
  for (let i = 0; i < 100 && i < chars.length; i++) {
    let c = chars[i];
    let lineIndex = Math.floor(i / charsPerLine);
    let charIndex = i % charsPerLine;
    
    if (lineIndex < lineCount) {
      c.solid = true;
      c.targetX = (width / charsPerLine) * charIndex + width / (charsPerLine * 2);
      c.targetY = lineHeight * (lineIndex + 1);
      
      // Increase size and brightness for legibility
      c.size = 24;
      c.alpha = 1.0;
      c.brightness = 90;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
