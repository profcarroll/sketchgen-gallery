function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  background(0, 0, 100);

  // Shift and rotate the entire pattern
  const time = millis() * 0.0005;
  const rotation = sin(time) * 0.1;

  // Draw diagonal stripes with primary colors
  const stripeCount = 20;
  const stripeWidth = width / stripeCount;
  
  for (let i = 0; i < stripeCount; i++) {
    const hue = (i * 360 / stripeCount + time * 20) % 360;
    const angle = rotation + map(i, 0, stripeCount, -PI/4, PI/4);
    
    push();
    translate(width/2, height/2);
    rotate(angle);
    fill(hue, 100, 100);
    noStroke();
    
    // Draw each stripe as a rectangle
    rect(-width/2, i * stripeWidth - height/2, width, stripeWidth);
    pop();
  }

  // Add halftone dot texture
  const dotSize = 4;
  const dotSpacing = 10;
  
  for (let y = 0; y < height; y += dotSpacing) {
    for (let x = 0; x < width; x += dotSpacing) {
      if ((x + y) % (dotSpacing * 2) === 0) {
        const alpha = map(noise(x * 0.01, y * 0.01, time), 0, 1, 0, 50);
        fill(0, 0, 0, alpha);
        noStroke();
        ellipse(x, y, dotSize);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
