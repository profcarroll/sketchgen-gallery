let rings = [];
let center;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  center = createVector(width / 2, height / 2);
  noStroke();
}

function draw() {
  background(0);
  
  // Update central point in figure-8 pattern
  let figureEightX = 150 * sin(time * 0.005);
  let figureEightY = 100 * sin(time * 0.01) * cos(time * 0.005);
  center.x = width / 2 + figureEightX;
  center.y = height / 2 + figureEightY;
  
  // Add new ring
  rings.push({
    x: center.x,
    y: center.y,
    radius: 0,
    alpha: 255,
    color: color(255, 215, 0, 255) // Bright gold
  });
  
  // Update and draw existing rings
  for (let i = rings.length - 1; i >= 0; i--) {
    let ring = rings[i];
    
    // Expand ring
    ring.radius += 3;
    
    // Fade out
    ring.alpha -= 2;
    
    // Draw ring with gradient effect
    let step = 5;
    for (let r = ring.radius; r > 0; r -= step) {
      let alpha = map(r, ring.radius, 0, 0, ring.alpha);
      if (alpha > 0) {
        fill(red(ring.color), green(ring.color), blue(ring.color), alpha);
        ellipse(ring.x, ring.y, r * 2);
      }
    }
    
    // Remove old rings
    if (ring.alpha <= 0) {
      rings.splice(i, 1);
    }
  }
  
  time++;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
