let threads = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create woven thread structures that mimic desert dunes
  for (let i = 0; i < 1500; i++) {
    threads.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-200, 200),
      length: random(20, 80),
      angle: random(TWO_PI),
      speed: random(0.001, 0.005),
      hue: random(200, 260), // Deep blue to purple range
      alpha: random(0.2, 0.6),
      frequency: random(0.01, 0.03),
      sway: random(0.5, 2),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(220, 30, 10, 0.05); // Deep blue background with slight fade
  
  time += 0.02;
  
  // Draw and update thread structures
  beginShape(LINES);
  for (let i = 0; i < threads.length; i++) {
    let thread = threads[i];
    
    // Animate position using noise and sine wave sway
    thread.x += cos(thread.angle) * thread.speed * 100;
    thread.y += sin(thread.angle) * thread.speed * 100;
    thread.z += (noise(thread.x * 0.002, thread.y * 0.002, time * thread.frequency) - 0.5) * 10;
    
    // Apply wave-like sway to angle
    thread.angle += (noise(thread.x * 0.002, thread.y * 0.002, time * thread.frequency) - 0.5) * 0.03;
    
    // Add subtle oscillation along the path
    let sway = sin(time * thread.sway + thread.phase) * 10;
    thread.angle += sway * 0.01;
    
    // Reset thread if out of bounds (create a continuous loop)
    if (thread.x < -width/2 - 100 || thread.x > width/2 + 100 ||
        thread.y < -height/2 - 100 || thread.y > height/2 + 100) {
      thread.x = random(-width/2, width/2);
      thread.y = random(-height/2, height/2);
      thread.z = random(-200, 200);
      thread.angle = random(TWO_PI);
    }
    
    // Draw the thread line
    stroke(thread.hue, 80, 90, thread.alpha);
    strokeWeight(1.5);
    
    let endX = thread.x + cos(thread.angle) * thread.length;
    let endY = thread.y + sin(thread.angle) * thread.length;
    
    vertex(thread.x, thread.y, thread.z);
    vertex(endX, endY, thread.z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
