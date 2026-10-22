let threads = [];
let time = 0;
const numThreads = 200;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize threads with varying properties
  for (let i = 0; i < numThreads; i++) {
    threads.push({
      x: random(width),
      y: random(height),
      size: random(200, 600),
      speed: random(0.001, 0.003),
      angle: random(TWO_PI),
      color: color(random(30, 60), random(70, 90), random(40, 80)),
      segments: [],
      segmentCount: 20,
    });
  }
  
  // Pre-generate thread segments
  for (let i = 0; i < threads.length; i++) {
    let t = threads[i];
    t.segments = [];
    for (let j = 0; j < t.segmentCount; j++) {
      t.segments.push({
        x: t.x,
        y: t.y,
        age: 0
      });
    }
  }
}

function draw() {
  background(0, 0, 10, 0.02); // Semi-transparent background for trail effect
  
  time += 0.005;
  
  // Draw and update each thread
  for (let i = 0; i < threads.length; i++) {
    let t = threads[i];
    
    // Update position based on time and angle
    t.x += cos(t.angle) * t.speed * 10;
    t.y += sin(t.angle) * t.speed * 10;
    
    // Wrap around edges
    if (t.x > width + 500) t.x = -500;
    if (t.x < -500) t.x = width + 500;
    if (t.y > height + 500) t.y = -500;
    if (t.y < -500) t.y = height + 500;
    
    // Apply subtle noise to angle for organic movement
    t.angle += noise(t.x * 0.002, t.y * 0.002, time) * 0.03 - 0.015;
    
    // Update segments with smooth motion
    for (let j = 0; j < t.segments.length; j++) {
      let s = t.segments[j];
      
      // Move segment towards current thread position
      s.x += (t.x - s.x) * 0.02;
      s.y += (t.y - s.y) * 0.02;
      
      // Age the segment
      s.age += 0.01;
    }
    
    // Draw thread as a series of connected segments
    stroke(t.color);
    noFill();
    strokeWeight(1);
    
    beginShape();
    for (let j = 0; j < t.segments.length; j++) {
      let s = t.segments[j];
      let alpha = map(s.age, 0, 2, 0, 1);
      stroke(t.color, alpha);
      
      // Add a bit of noise to the segment position for organic flow
      let n = noise(s.x * 0.005, s.y * 0.005, time + j) * 5;
      vertex(s.x + n, s.y + n);
    }
    endShape();
    
    // Draw a central point with glow effect
    fill(t.color, 0.7);
    noStroke();
    ellipse(t.x, t.y, 8, 8);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
