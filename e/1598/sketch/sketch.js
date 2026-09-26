let threads = [];
const threadCount = 200;
const triangleSize = 15;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize moving threads with consistent direction
  for (let i = 0; i < threadCount; i++) {
    threads.push({
      x: random(width),
      y: random(height),
      dx: random(-1, 1),
      dy: random(-1, 1),
      hue: random(360),
      life: random(200, 800)
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

    if (t.life <= 0 || t.x < 0 || t.x > width || t.y < 0 || t.y > height) {
      threads.splice(i, 1);
      // Add new thread to replace it
      threads.push({
        x: random(width),
        y: random(height),
        dx: random(-1, 1),
        dy: random(-1, 1),
        hue: random(360),
        life: random(200, 800)
      });
    } else {
      stroke(t.hue, 80, 90);
      strokeWeight(1);
      
      // Draw thread segments
      let nextX = t.x + t.dx * 20;
      let nextY = t.y + t.dy * 20;
      line(t.x, t.y, nextX, nextY);
      
      // Draw equilateral triangle at current position
      drawEquilateralTriangle(t.x, t.y, triangleSize, t.hue);
    }
  }

  // Occasionally add new threads
  if (random() < 0.1) {
    threads.push({
      x: random(width),
      y: random(height),
      dx: random(-1, 1),
      dy: random(-1, 1),
      hue: random(360),
      life: random(200, 800)
    });
  }
}

function drawEquilateralTriangle(x, y, size, hue) {
  // Calculate vertices of equilateral triangle
  let h = size * sqrt(3) / 2;
  let x1 = x - size/2;
  let y1 = y + h/3;
  let x2 = x + size/2;
  let y2 = y + h/3;
  let x3 = x;
  let y3 = y - 2*h/3;
  
  // Draw triangle with consistent stroke weight
  stroke(hue, 80, 90);
  strokeWeight(0.5);
  noFill();
  triangle(x1, y1, x2, y2, x3, y3);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
