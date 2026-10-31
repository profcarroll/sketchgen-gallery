let structures = [];
let numStructures = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize kelp-like structures with organic properties
  for (let i = 0; i < numStructures; i++) {
    structures.push({
      x: random(width),
      y: random(height),
      baseRadius: random(20, 60),
      height: random(150, 300),
      segments: [],
      phase: random(TWO_PI),
      tension: random(0.005, 0.02),
      state: 'forming', // 'forming', 'holding', 'slumping', 'fracturing'
      progress: 0,
      maxProgress: random(100, 300),
      color: color(random(180, 240), 70, 60, 0.9),
      parts: [],
      numParts: floor(random(15, 30)),
      collapseTime: 0,
      maxCollapseTime: random(100, 300),
      segmentsCount: floor(random(8, 15))
    });
  }
}

function draw() {
  background(0, 0, 5);
  
  // Update and draw structures
  for (let i = 0; i < structures.length; i++) {
    let s = structures[i];
    
    if (s.state === 'forming') {
      s.progress += 0.8;
      if (s.progress >= s.maxProgress) {
        s.state = 'holding';
        s.progress = 0;
      }
    } else if (s.state === 'holding') {
      s.progress++;
      if (s.progress > s.maxProgress * 2) {
        s.state = 'slumping';
        s.progress = 0;
        s.collapseTime = 0;
        // Create parts for crumbling
        s.parts = [];
        for (let j = 0; j < s.numParts; j++) {
          s.parts.push({
            x: s.x + random(-s.baseRadius, s.baseRadius),
            y: s.y + random(-s.height/2, s.height/2),
            vx: random(-1, 1),
            vy: random(-1, 1),
            size: random(2, 6),
            color: s.color,
            life: random(50, 150)
          });
        }
      }
    } else if (s.state === 'slumping') {
      s.collapseTime++;
      if (s.collapseTime > s.maxCollapseTime) {
        s.state = 'fracturing';
        s.progress = 0;
      }
    } else if (s.state === 'fracturing') {
      s.progress++;
      if (s.progress > 200) {
        // Reset structure
        s.x = random(width);
        s.y = random(height);
        s.baseRadius = random(20, 60);
        s.height = random(150, 300);
        s.state = 'forming';
        s.progress = 0;
        s.maxProgress = random(100, 300);
        s.collapseTime = 0;
        s.maxCollapseTime = random(100, 300);
        s.segmentsCount = floor(random(8, 15));
      }
    }
    
    // Draw structure based on state
    push();
    translate(s.x, s.y);
    
    if (s.state === 'forming') {
      // Draw forming kelp with interwoven arcs and loops
      stroke(s.color);
      strokeWeight(1.5);
      noFill();
      
      let segments = [];
      for (let j = 0; j < s.segmentsCount; j++) {
        let t = map(j, 0, s.segmentsCount - 1, 0, 1);
        let angle = map(j, 0, s.segmentsCount - 1, 0, TWO_PI * 2);
        let radius = map(t, 0, 1, s.baseRadius, s.baseRadius * 0.5);
        let x = cos(angle) * radius;
        let y = lerp(-s.height/2, s.height/2, t);
        segments.push({x, y});
      }
      
      // Animate forming with tension and organic motion
      let phaseOffset = s.phase + s.tension * s.progress;
      beginShape();
      for (let j = 0; j < segments.length; j++) {
        let seg = segments[j];
        let offset = sin(phaseOffset + j * 0.5) * map(s.progress, 0, s.maxProgress, 0, 20);
        vertex(seg.x, seg.y + offset);
      }
      endShape();
      
    } else if (s.state === 'holding') {
      // Draw solid kelp frond
      stroke(s.color);
      strokeWeight(1.5);
      noFill();
      
      let segments = [];
      for (let j = 0; j < s.segmentsCount; j++) {
        let t = map(j, 0, s.segmentsCount - 1, 0, 1);
        let angle = map(j, 0, s.segmentsCount - 1, 0, TWO_PI * 2.5);
        let radius = map(t, 0, 1, s.baseRadius, s.baseRadius * 0.3);
        let x = cos(angle) * radius;
        let y = lerp(-s.height/2, s.height/2, t);
        segments.push({x, y});
      }
      
      beginShape();
      for (let j = 0; j < segments.length; j++) {
        let seg = segments[j];
        vertex(seg.x, seg.y);
      }
      endShape(CLOSE);
      
      // Add interwoven loops
      strokeWeight(1);
      for (let j = 0; j < 3; j++) {
        let angleOffset = j * TWO_PI / 3;
        beginShape();
        for (let k = 0; k < segments.length; k++) {
          let seg = segments[k];
          let angle = angleOffset + sin(seg.y * 0.02) * 0.5;
          let radius = map(k, 0, segments.length - 1, s.baseRadius * 0.8, s.baseRadius * 0.4);
          let x = cos(angle) * radius;
          let y = seg.y;
          vertex(x, y);
        }
        endShape();
      }
      
    } else if (s.state === 'slumping') {
      // Draw slumping kelp with distortion
      stroke(s.color);
      strokeWeight(1.5);
      noFill();
      
      let segments = [];
      for (let j = 0; j < s.segmentsCount; j++) {
        let t = map(j, 0, s.segmentsCount - 1, 0, 1);
        let angle = map(j, 0, s.segmentsCount - 1, 0, TWO_PI * 2.5);
        let radius = map(t, 0, 1, s.baseRadius, s.baseRadius * 0.3);
        let x = cos(angle) * radius;
        let y = lerp(-s.height/2, s.height/2, t);
        segments.push({x, y});
      }
      
      // Add slumping distortion
      let distort = sin(s.collapseTime * 0.1) * 15;
      beginShape();
      for (let j = 0; j < segments.length; j++) {
        let seg = segments[j];
        let offset = sin(s.collapseTime * 0.2 + j * 0.3) * 8;
        vertex(seg.x, seg.y + distort + offset);
      }
      endShape();
      
    } else if (s.state === 'fracturing') {
      // Draw crumbling kelp parts
      noStroke();
      for (let j = 0; j < s.parts.length; j++) {
        let p = s.parts[j];
        fill(p.color);
        ellipse(p.x - s.x, p.y - s.y, p.size);
      }
    }
    
    pop();
  }
  
  // Update parts in fracturing state
  for (let i = 0; i < structures.length; i++) {
    let s = structures[i];
    if (s.state === 'fracturing') {
      for (let j = 0; j < s.parts.length; j++) {
        let p = s.parts[j];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // gravity
        p.life--;
        if (p.life <= 0) {
          // Reset part
          p.x = s.x + random(-s.baseRadius, s.baseRadius);
          p.y = s.y + random(-s.height/2, s.height/2);
          p.vx = random(-1, 1);
          p.vy = random(-1, 1);
          p.life = random(50, 150);
        }
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
