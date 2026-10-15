let veins = [];
let branchChance = 0.02;
let maxDepth = 8;
let currentId = 0;

function setup() {
  createCanvas(800, 400);
  background(0);
  
  // Start with a single vein
  veins.push({
    id: currentId++,
    x: width / 2,
    y: height / 2,
    angle: random(TWO_PI),
    length: random(5, 15),
    depth: 0,
    color: color(255, 50, 255, 200),
    segments: []
  });
}

function draw() {
  // Semi-transparent overlay for trail effect
  fill(0, 10);
  rect(0, 0, width, height);
  
  // Update and draw veins
  for (let i = veins.length - 1; i >= 0; i--) {
    let vein = veins[i];
    
    // Move vein forward
    vein.x += cos(vein.angle) * vein.length;
    vein.y += sin(vein.angle) * vein.length;
    
    // Add to segments for drawing
    vein.segments.push({x: vein.x, y: vein.y});
    
    // Occasionally change direction
    if (random() < 0.1) {
      vein.angle += random(-0.5, 0.5);
    }
    
    // Occasionally branch
    if (vein.depth < maxDepth && random() < branchChance) {
      let newVein = {
        id: currentId++,
        x: vein.x,
        y: vein.y,
        angle: vein.angle + random(-0.3, 0.3),
        length: random(5, 15),
        depth: vein.depth + 1,
        color: vein.color,
        segments: []
      };
      veins.push(newVein);
    }
    
    // Draw the vein
    noFill();
    stroke(vein.color);
    strokeWeight(2);
    beginShape();
    for (let seg of vein.segments) {
      let pulse = sin(frameCount * 0.05 + seg.x * 0.01) * 0.3 + 1;
      vertex(seg.x, seg.y * pulse);
    }
    endShape();
    
    // Remove old segments to keep the trail
    if (vein.segments.length > 200) {
      vein.segments.shift();
    }
    
    // Remove veins that are off-screen or too old
    if (vein.x < -100 || vein.x > width + 100 || 
        vein.y < -100 || vein.y > height + 100 ||
        vein.segments.length > 500) {
      veins.splice(i, 1);
    }
  }
  
  // Occasionally add a new vein
  if (random() < 0.01 && veins.length < 100) {
    let angle = random(TWO_PI);
    veins.push({
      id: currentId++,
      x: random(width),
      y: random(height),
      angle: angle,
      length: random(5, 15),
      depth: 0,
      color: color(255, 50, 255, 200),
      segments: []
    });
  }
}
