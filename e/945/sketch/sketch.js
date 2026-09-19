let bricks = [];
let vines = [];
let rootSystem;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create brick wall
  for (let y = 0; y < height; y += 60) {
    for (let x = 0; x < width; x += 80) {
      bricks.push({
        x: x + random(-5, 5),
        y: y + random(-3, 3),
        w: 70 + random(-5, 5),
        h: 50 + random(-3, 3),
        color: color(
          120 + random(-20, 20),
          40 + random(-10, 10),
          20 + random(-5, 5),
          255
        ),
        mortar: color(60 + random(-10, 10), 30 + random(-5, 5), 10)
      });
    }
  }
  
  // Initialize root system
  rootSystem = [];
  for (let i = 0; i < 100; i++) {
    rootSystem.push({
      x: random(width),
      y: height,
      length: 0,
      angle: random(TWO_PI),
      segments: [],
      maxSegments: 50 + floor(random(30)),
      growing: true
    });
  }
  
  // Create initial vines
  for (let i = 0; i < 50; i++) {
    vines.push({
      x: random(width),
      y: height,
      segments: [],
      maxSegments: 100 + floor(random(50)),
      growing: true,
      angle: -HALF_PI + random(-0.2, 0.2)
    });
  }
}

function draw() {
  background(30, 20, 10);
  
  // Draw brick wall with weathering
  for (let brick of bricks) {
    fill(brick.color);
    rect(brick.x, brick.y, brick.w, brick.h);
    
    // Add mortar lines
    stroke(brick.mortar);
    strokeWeight(2);
    line(brick.x, brick.y, brick.x + brick.w, brick.y);
    line(brick.x, brick.y + brick.h, brick.x + brick.w, brick.y + brick.h);
    line(brick.x, brick.y, brick.x, brick.y + brick.h);
    line(brick.x + brick.w, brick.y, brick.x + brick.w, brick.y + brick.h);
    
    // Add decay effects
    if (random() < 0.1) {
      fill(255, 255, 255, 30);
      ellipse(
        brick.x + random(brick.w),
        brick.y + random(brick.h),
        random(3, 8)
      );
    }
  }
  
  // Update and draw roots
  for (let root of rootSystem) {
    if (root.growing && root.length < 300) {
      root.length += 0.5;
      root.angle += random(-0.05, 0.05);
      
      // Add new segment
      root.segments.push({
        x: root.x + cos(root.angle) * root.length,
        y: root.y + sin(root.angle) * root.length,
        size: map(root.length, 0, 300, 2, 8)
      });
      
      // Randomly change direction to simulate growth
      if (frameCount % 15 === 0) {
        root.angle += random(-0.2, 0.2);
      }
    }
    
    // Draw root segments
    for (let i = 0; i < root.segments.length - 1; i++) {
      let s1 = root.segments[i];
      let s2 = root.segments[i + 1];
      
      stroke(80, 60, 20);
      strokeWeight(s1.size * 0.5);
      line(s1.x, s1.y, s2.x, s2.y);
    }
    
    // Occasionally crack mortar
    if (random() < 0.005) {
      let crackX = root.segments[root.segments.length - 1].x;
      let crackY = root.segments[root.segments.length - 1].y;
      fill(100, 80, 40);
      ellipse(crackX, crackY, random(3, 6));
    }
  }
  
  // Update and draw vines
  for (let vine of vines) {
    if (vine.growing && vine.segments.length < vine.maxSegments) {
      let last = vine.segments[vine.segments.length - 1];
      let x = last ? last.x : vine.x;
      let y = last ? last.y : vine.y;
      
      // Grow upward
      vine.angle += random(-0.02, 0.02);
      x += cos(vine.angle) * 0.5;
      y -= 1;
      
      vine.segments.push({
        x: x,
        y: y,
        size: map(vine.segments.length, 0, vine.maxSegments, 1, 6)
      });
    }
    
    // Draw vine segments
    for (let i = 0; i < vine.segments.length - 1; i++) {
      let s1 = vine.segments[i];
      let s2 = vine.segments[i + 1];
      
      stroke(30, 150, 40);
      strokeWeight(s1.size * 0.7);
      line(s1.x, s1.y, s2.x, s2.y);
    }
    
    // Occasionally add new growth
    if (random() < 0.01 && vine.segments.length > 30) {
      let last = vine.segments[vine.segments.length - 1];
      vines.push({
        x: last.x + random(-5, 5),
        y: last.y,
        segments: [],
        maxSegments: 100 + floor(random(50)),
        growing: true,
        angle: -HALF_PI + random(-0.3, 0.3)
      });
    }
  }
  
  // Add some green patches
  for (let i = 0; i < 20; i++) {
    fill(20, 120, 40, 150);
    ellipse(
      random(width),
      random(height),
      random(10, 30)
    );
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
