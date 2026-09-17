let threads = [];
let threadCount = 150;
let hueOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  frameRate(30);

  // Initialize threads with random positions and directions
  for (let i = 0; i < threadCount; i++) {
    threads.push({
      x: random(width),
      y: random(height),
      vx: random(-1, 1),
      vy: random(-1, 1),
      hue: random(360),
      alpha: random(0.2, 0.7),
      size: random(2, 6)
    });
  }
}

function draw() {
  // Semi-transparent background to create trail effect
  background(0, 0, 0, 0.05);

  hueOffset += 0.3;
  
  // Draw threads as glowing lines
  beginShape(LINES);
  for (let i = 0; i < threads.length; i++) {
    let t1 = threads[i];
    
    // Update position
    t1.x += t1.vx;
    t1.y += t1.vy;
    
    // Bounce off edges
    if (t1.x < 0 || t1.x > width) t1.vx *= -1;
    if (t1.y < 0 || t1.y > height) t1.vy *= -1;
    
    // Add some randomness to movement
    t1.vx += random(-0.02, 0.02);
    t1.vy += random(-0.02, 0.02);
    
    // Clamp velocity
    t1.vx = constrain(t1.vx, -2, 2);
    t1.vy = constrain(t1.vy, -2, 2);
    
    // Draw line from current thread to other threads within a radius
    for (let j = i + 1; j < threads.length; j++) {
      let t2 = threads[j];
      
      // Calculate distance
      let dx = t1.x - t2.x;
      let dy = t1.y - t2.y;
      let d = Math.sqrt(dx * dx + dy * dy);
      
      if (d < 150) {
        // Interpolate hue based on distance for color gradient effect
        let h = (t1.hue + t2.hue) / 2;
        let a = map(d, 0, 150, 0.8, 0);
        
        stroke((h + hueOffset) % 360, 100, 100, a);
        vertex(t1.x, t1.y);
        vertex(t2.x, t2.y);
      }
    }
    
    // Draw the thread point itself
    fill((t1.hue + hueOffset) % 360, 100, 100, t1.alpha);
    ellipse(t1.x, t1.y, t1.size);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
