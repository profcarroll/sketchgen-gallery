let corals = [];
let flares = [];
let threads = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create bioluminescent coral formations
  for (let i = 0; i < 20; i++) {
    corals.push({
      x: random(width),
      y: random(height),
      size: random(80, 200),
      hue: random(180, 240), // Blue-green hues for deep sea
      segments: floor(random(5, 12)),
      noiseScale: random(0.01, 0.03),
      timeOffset: random(1000)
    });
  }
  
  // Create luminous flares
  for (let i = 0; i < 30; i++) {
    flares.push({
      x: random(width),
      y: random(height),
      size: random(5, 20),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      hue: random(300, 360), // Purple/pink hues
      pulseSpeed: random(0.02, 0.05),
      pulseOffset: random(1000)
    });
  }
  
  // Create flowing threads
  for (let i = 0; i < 100; i++) {
    threads.push({
      points: [],
      hue: random(180, 240),
      thickness: random(1, 3),
      speed: random(0.01, 0.03)
    });
  }
}

function draw() {
  background(220, 5, 5, 0.02); // Deep sea background with fade
  
  // Update and display corals
  for (let coral of corals) {
    // Create a pulsing, organic coral shape
    noStroke();
    fill(coral.hue, 70, 90, 0.15);
    
    push();
    translate(coral.x, coral.y);
    
    // Draw complex coral structure with noise-based deformation
    beginShape();
    for (let i = 0; i < coral.segments; i++) {
      let angle = map(i, 0, coral.segments, 0, TWO_PI);
      let r = coral.size * (0.8 + noise(frameCount * coral.noiseScale + angle + coral.timeOffset) * 0.4);
      let x = cos(angle) * r;
      let y = sin(angle) * r;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Add inner glow
    fill(coral.hue, 80, 100, 0.2);
    beginShape();
    for (let i = 0; i < coral.segments; i++) {
      let angle = map(i, 0, coral.segments, 0, TWO_PI);
      let r = coral.size * 0.6 * (0.9 + noise(frameCount * coral.noiseScale + angle + coral.timeOffset + 100) * 0.2);
      let x = cos(angle) * r;
      let y = sin(angle) * r;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Update and display flares
  for (let flare of flares) {
    flare.x += flare.speedX;
    flare.y += flare.speedY;
    
    // Wrap around screen
    if (flare.x < -20) flare.x = width + 20;
    if (flare.x > width + 20) flare.x = -20;
    if (flare.y < -20) flare.y = height + 20;
    if (flare.y > height + 20) flare.y = -20;
    
    // Pulsing effect
    let pulse = sin(frameCount * flare.pulseSpeed + flare.pulseOffset) * 0.5 + 0.5;
    let size = flare.size * (0.8 + pulse * 0.4);
    
    // Draw flare with gradient
    noStroke();
    fill(flare.hue, 80, 100, 0.3);
    ellipse(flare.x, flare.y, size);
    
    // Add inner core
    fill(flare.hue, 90, 100, 0.7);
    ellipse(flare.x, flare.y, size * 0.4);
  }
  
  // Update and display threads
  for (let thread of threads) {
    if (thread.points.length === 0) {
      // Initialize thread with starting point
      thread.points.push({
        x: random(width),
        y: random(height),
        age: 0
      });
    } else {
      // Add new point based on previous one
      let last = thread.points[thread.points.length - 1];
      thread.points.push({
        x: last.x + random(-2, 2),
        y: last.y + random(-2, 2),
        age: last.age + 1
      });
      
      // Remove old points to maintain thread length
      if (thread.points.length > 30) {
        thread.points.shift();
      }
    }
    
    // Draw thread with gradient
    noFill();
    stroke(thread.hue, 70, 100, 0.5);
    strokeWeight(thread.thickness);
    beginShape();
    for (let point of thread.points) {
      vertex(point.x, point.y);
    }
    endShape();
    
    // Add glow effect to thread ends
    if (thread.points.length > 1) {
      let last = thread.points[thread.points.length - 1];
      noStroke();
      fill(thread.hue, 80, 100, 0.2);
      ellipse(last.x, last.y, thread.thickness * 3);
    }
  }
  
  // Add occasional intersections between flares and corals
  for (let flare of flares) {
    for (let coral of corals) {
      let d = dist(flare.x, flare.y, coral.x, coral.y);
      if (d < coral.size * 0.8) {
        // Create a subtle intersection effect
        let angle = atan2(flare.y - coral.y, flare.x - coral.x);
        let interX = coral.x + cos(angle) * coral.size * 0.7;
        let interY = coral.y + sin(angle) * coral.size * 0.7;
        
        fill(coral.hue, 80, 100, 0.2);
        ellipse(interX, interY, 5);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
