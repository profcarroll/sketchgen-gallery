let shapes = [];
let connections = [];

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100, 1);
  
  for (let i = 0; i < 200; i++) {
    shapes.push({
      x: random(width),
      y: random(height),
      size: random(10, 50),
      speedX: random(-1, 1),
      speedY: random(-1, 1),
      hue: random(360),
      pulse: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05);
  
  // Update and display shapes
  for (let i = 0; i < shapes.length; i++) {
    let s = shapes[i];
    
    // Update position
    s.x += s.speedX;
    s.y += s.speedY;
    
    // Bounce off edges
    if (s.x < 0 || s.x > width) s.speedX *= -1;
    if (s.y < 0 || s.y > height) s.speedY *= -1;
    
    // Update hue and pulse
    s.hue = (s.hue + 0.5) % 360;
    s.pulse += 0.05;
    
    // Draw shape
    noStroke();
    fill(s.hue, 80, 90, 0.7);
    ellipse(s.x, s.y, s.size + sin(s.pulse) * 10);
  }
  
  // Create connections between nearby shapes
  connections = [];
  for (let i = 0; i < shapes.length; i++) {
    for (let j = i + 1; j < shapes.length; j++) {
      let s1 = shapes[i];
      let s2 = shapes[j];
      let d = dist(s1.x, s1.y, s2.x, s2.y);
      
      if (d < 150) {
        connections.push({s1, s2, d});
      }
    }
  }
  
  // Draw connections
  strokeWeight(0.5);
  for (let conn of connections) {
    let alpha = map(conn.d, 0, 150, 0.8, 0.1);
    stroke((conn.s1.hue + conn.s2.hue) / 2, 80, 90, alpha);
    line(conn.s1.x, conn.s1.y, conn.s2.x, conn.s2.y);
  }
}
