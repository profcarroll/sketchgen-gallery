let streaks = [];
const numStreaks = 200;
const maxConnections = 100;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  for (let i = 0; i < numStreaks; i++) {
    streaks.push({
      pos: createVector(random(width), random(height)),
      vel: p5.Vector.random2D().mult(random(0.5, 2)),
      hue: random(360),
      size: random(2, 8),
      life: random(100, 300),
      points: []
    });
  }
}

function draw() {
  background(0, 0, 0, 0.1);
  
  for (let i = 0; i < streaks.length; i++) {
    let s = streaks[i];
    
    // Update position
    s.pos.add(s.vel);
    
    // Wrap around edges
    if (s.pos.x > width) s.pos.x = 0;
    else if (s.pos.x < 0) s.pos.x = width;
    if (s.pos.y > height) s.pos.y = 0;
    else if (s.pos.y < 0) s.pos.y = height;
    
    // Add current position to points trail
    s.points.push(s.pos.copy());
    if (s.points.length > 20) {
      s.points.shift();
    }
    
    // Draw streak trail
    const alpha = map(s.life, 0, 300, 0, 0.8);
    fill(s.hue, 80, 90, alpha);
    
    beginShape();
    for (let j = 0; j < s.points.length; j++) {
      const point = s.points[j];
      const size = map(j, 0, s.points.length - 1, 0, s.size);
      vertex(point.x, point.y);
    }
    endShape();
    
    // Occasionally form geometric shape at intersection
    if (random() < 0.005 && s.points.length > 5) {
      const lastPoint = s.points[s.points.length - 1];
      const secondLastPoint = s.points[s.points.length - 2];
      
      fill(s.hue, 90, 100, 0.9);
      triangle(
        lastPoint.x,
        lastPoint.y,
        secondLastPoint.x,
        secondLastPoint.y,
        lastPoint.x + random(-10, 10),
        lastPoint.y + random(-10, 10)
      );
    }
    
    // Decrease life
    s.life--;
    if (s.life <= 0) {
      s.pos = createVector(random(width), random(height));
      s.vel = p5.Vector.random2D().mult(random(0.5, 2));
      s.hue = (s.hue + 10) % 360;
      s.points = [];
      s.life = random(100, 300);
    }
    
    // Connect to nearby streaks
    for (let j = i + 1; j < streaks.length; j++) {
      let other = streaks[j];
      const d = dist(s.pos.x, s.pos.y, other.pos.x, other.pos.y);
      
      if (d < 80 && random() < 0.02) {
        stroke(s.hue, 70, 100, 0.3);
        line(s.pos.x, s.pos.y, other.pos.x, other.pos.y);
      }
    }
  }
}
