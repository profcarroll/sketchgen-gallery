let threads = [];
const threadCount = 100;
const warp = [];
const weft = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  // Create warp threads (vertical)
  for (let i = 0; i < 20; i++) {
    warp.push({
      x: map(i, 0, 19, 0, width),
      y1: 0,
      y2: height,
      hue: random(360)
    });
  }

  // Create weft threads (horizontal)
  for (let i = 0; i < 15; i++) {
    weft.push({
      x1: 0,
      x2: width,
      y: map(i, 0, 14, 0, height),
      hue: random(360)
    });
  }

  // Initialize moving threads
  for (let i = 0; i < threadCount; i++) {
    threads.push({
      x: random(width),
      y: random(height),
      dx: random(-2, 2),
      dy: random(-2, 2),
      hue: random(360),
      life: random(100, 500)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05); // Semi-transparent background for trail effect

  // Draw warp threads
  strokeWeight(1);
  for (let thread of warp) {
    stroke(thread.hue, 80, 90);
    line(thread.x, thread.y1, thread.x, thread.y2);
  }

  // Draw weft threads
  for (let thread of weft) {
    stroke(thread.hue, 80, 90);
    line(thread.x1, thread.y, thread.x2, thread.y);
  }

  // Update and draw moving threads
  for (let i = threads.length - 1; i >= 0; i--) {
    let t = threads[i];
    
    t.x += t.dx;
    t.y += t.dy;
    t.life--;

    if (t.life <= 0 || t.x < 0 || t.x > width || t.y < 0 || t.y > height) {
      threads.splice(i, 1);
      // Add new thread to replace it
      threads.push({
        x: random(width),
        y: random(height),
        dx: random(-2, 2),
        dy: random(-2, 2),
        hue: random(360),
        life: random(100, 500)
      });
    } else {
      stroke(t.hue, 80, 90);
      strokeWeight(2);
      point(t.x, t.y);
      
      // Draw thread segments
      let nextX = t.x + t.dx * 10;
      let nextY = t.y + t.dy * 10;
      line(t.x, t.y, nextX, nextY);
    }
  }

  // Occasionally add new threads
  if (random() < 0.1) {
    threads.push({
      x: random(width),
      y: random(height),
      dx: random(-2, 2),
      dy: random(-2, 2),
      hue: random(360),
      life: random(100, 500)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
