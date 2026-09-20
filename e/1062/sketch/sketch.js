let rings = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);
  noStroke();
  // Initialize with a few rings at center
  for (let i = 0; i < 5; i++) {
    rings.push({
      x: width / 2,
      y: height / 2,
      radius: i * 20,
      alpha: 255 - i * 30,
      hue: (i * 40) % 255
    });
  }
}

function draw() {
  background(0);
  
  // Update and draw rings
  for (let i = rings.length - 1; i >= 0; i--) {
    let r = rings[i];
    r.radius += 2;
    r.alpha -= 1.5;
    
    if (r.alpha <= 0) {
      rings.splice(i, 1);
    } else {
      fill(r.hue, 255, 255, r.alpha);
      ellipse(r.x, r.y, r.radius * 2, r.radius * 2);
      
      // Add a ripple effect by drawing a smaller ring inside
      if (r.radius % 30 < 10) {
        fill(255, 255, 255, r.alpha * 0.5);
        ellipse(r.x, r.y, r.radius * 0.8, r.radius * 0.8);
      }
    }
  }
  
  // Occasionally add a new ring
  if (frameCount % 10 === 0) {
    rings.push({
      x: width / 2,
      y: height / 2,
      radius: 0,
      alpha: 255,
      hue: (frameCount * 3) % 255
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
