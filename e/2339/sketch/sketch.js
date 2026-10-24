let leafSegments = [];
let maxSegments = 150;
let animationSpeed = 0.005;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  frameRate(30);

  // Initialize leaf segments
  for (let i = 0; i < 20; i++) {
    leafSegments.push({
      x: random(width),
      y: random(height),
      size: random(50, 120),
      hue: random(30, 80), // Green range for botanical
      rotation: random(TWO_PI),
      segmentType: floor(random(3)), // 0: vein, 1: cell, 2: boundary
      isGrowing: true,
      growth: 0,
      targetSize: random(50, 120)
    });
  }
}

function draw() {
  // Semi-transparent background for trail effect
  background(0, 0, 100, 0.03);

  time += animationSpeed;

  // Draw all segments
  for (let i = 0; i < leafSegments.length; i++) {
    let seg = leafSegments[i];

    if (seg.isGrowing) {
      seg.growth += 0.01;
      if (seg.growth >= 1) {
        seg.isGrowing = false;
        seg.size = seg.targetSize;
      } else {
        seg.size = lerp(seg.size, seg.targetSize, seg.growth);
      }
    }

    push();
    translate(seg.x, seg.y);
    rotate(seg.rotation);

    // Draw based on segment type
    if (seg.segmentType === 0) {
      // Vein structure - thin and dark
      fill(seg.hue, 100, 20, 0.8);
      rectMode(CENTER);
      rect(0, 0, seg.size * 0.1, seg.size * 0.8);
    } else if (seg.segmentType === 1) {
      // Cell structure - soft, light green with texture
      fill(seg.hue, 60, 80, 0.7);
      rectMode(CENTER);
      rect(0, 0, seg.size * 0.9, seg.size * 0.9);

      // Subtle cell boundary lines
      stroke(seg.hue, 40, 60, 0.5);
      strokeWeight(0.5);
      noFill();
      rect(0, 0, seg.size * 0.9, seg.size * 0.9);
    } else {
      // Boundary - thick, slightly darker
      fill(seg.hue, 80, 40, 0.6);
      rectMode(CENTER);
      rect(0, 0, seg.size, seg.size);

      // Boundary texture lines (Victorian style)
      stroke(seg.hue, 100, 30, 0.4);
      strokeWeight(0.8);
      noFill();
      for (let j = 0; j < 3; j++) {
        let offset = map(j, 0, 2, -seg.size/2, seg.size/2);
        line(offset, -seg.size/2, offset, seg.size/2);
      }
    }

    pop();

    // Occasionally add new segments
    if (random() < 0.005 && leafSegments.length < maxSegments) {
      let angle = random(TWO_PI);
      let distance = random(100, 300);
      let newX = seg.x + cos(angle) * distance;
      let newY = seg.y + sin(angle) * distance;

      leafSegments.push({
        x: newX,
        y: newY,
        size: random(50, 120),
        hue: (seg.hue + random(-10, 10)) % 360,
        rotation: random(TWO_PI),
        segmentType: floor(random(3)),
        isGrowing: true,
        growth: 0,
        targetSize: random(50, 120)
      });
    }
  }

  // Limit segments to prevent overflow
  if (leafSegments.length > maxSegments) {
    leafSegments.splice(0, leafSegments.length - maxSegments);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
