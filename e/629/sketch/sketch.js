let streaks = [];
const numStreaks = 200;
let starburstPatterns = [];

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  frameRate(30);

  for (let i = 0; i < numStreaks; i++) {
    streaks.push({
      x: random(width),
      y: random(height),
      vx: random(-2, 2),
      vy: random(-2, 2),
      hue: random(360),
      size: random(2, 8),
      life: random(100, 200)
    });
  }
}

function draw() {
  background(0, 0, 10);
  
  // Update and display streaks
  for (let i = streaks.length - 1; i >= 0; i--) {
    let s = streaks[i];
    
    s.x += s.vx;
    s.y += s.vy;
    s.life--;
    
    if (s.life <= 0) {
      streaks.splice(i, 1);
      streaks.push({
        x: random(width),
        y: random(height),
        vx: random(-2, 2),
        vy: random(-2, 2),
        hue: random(360),
        size: random(2, 8),
        life: random(100, 200)
      });
    } else {
      fill(s.hue, 80, 90, 0.7);
      ellipse(s.x, s.y, s.size);
      
      // Check for intersections
      for (let j = i - 1; j >= 0; j--) {
        let other = streaks[j];
        let d = dist(s.x, s.y, other.x, other.y);
        
        if (d < 20) {
          createStarburst(s.x, s.y);
          // Reset streaks to avoid persistent intersections
          s.vx = random(-2, 2);
          s.vy = random(-2, 2);
          other.vx = random(-2, 2);
          other.vy = random(-2, 2);
        }
      }
    }
  }

  // Draw starbursts
  for (let i = starburstPatterns.length - 1; i >= 0; i--) {
    let p = starburstPatterns[i];
    p.life--;
    
    if (p.life <= 0) {
      starburstPatterns.splice(i, 1);
    } else {
      fill(p.hue, 90, 95, 0.8);
      for (let j = 0; j < p.points.length; j++) {
        let pt = p.points[j];
        ellipse(pt.x, pt.y, 3 + (p.life / 10));
      }
    }
  }
}

function createStarburst(x, y) {
  let hue = random(360);
  let points = [];
  for (let i = 0; i < 8; i++) {
    let angle = map(i, 0, 8, 0, TWO_PI);
    let radius = random(10, 30);
    points.push({
      x: x + cos(angle) * radius,
      y: y + sin(angle) * radius
    });
  }
  
  starburstPatterns.push({
    x: x,
    y: y,
    hue: hue,
    points: points,
    life: 50
  });
}
