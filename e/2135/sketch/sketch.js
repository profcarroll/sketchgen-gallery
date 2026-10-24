function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  angleMode(RADIANS);
  
  // Initialize bioluminescent threads
  threads = [];
  for (let i = 0; i < 200; i++) {
    threads.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      hue: random(180, 300), // Cool blues to purples
      saturation: random(70, 90),
      brightness: random(60, 90),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      segments: floor(random(3, 8)),
      age: random(100),
      maxAge: random(200, 500)
    });
  }
  
  // Hexagon boundary points
  hexRadius = min(width, height) * 0.4;
  hexPoints = [];
  for (let i = 0; i < 6; i++) {
    const angle = TWO_PI / 6 * i - PI/2;
    hexPoints.push({
      x: width/2 + cos(angle) * hexRadius,
      y: height/2 + sin(angle) * hexRadius
    });
  }
}

function draw() {
  background(240, 10, 5, 1);
  
  const time = frameCount * 0.01;
  
  // Draw hexagonal boundary
  push();
  translate(width/2, height/2);
  stroke(180, 30, 80, 0.3);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i < 6; i++) {
    const point = hexPoints[i];
    vertex(point.x - width/2, point.y - height/2);
  }
  endShape(CLOSE);
  pop();
  
  // Update and draw bioluminescent threads
  for (let i = 0; i < threads.length; i++) {
    const thread = threads[i];
    
    // Age the thread
    thread.age++;
    
    if (thread.age > thread.maxAge) {
      // Reset thread
      thread.x = random(width);
      thread.y = random(height);
      thread.age = 0;
      thread.hue = random(180, 300);
      thread.size = random(1, 3);
      thread.speed = random(0.5, 2);
    }
    
    // Update position
    thread.x += cos(thread.angle) * thread.speed;
    thread.y += sin(thread.angle) * thread.speed;
    
    // Gentle turning
    thread.angle += random(-0.05, 0.05);
    
    // Boundary check - bounce off hexagon
    const center = { x: width/2, y: height/2 };
    const distToCenter = dist(thread.x, thread.y, center.x, center.y);
    
    if (distToCenter > hexRadius - 10) {
      // Reflect angle based on normal vector to hexagon edge
      const angleToCenter = atan2(thread.y - center.y, thread.x - center.x);
      const bounceAngle = angleToCenter + PI;
      
      // Adjust angle with some randomness
      thread.angle = bounceAngle + random(-0.5, 0.5);
    }
    
    // Draw thread segment
    push();
    translate(thread.x, thread.y);
    
    // Create a gradient effect
    const alpha = map(thread.age, 0, thread.maxAge, 0.2, 1);
    fill(thread.hue, thread.saturation, thread.brightness, alpha);
    
    // Draw a small blob or segment
    ellipse(0, 0, thread.size, thread.size);
    
    pop();
  }
  
  // Draw connecting threads between nearby points for network effect
  const maxConnections = 200;
  let connections = 0;
  
  beginShape(LINES);
  stroke(180, 50, 70, 0.2);
  strokeWeight(0.5);
  
  for (let i = 0; i < threads.length && connections < maxConnections; i++) {
    const thread1 = threads[i];
    
    for (let j = i + 1; j < threads.length && connections < maxConnections; j++) {
      const thread2 = threads[j];
      
      const d = dist(thread1.x, thread1.y, thread2.x, thread2.y);
      if (d < 100) { // Only connect nearby threads
        vertex(thread1.x, thread1.y);
        vertex(thread2.x, thread2.y);
        connections++;
      }
    }
  }
  
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
