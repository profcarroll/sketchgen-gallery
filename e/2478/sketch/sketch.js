let structures = [];
let numStructures = 15;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize structures with concrete-like properties
  for (let i = 0; i < numStructures; i++) {
    structures.push({
      x: random(width),
      y: random(height),
      width: random(80, 200),
      height: random(150, 300),
      segments: [],
      phase: random(TWO_PI),
      tension: random(0.005, 0.02),
      state: 'forming', // 'forming', 'holding', 'slumping', 'fracturing'
      progress: 0,
      maxProgress: random(100, 300),
      color: color(random(20, 40), 60, 50, 0.9),
      parts: [],
      numParts: floor(random(8, 20)),
      collapseTime: 0,
      maxCollapseTime: random(100, 300)
    });
  }
}

function draw() {
  background(0, 0, 10);
  
  // Update and draw structures
  for (let i = 0; i < structures.length; i++) {
    let s = structures[i];
    
    if (s.state === 'forming') {
      s.progress += 0.5;
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
            x: s.x + random(-s.width/2, s.width/2),
            y: s.y + random(-s.height/2, s.height/2),
            vx: random(-1, 1),
            vy: random(-1, 1),
            size: random(3, 8),
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
        s.width = random(80, 200);
        s.height = random(150, 300);
        s.state = 'forming';
        s.progress = 0;
        s.maxProgress = random(100, 300);
        s.collapseTime = 0;
        s.maxCollapseTime = random(100, 300);
      }
    }
    
    // Draw structure based on state
    push();
    translate(s.x, s.y);
    
    if (s.state === 'forming') {
      // Draw forming structure with tension lines
      stroke(s.color);
      strokeWeight(2);
      noFill();
      
      let segments = [];
      let segmentCount = 10;
      for (let j = 0; j < segmentCount; j++) {
        let t = map(j, 0, segmentCount - 1, 0, 1);
        let x = lerp(-s.width/2, s.width/2, t);
        let y = lerp(-s.height/2, s.height/2, t);
        segments.push({x, y});
      }
      
      // Animate forming with tension
      let phaseOffset = s.phase + s.tension * s.progress;
      for (let j = 0; j < segments.length - 1; j++) {
        let x1 = segments[j].x;
        let y1 = segments[j].y;
        let x2 = segments[j+1].x;
        let y2 = segments[j+1].y;
        
        // Add tension effect
        let tension = sin(phaseOffset + j * 0.5) * map(s.progress, 0, s.maxProgress, 0, 10);
        y1 += tension;
        y2 += tension;
        
        line(x1, y1, x2, y2);
      }
      
    } else if (s.state === 'holding') {
      // Draw solid structure
      fill(s.color);
      noStroke();
      rectMode(CENTER);
      rect(0, 0, s.width, s.height);
      
      // Add concrete texture
      stroke(0, 0, 30);
      strokeWeight(1);
      for (let j = 0; j < 20; j++) {
        let x = random(-s.width/2, s.width/2);
        let y = random(-s.height/2, s.height/2);
        line(x, y, x + random(-5, 5), y + random(-5, 5));
      }
      
    } else if (s.state === 'slumping') {
      // Draw slumping structure with distortion
      fill(s.color);
      noStroke();
      rectMode(CENTER);
      
      let distort = sin(s.collapseTime * 0.1) * 20;
      rect(0, distort, s.width, s.height);
      
      // Add more slumping lines
      stroke(s.color);
      strokeWeight(2);
      for (let j = 0; j < 5; j++) {
        let angle = map(j, 0, 4, -PI/4, PI/4);
        let x1 = s.width/2 * cos(angle);
        let y1 = -s.height/2 + j * 30;
        let x2 = s.width/2 * cos(angle + PI) * 0.8;
        let y2 = s.height/2 - j * 30;
        line(x1, y1, x2, y2);
      }
      
    } else if (s.state === 'fracturing') {
      // Draw crumbling rubble
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
          p.x = s.x + random(-s.width/2, s.width/2);
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
