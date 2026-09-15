let streams = [];
let polygons = [];
let time = 0;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial streams
  for (let i = 0; i < 15; i++) {
    streams.push({
      x: random(width),
      y: random(height),
      hue: random(360),
      size: random(20, 80),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      points: [],
      pointCount: 100
    });
  }
}

function draw() {
  background(0, 0, 0, 0.1);
  
  time += 0.01;
  
  // Update and draw streams
  for (let i = 0; i < streams.length; i++) {
    let s = streams[i];
    
    // Move stream
    s.x += cos(s.angle) * s.speed;
    s.y += sin(s.angle) * s.speed;
    
    // Change direction occasionally
    if (random() < 0.02) {
      s.angle += random(-0.5, 0.5);
    }
    
    // Wrap around edges
    if (s.x < -50) s.x = width + 50;
    if (s.x > width + 50) s.x = -50;
    if (s.y < -50) s.y = height + 50;
    if (s.y > height + 50) s.y = -50;
    
    // Add new point to trail
    s.points.push({x: s.x, y: s.y});
    if (s.points.length > s.pointCount) {
      s.points.shift();
    }
    
    // Draw stream
    noFill();
    stroke(s.hue, 80, 90, 0.7);
    strokeWeight(2);
    beginShape();
    for (let p of s.points) {
      curveVertex(p.x, p.y);
    }
    endShape();
    
    // Occasionally create a polygon
    if (random() < 0.005) {
      polygons.push({
        x: s.x,
        y: s.y,
        size: random(20, 60),
        hue: s.hue,
        angle: random(TWO_PI),
        points: [],
        life: 100
      });
    }
  }
  
  // Update and draw polygons
  for (let i = polygons.length - 1; i >= 0; i--) {
    let p = polygons[i];
    
    // Draw polygon
    fill(p.hue, 80, 90, 0.5);
    noStroke();
    beginShape();
    for (let j = 0; j < 6; j++) {
      let angle = p.angle + TWO_PI * j / 6;
      let x = p.x + cos(angle) * p.size;
      let y = p.y + sin(angle) * p.size;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Fade out
    p.life--;
    if (p.life <= 0) {
      polygons.splice(i, 1);
    }
  }
  
  // Occasionally create a burst of light
  if (random() < 0.002) {
    for (let i = 0; i < 10; i++) {
      let angle = random(TWO_PI);
      let speed = random(2, 5);
      let x = width/2;
      let y = height/2;
      
      // Create a burst particle
      stroke(random(360), 80, 90, 0.7);
      strokeWeight(1);
      point(x + cos(angle) * speed * 10, y + sin(angle) * speed * 10);
    }
  }
}
