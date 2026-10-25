let lines = [];
let maxLines = 100;
let pulseSpeed = 0.05;
let branchChance = 0.02;
let maxDepth = 8;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  
  // Start with a few initial lines
  for (let i = 0; i < 5; i++) {
    lines.push({
      x: random(width),
      y: random(height),
      angle: random(TWO_PI),
      length: random(2, 6),
      depth: 0,
      segments: [],
      color: color(random(100, 255), random(100, 255), 255, 200),
      speed: random(0.5, 2)
    });
  }
}

function draw() {
  // Semi-transparent overlay for trail effect
  fill(0, 10);
  rect(0, 0, width, height);
  
  // Update and draw lines
  for (let i = lines.length - 1; i >= 0; i--) {
    let line = lines[i];
    
    // Move line forward
    line.x += cos(line.angle) * line.length * line.speed;
    line.y += sin(line.angle) * line.length * line.speed;
    
    // Add to segments for drawing
    line.segments.push({x: line.x, y: line.y});
    
    // Occasionally change direction with a more organic feel
    if (random() < 0.1) {
      line.angle += random(-0.2, 0.2);
    }
    
    // Occasionally branch
    if (line.depth < maxDepth && random() < branchChance) {
      let newLine = {
        x: line.x,
        y: line.y,
        angle: line.angle + random(-0.5, 0.5),
        length: random(2, 6),
        depth: line.depth + 1,
        segments: [],
        color: line.color,
        speed: line.speed * random(0.8, 1.2)
      };
      lines.push(newLine);
    }
    
    // Draw the line with a pulsing effect
    noFill();
    stroke(line.color);
    strokeWeight(1.5);
    beginShape();
    for (let j = 0; j < line.segments.length; j++) {
      let seg = line.segments[j];
      let pulse = sin(frameCount * pulseSpeed + seg.x * 0.02) * 0.3 + 1;
      vertex(seg.x, seg.y * pulse);
    }
    endShape();
    
    // Remove old segments to keep the trail
    if (line.segments.length > 100) {
      line.segments.shift();
    }
    
    // Remove lines that are off-screen or too old
    if (line.x < -50 || line.x > width + 50 || 
        line.y < -50 || line.y > height + 50 ||
        line.segments.length > 300) {
      lines.splice(i, 1);
    }
  }
  
  // Occasionally add a new line
  if (random() < 0.03 && lines.length < maxLines) {
    let angle = random(TWO_PI);
    lines.push({
      x: random(width),
      y: random(height),
      angle: angle,
      length: random(2, 6),
      depth: 0,
      segments: [],
      color: color(random(100, 255), random(100, 255), 255, 200),
      speed: random(0.5, 2)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
