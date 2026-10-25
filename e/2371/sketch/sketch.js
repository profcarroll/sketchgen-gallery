let lightStreaks = [];
let crystalClusters = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  
  // Create light streaks that converge
  for (let i = 0; i < 200; i++) {
    let angle = random(TWO_PI);
    let distance = random(width * 0.5);
    let startX = width/2 + cos(angle) * distance;
    let startY = height/2 + sin(angle) * distance;
    
    lightStreaks.push({
      start: { x: startX, y: startY },
      end: { x: width/2, y: height/2 },
      alpha: random(30, 100),
      width: random(1, 3)
    });
  }
  
  // Create crystalline clusters
  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(10, 40);
    
    crystalClusters.push({
      x: x,
      y: y,
      size: size,
      rotation: random(TWO_PI),
      segments: 6 + floor(random(3)),
      alpha: random(50, 150)
    });
  }
}

function draw() {
  background(10);
  
  // Draw light streaks
  for (let streak of lightStreaks) {
    stroke(200, 180, 255, streak.alpha);
    strokeWeight(streak.width);
    
    line(streak.start.x, streak.start.y, streak.end.x, streak.end.y);
  }
  
  // Draw crystal clusters
  for (let cluster of crystalClusters) {
    push();
    translate(cluster.x, cluster.y);
    rotate(cluster.rotation);
    
    noFill();
    stroke(255, 255, 255, cluster.alpha);
    strokeWeight(1);
    
    // Draw angular crystal structure
    beginShape();
    for (let i = 0; i < cluster.segments; i++) {
      let angle = map(i, 0, cluster.segments, 0, TWO_PI);
      let x = cos(angle) * cluster.size;
      let y = sin(angle) * cluster.size;
      vertex(x, y);
      
      // Add inner points for more angular look
      if (i % 2 === 0) {
        let innerAngle = angle + PI / cluster.segments;
        let innerX = cos(innerAngle) * cluster.size * 0.6;
        let innerY = sin(innerAngle) * cluster.size * 0.6;
        vertex(innerX, innerY);
      }
    }
    endShape(CLOSE);
    
    // Add connecting lines between points
    stroke(200, 180, 255, cluster.alpha * 0.7);
    strokeWeight(0.5);
    for (let i = 0; i < cluster.segments; i++) {
      let angle1 = map(i, 0, cluster.segments, 0, TWO_PI);
      let angle2 = map((i + 1) % cluster.segments, 0, cluster.segments, 0, TWO_PI);
      
      let x1 = cos(angle1) * cluster.size;
      let y1 = sin(angle1) * cluster.size;
      let x2 = cos(angle2) * cluster.size;
      let y2 = sin(angle2) * cluster.size;
      
      line(x1, y1, x2, y2);
    }
    
    pop();
  }
  
  // Add subtle animated glow effect
  blendMode(ADD);
  fill(20, 10, 40, 5);
  noStroke();
  rect(0, 0, width, height);
  blendMode(BLEND);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
