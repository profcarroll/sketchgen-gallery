let tendrils = [];
let maxTendrils = 200;
let pulseSpeed = 0.03;
let branchChance = 0.015;
let maxDepth = 6;
let bgColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  bgColor = color(10, 5, 20);
  background(bgColor);
  
  // Start with a few initial tendrils
  for (let i = 0; i < 8; i++) {
    tendrils.push({
      x: random(width),
      y: random(height),
      angle: random(TWO_PI),
      length: random(1, 3),
      depth: 0,
      segments: [],
      color: color(random(200, 255), random(50, 150), 0, 200),
      speed: random(0.3, 1.2),
      pulseOffset: random(1000)
    });
  }
}

function draw() {
  // Semi-transparent overlay for trail effect
  fill(bgColor);
  rect(0, 0, width, height);
  
  // Update and draw tendrils
  for (let i = tendrils.length - 1; i >= 0; i--) {
    let tendril = tendrils[i];
    
    // Move tendril forward
    tendril.x += cos(tendril.angle) * tendril.length * tendril.speed;
    tendril.y += sin(tendril.angle) * tendril.length * tendril.speed;
    
    // Add to segments for drawing
    tendril.segments.push({x: tendril.x, y: tendril.y});
    
    // Occasionally change direction with a more organic feel
    if (random() < 0.15) {
      tendril.angle += random(-0.1, 0.1);
    }
    
    // Occasionally branch
    if (tendril.depth < maxDepth && random() < branchChance) {
      let newTendril = {
        x: tendril.x,
        y: tendril.y,
        angle: tendril.angle + random(-0.3, 0.3),
        length: random(1, 3),
        depth: tendril.depth + 1,
        segments: [],
        color: tendril.color,
        speed: tendril.speed * random(0.8, 1.2),
        pulseOffset: random(1000)
      };
      tendrils.push(newTendril);
    }
    
    // Draw the tendril with a pulsing effect
    noFill();
    stroke(tendril.color);
    strokeWeight(1.2);
    beginShape();
    for (let j = 0; j < tendril.segments.length; j++) {
      let seg = tendril.segments[j];
      let pulse = sin(frameCount * pulseSpeed + seg.x * 0.03 + tendril.pulseOffset) * 0.4 + 1;
      vertex(seg.x, seg.y * pulse);
    }
    endShape();
    
    // Remove old segments to keep the trail
    if (tendril.segments.length > 150) {
      tendril.segments.shift();
    }
    
    // Remove tendrils that are off-screen or too old
    if (tendril.x < -100 || tendril.x > width + 100 || 
        tendril.y < -100 || tendril.y > height + 100 ||
        tendril.segments.length > 400) {
      tendrils.splice(i, 1);
    }
  }
  
  // Occasionally add a new tendril
  if (random() < 0.02 && tendrils.length < maxTendrils) {
    let angle = random(TWO_PI);
    tendrils.push({
      x: random(width),
      y: random(height),
      angle: angle,
      length: random(1, 3),
      depth: 0,
      segments: [],
      color: color(random(200, 255), random(50, 150), 0, 200),
      speed: random(0.3, 1.2),
      pulseOffset: random(1000)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
