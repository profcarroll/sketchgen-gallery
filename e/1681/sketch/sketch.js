let threads = [];
const threadCount = 150;
const maxConnections = 300;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize threads with consistent direction
  for (let i = 0; i < threadCount; i++) {
    threads.push({
      x: random(width),
      y: random(height),
      dx: random(-1, 1),
      dy: random(-1, 1),
      hue: random(360),
      life: random(200, 800),
      history: []
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05); // Semi-transparent background for trail effect

  // Update and draw threads
  for (let i = threads.length - 1; i >= 0; i--) {
    let t = threads[i];
    
    t.x += t.dx;
    t.y += t.dy;
    t.life--;
    
    // Store position history for trail effect
    t.history.push({x: t.x, y: t.y});
    if (t.history.length > 20) {
      t.history.shift();
    }

    if (t.life <= 0 || t.x < 0 || t.x > width || t.y < 0 || t.y > height) {
      threads.splice(i, 1);
      // Add new thread to replace it
      threads.push({
        x: random(width),
        y: random(height),
        dx: random(-1, 1),
        dy: random(-1, 1),
        hue: random(360),
        life: random(200, 800),
        history: []
      });
    } else {
      stroke(t.hue, 80, 90);
      strokeWeight(1);
      
      // Draw thread trail
      if (t.history.length > 1) {
        beginShape();
        for (let j = 0; j < t.history.length; j++) {
          vertex(t.history[j].x, t.history[j].y);
        }
        endShape();
      }

      // Draw current thread segment
      let nextX = t.x + t.dx * 20;
      let nextY = t.y + t.dy * 20;
      line(t.x, t.y, nextX, nextY);
    }
  }

  // Draw connections between threads that intersect at points where three colors meet
  drawIntersections();
  
  // Occasionally add new threads
  if (random() < 0.1) {
    threads.push({
      x: random(width),
      y: random(height),
      dx: random(-1, 1),
      dy: random(-1, 1),
      hue: random(360),
      life: random(200, 800),
      history: []
    });
  }
}

function drawIntersections() {
  // Connect threads that come close together
  let connections = [];
  
  for (let i = 0; i < threads.length; i++) {
    for (let j = i + 1; j < threads.length; j++) {
      if (connections.length >= maxConnections) break;
      
      let t1 = threads[i];
      let t2 = threads[j];
      
      // Calculate distance between thread positions
      let dx = t1.x - t2.x;
      let dy = t1.y - t2.y;
      let distance = sqrt(dx * dx + dy * dy);
      
      if (distance < 30) {
        connections.push({
          x1: t1.x,
          y1: t1.y,
          x2: t2.x,
          y2: t2.y,
          hue1: t1.hue,
          hue2: t2.hue
        });
      }
    }
  }
  
  // Draw connections with color blending at intersection points
  for (let conn of connections) {
    let blend = (conn.hue1 + conn.hue2) / 2;
    stroke(blend, 80, 90);
    strokeWeight(0.5);
    line(conn.x1, conn.y1, conn.x2, conn.y2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
