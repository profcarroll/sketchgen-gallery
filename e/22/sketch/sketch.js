function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
}

function draw() {
  background(0, 0, 100, 1);
  
  // Animation parameters
  const time = millis() * 0.0005;
  const speed = 0.02;
  
  // Draw halftone stripes with shifting patterns
  for (let y = 0; y < height; y += 30) {
    const offset = sin(time + y * 0.01) * 50;
    const angle = time * 0.5 + y * 0.005;
    
    // Create a shifting diagonal pattern
    for (let x = -width; x < width * 2; x += 60) {
      const stripeX = x + offset + sin(time * 0.7 + y * 0.01) * 30;
      
      // Calculate color based on position and time
      const hue = (frameCount * 0.5 + y * 0.2 + x * 0.1) % 360;
      const saturation = 90 + sin(time * 0.3 + y * 0.01) * 10;
      const brightness = 80 + cos(time * 0.4 + x * 0.01) * 20;
      
      // Draw the stripe with halftone effect
      push();
      translate(stripeX, y);
      rotate(angle);
      
      // Stripe base
      fill(hue, saturation, brightness, 1);
      rect(0, -15, 100, 30);
      
      // Halftone dots
      noStroke();
      for (let i = 0; i < 20; i++) {
        const dotX = i * 5;
        const dotY = sin(i * 0.5 + time) * 8;
        const dotSize = 2 + sin(time * 2 + i) * 1.5;
        
        fill(0, 0, 0, 0.3);
        ellipse(dotX, dotY, dotSize, dotSize);
      }
      
      pop();
    }
  }
  
  // Add a subtle overlay that shifts the whole composition
  const overlayOffset = sin(time * 0.3) * 20;
  fill(0, 0, 0, 0.02);
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
