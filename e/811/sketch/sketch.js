let threads = [];
let colors = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize thread sets
  for (let i = 0; i < 8; i++) {
    threads.push({
      x: 0,
      y: i * (height / 8),
      angle: i * 0.2,
      speed: random(0.005, 0.015),
      color: color(random(100, 255), random(100, 255), random(100, 255))
    });
  }
  for (let i = 0; i < 8; i++) {
    threads.push({
      x: i * (width / 8),
      y: 0,
      angle: i * 0.3 + PI/2,
      speed: random(0.005, 0.015),
      color: color(random(100, 255), random(100, 255), random(100, 255))
    });
  }
}

function draw() {
  background(10);
  time += 0.01;

  // Draw threads
  for (let i = 0; i < threads.length; i++) {
    let t = threads[i];
    t.x += cos(t.angle) * t.speed * 100;
    t.y += sin(t.angle) * t.speed * 100;
    
    if (t.x > width + 100 || t.x < -100 || t.y > height + 100 || t.y < -100) {
      t.x = random(width);
      t.y = random(height);
      t.angle = random(TWO_PI);
    }
    
    stroke(t.color);
    strokeWeight(2);
    line(t.x, t.y, t.x - cos(t.angle) * 50, t.y - sin(t.angle) * 50);
  }

  // Draw interlocking motifs
  noStroke();
  for (let i = 0; i < threads.length; i++) {
    for (let j = i + 1; j < threads.length; j++) {
      let t1 = threads[i];
      let t2 = threads[j];
      
      let d = dist(t1.x, t1.y, t2.x, t2.y);
      if (d < 100) {
        let inter = createVector(
          (t1.x + t2.x) / 2,
          (t1.y + t2.y) / 2
        );
        
        let c = lerpColor(t1.color, t2.color, 0.5);
        fill(c);
        ellipse(inter.x, inter.y, map(d, 0, 100, 20, 5), map(d, 0, 100, 20, 5));
      }
    }
  }

  // Continuous color shifts
  for (let i = 0; i < threads.length; i++) {
    threads[i].color = lerpColor(threads[i].color, color(
      sin(time + i) * 127 + 128,
      cos(time + i) * 127 + 128,
      tan(time + i) * 127 + 128
    ), 0.01);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
