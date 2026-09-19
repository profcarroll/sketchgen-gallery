let bricks = [];
let roots = [];
let mortar = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create brick wall
  for (let y = 0; y < height; y += 60) {
    for (let x = 0; x < width; x += 80) {
      bricks.push({
        x: x + random(-5, 5),
        y: y + random(-5, 5),
        w: 70 + random(-5, 5),
        h: 50 + random(-5, 5),
        color: color(
          180 + random(-20, 20),
          120 + random(-20, 20),
          80 + random(-20, 20)
        ),
        highlight: color(
          220 + random(-30, 30),
          160 + random(-30, 30),
          100 + random(-30, 30)
        )
      });
    }
  }
  
  // Create mortar lines
  for (let y = 0; y < height; y += 60) {
    for (let x = 0; x < width; x += 80) {
      mortar.push({
        x: x + 35,
        y: y + 25,
        w: 70,
        h: 10
      });
    }
  }
  
  // Create initial roots
  for (let i = 0; i < 15; i++) {
    roots.push({
      x: random(width),
      y: height,
      size: random(2, 6),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      segments: [],
      active: false
    });
  }
}

function draw() {
  background(40);
  
  time += 0.01;
  
  // Draw mortar lines
  for (let m of mortar) {
    fill(60, 50, 40);
    rect(m.x - m.w/2, m.y - m.h/2, m.w, m.h);
  }
  
  // Draw bricks
  for (let b of bricks) {
    fill(b.color);
    rect(b.x, b.y, b.w, b.h, 5);
    
    // Brick highlight
    fill(b.highlight);
    rect(b.x + 5, b.y + 5, b.w - 10, 8, 3);
  }
  
  // Update and draw roots
  for (let root of roots) {
    if (!root.active && random() < 0.02) {
      root.active = true;
    }
    
    if (root.active) {
      root.x += cos(root.angle) * root.speed;
      root.y -= root.speed;
      
      // Add segment to root trail
      root.segments.push({x: root.x, y: root.y, size: root.size});
      if (root.segments.length > 100) {
        root.segments.shift();
      }
      
      // Draw root segments
      for (let i = 0; i < root.segments.length - 1; i++) {
        let seg1 = root.segments[i];
        let seg2 = root.segments[i + 1];
        
        stroke(150, 100, 50);
        strokeWeight(seg1.size * (i / root.segments.length));
        line(seg1.x, seg1.y, seg2.x, seg2.y);
      }
      
      // Check for contact with bricks
      for (let b of bricks) {
        if (dist(root.x, root.y, b.x + b.w/2, b.y + b.h/2) < 30) {
          // Create spalling effect
          for (let i = 0; i < 5; i++) {
            let chunk = {
              x: b.x + random(b.w),
              y: b.y + random(b.h),
              size: random(2, 8),
              vx: random(-2, 2),
              vy: random(-2, -0.5),
              life: 100
            };
            // In a real sketch this would be part of a particle system
          }
        }
      }
      
      // Fade out root when it gets to top
      if (root.y < 0) {
        root.active = false;
        root.segments = [];
      }
    }
  }
  
  // Add some additional cracking effects
  if (frameCount % 10 === 0) {
    for (let i = 0; i < 3; i++) {
      let x = random(width);
      let y = random(height);
      let w = random(5, 20);
      let h = random(1, 5);
      
      fill(60, 50, 40, 150);
      rect(x, y, w, h);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
