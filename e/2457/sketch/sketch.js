let glassSheets = [];
let stressPoints = [];
let lastDragTime = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize glass sheets
  for (let i = 0; i < 30; i++) {
    glassSheets.push({
      x: random(width),
      y: random(height),
      segments: [],
      growthRate: random(0.01, 0.03),
      stress: 0,
      maxStress: random(0.7, 0.9),
      color: color(random(180, 220), random(20, 40), random(80, 95), 0.7),
      angle: random(TWO_PI),
      speed: random(0.3, 1.0),
      isGrowing: true,
      layer: i % 5
    });
  }
  
  // Add initial segments to each sheet
  for (let i = 0; i < glassSheets.length; i++) {
    let sheet = glassSheets[i];
    sheet.segments.push({
      x: sheet.x,
      y: sheet.y,
      size: random(1, 3),
      stress: 0
    });
  }
}

function draw() {
  background(25);
  
  // Update and display glass sheets
  for (let i = 0; i < glassSheets.length; i++) {
    let sheet = glassSheets[i];
    
    if (sheet.isGrowing) {
      // Grow the sheet
      let lastSegment = sheet.segments[sheet.segments.length - 1];
      sheet.x += cos(sheet.angle) * sheet.speed;
      sheet.y += sin(sheet.angle) * sheet.speed;
      
      // Wrap around screen
      if (sheet.x < -50) sheet.x = width + 50;
      if (sheet.x > width + 50) sheet.x = -50;
      if (sheet.y < -50) sheet.y = height + 50;
      if (sheet.y > height + 50) sheet.y = -50;
      
      // Add new segment
      if (frameCount % 3 === 0) {
        sheet.segments.push({
          x: sheet.x,
          y: sheet.y,
          size: random(1, 3),
          stress: 0
        });
        
        // Occasionally change direction
        if (random() < 0.05) {
          sheet.angle += random(-0.2, 0.2);
        }
      }
      
      // Build stress
      sheet.stress += sheet.growthRate;
      
      // Check for fracture
      if (sheet.stress > sheet.maxStress) {
        triggerFracture(sheet);
      }
    }
    
    // Draw segments
    beginShape();
    for (let j = 0; j < sheet.segments.length; j++) {
      let seg = sheet.segments[j];
      fill(sheet.color);
      noStroke();
      
      if (seg.stress > 0.6) {
        // Highlight stressed areas
        fill(180, 100, 100, 0.8);
      }
      
      ellipse(seg.x, seg.y, seg.size);
    }
    endShape();
    
    // Draw connections between segments in same sheet
    stroke(180, 20, 20, 0.3);
    strokeWeight(0.3);
    beginShape(LINES);
    for (let j = 0; j < sheet.segments.length - 1; j++) {
      let seg1 = sheet.segments[j];
      let seg2 = sheet.segments[j + 1];
      vertex(seg1.x, seg1.y);
      vertex(seg2.x, seg2.y);
    }
    endShape();
  }
  
  // Draw stress points (crystalline fractures)
  for (let i = 0; i < stressPoints.length; i++) {
    let point = stressPoints[i];
    point.lifetime--;
    
    if (point.lifetime > 0) {
      fill(point.color);
      noStroke();
      
      // Draw fracture pattern
      push();
      translate(point.x, point.y);
      rotate(point.angle);
      for (let j = 0; j < point.segments; j++) {
        let size = map(point.lifetime, 0, point.maxLifetime, 3, 0);
        ellipse(0, j * 2, size, size);
      }
      pop();
    } else {
      stressPoints.splice(i, 1);
      i--;
    }
  }
  
  // Occasionally trigger spontaneous fracture
  if (frameCount % 150 === 0 && glassSheets.length > 0) {
    let sheet = glassSheets[floor(random(glassSheets.length))];
    if (sheet.isGrowing && sheet.stress < sheet.maxStress) {
      sheet.stress += 0.3;
    }
  }
}

function triggerFracture(sheet) {
  // Create stress points at fracture locations
  for (let i = 0; i < sheet.segments.length - 1; i++) {
    let seg1 = sheet.segments[i];
    let seg2 = sheet.segments[i + 1];
    
    if (random() < 0.4) { // Random chance of fracture
      stressPoints.push({
        x: (seg1.x + seg2.x) / 2,
        y: (seg1.y + seg2.y) / 2,
        color: color(180, 100, 100, 0.9),
        angle: random(TWO_PI),
        segments: floor(random(2, 6)),
        lifetime: 25,
        maxLifetime: 25
      });
    }
  }
  
  // Reset sheet stress and stop growing
  sheet.stress = 0;
  sheet.isGrowing = false;
  
  // Create new sheet nearby to continue growth
  if (random() < 0.6) {
    glassSheets.push({
      x: sheet.x + random(-40, 40),
      y: sheet.y + random(-40, 40),
      segments: [],
      growthRate: random(0.01, 0.03),
      stress: 0,
      maxStress: random(0.7, 0.9),
      color: sheet.color,
      angle: random(TWO_PI),
      speed: random(0.3, 1.0),
      isGrowing: true,
      layer: (sheet.layer + 1) % 5
    });
    
    // Add initial segments to new sheet
    let newSheet = glassSheets[glassSheets.length - 1];
    newSheet.segments.push({
      x: newSheet.x,
      y: newSheet.y,
      size: random(1, 3),
      stress: 0
    });
  }
}

function mouseDragged() {
  // Amplify existing stress with cursor drag
  let currentTime = millis();
  if (currentTime - lastDragTime > 50) { // Limit rate of stress amplification
    for (let i = 0; i < glassSheets.length; i++) {
      let sheet = glassSheets[i];
      let d = dist(mouseX, mouseY, sheet.x, sheet.y);
      
      if (d < 100) {
        sheet.stress += map(d, 0, 100, 0.2, 0);
        
        // Trigger fracture if stress exceeds threshold
        if (sheet.stress > sheet.maxStress) {
          triggerFracture(sheet);
        }
      }
    }
    lastDragTime = currentTime;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
