let corals = [];
let maxCorals = 150;
let pulseSpeed = 0.02;
let branchChance = 0.01;
let maxDepth = 8;
let bgColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  bgColor = color(5, 2, 15);
  background(bgColor);
  
  // Start with a few initial coral structures
  for (let i = 0; i < 5; i++) {
    corals.push({
      x: random(width),
      y: random(height),
      angle: random(TWO_PI),
      length: random(2, 5),
      depth: 0,
      segments: [],
      color: color(random(180, 255), random(40, 120), 0, 220),
      speed: random(0.2, 0.8),
      pulseOffset: random(1000),
      isGrowing: true
    });
  }
}

function draw() {
  // Semi-transparent overlay for trail effect
  fill(bgColor);
  rect(0, 0, width, height);
  
  // Update and draw coral structures
  for (let i = corals.length - 1; i >= 0; i--) {
    let coral = corals[i];
    
    if (!coral.isGrowing) continue;
    
    // Move coral forward
    coral.x += cos(coral.angle) * coral.length * coral.speed;
    coral.y += sin(coral.angle) * coral.length * coral.speed;
    
    // Add to segments for drawing
    coral.segments.push({x: coral.x, y: coral.y});
    
    // Occasionally change direction with a more organic feel
    if (random() < 0.1) {
      coral.angle += random(-0.15, 0.15);
    }
    
    // Occasionally branch
    if (coral.depth < maxDepth && random() < branchChance) {
      let newCoral = {
        x: coral.x,
        y: coral.y,
        angle: coral.angle + random(-0.4, 0.4),
        length: random(2, 5),
        depth: coral.depth + 1,
        segments: [],
        color: coral.color,
        speed: coral.speed * random(0.7, 1.3),
        pulseOffset: random(1000),
        isGrowing: true
      };
      corals.push(newCoral);
    }
    
    // Draw the coral with a pulsing effect
    noFill();
    stroke(coral.color);
    strokeWeight(1.5);
    beginShape();
    for (let j = 0; j < coral.segments.length; j++) {
      let seg = coral.segments[j];
      let pulse = sin(frameCount * pulseSpeed + seg.x * 0.02 + coral.pulseOffset) * 0.3 + 1;
      vertex(seg.x, seg.y * pulse);
    }
    endShape();
    
    // Remove old segments to keep the trail
    if (coral.segments.length > 200) {
      coral.segments.shift();
    }
    
    // Remove corals that are off-screen or too old
    if (coral.x < -150 || coral.x > width + 150 || 
        coral.y < -150 || coral.y > height + 150 ||
        coral.segments.length > 500) {
      corals.splice(i, 1);
    }
  }
  
  // Occasionally add a new coral structure
  if (random() < 0.015 && corals.length < maxCorals) {
    let angle = random(TWO_PI);
    corals.push({
      x: random(width),
      y: random(height),
      angle: angle,
      length: random(2, 5),
      depth: 0,
      segments: [],
      color: color(random(180, 255), random(40, 120), 0, 220),
      speed: random(0.2, 0.8),
      pulseOffset: random(1000),
      isGrowing: true
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
