let rootSystems = [];
let stressPoints = [];
let lastDragTime = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize root systems
  for (let i = 0; i < 50; i++) {
    rootSystems.push({
      x: random(width),
      y: random(height),
      segments: [],
      growthRate: random(0.02, 0.05),
      stress: 0,
      maxStress: random(0.8, 1.0),
      color: color(random(20, 40), random(30, 60), random(10, 30), 0.8),
      angle: random(TWO_PI),
      speed: random(0.5, 1.5),
      isGrowing: true
    });
  }
  
  // Add initial segments to each system
  for (let i = 0; i < rootSystems.length; i++) {
    let system = rootSystems[i];
    system.segments.push({
      x: system.x,
      y: system.y,
      size: random(2, 6),
      stress: 0
    });
  }
}

function draw() {
  background(25);
  
  // Update and display root systems
  for (let i = 0; i < rootSystems.length; i++) {
    let system = rootSystems[i];
    
    if (system.isGrowing) {
      // Grow the system
      let lastSegment = system.segments[system.segments.length - 1];
      system.x += cos(system.angle) * system.speed;
      system.y += sin(system.angle) * system.speed;
      
      // Wrap around screen
      if (system.x < -50) system.x = width + 50;
      if (system.x > width + 50) system.x = -50;
      if (system.y < -50) system.y = height + 50;
      if (system.y > height + 50) system.y = -50;
      
      // Add new segment
      if (frameCount % 5 === 0) {
        system.segments.push({
          x: system.x,
          y: system.y,
          size: random(2, 6),
          stress: 0
        });
        
        // Occasionally change direction
        if (random() < 0.1) {
          system.angle += random(-0.3, 0.3);
        }
      }
      
      // Build stress
      system.stress += system.growthRate;
      
      // Check for fracture
      if (system.stress > system.maxStress) {
        triggerFracture(system);
      }
    }
    
    // Draw segments
    beginShape();
    for (let j = 0; j < system.segments.length; j++) {
      let seg = system.segments[j];
      fill(system.color);
      noStroke();
      
      if (seg.stress > 0.7) {
        // Highlight stressed areas
        fill(20, 100, 100, 0.8);
      }
      
      ellipse(seg.x, seg.y, seg.size);
    }
    endShape();
    
    // Draw connections between segments in same system
    stroke(20, 30, 20, 0.5);
    strokeWeight(0.5);
    beginShape(LINES);
    for (let j = 0; j < system.segments.length - 1; j++) {
      let seg1 = system.segments[j];
      let seg2 = system.segments[j + 1];
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
        let size = map(point.lifetime, 0, point.maxLifetime, 5, 0);
        ellipse(0, j * 3, size, size);
      }
      pop();
    } else {
      stressPoints.splice(i, 1);
      i--;
    }
  }
  
  // Occasionally trigger spontaneous fracture
  if (frameCount % 200 === 0 && rootSystems.length > 0) {
    let system = rootSystems[floor(random(rootSystems.length))];
    if (system.isGrowing && system.stress < system.maxStress) {
      system.stress += 0.5;
    }
  }
}

function triggerFracture(system) {
  // Create stress points at fracture locations
  for (let i = 0; i < system.segments.length - 1; i++) {
    let seg1 = system.segments[i];
    let seg2 = system.segments[i + 1];
    
    if (random() < 0.3) { // Random chance of fracture
      stressPoints.push({
        x: (seg1.x + seg2.x) / 2,
        y: (seg1.y + seg2.y) / 2,
        color: color(20, 100, 100, 0.9),
        angle: random(TWO_PI),
        segments: floor(random(3, 8)),
        lifetime: 30,
        maxLifetime: 30
      });
    }
  }
  
  // Reset system stress and stop growing
  system.stress = 0;
  system.isGrowing = false;
  
  // Create new root system nearby to continue growth
  if (random() < 0.7) {
    rootSystems.push({
      x: system.x + random(-50, 50),
      y: system.y + random(-50, 50),
      segments: [],
      growthRate: random(0.02, 0.05),
      stress: 0,
      maxStress: random(0.8, 1.0),
      color: system.color,
      angle: random(TWO_PI),
      speed: random(0.5, 1.5),
      isGrowing: true
    });
    
    // Add initial segments to new system
    let newSystem = rootSystems[rootSystems.length - 1];
    newSystem.segments.push({
      x: newSystem.x,
      y: newSystem.y,
      size: random(2, 6),
      stress: 0
    });
  }
}

function mouseDragged() {
  // Amplify existing stress with cursor drag
  let currentTime = millis();
  if (currentTime - lastDragTime > 50) { // Limit rate of stress amplification
    for (let i = 0; i < rootSystems.length; i++) {
      let system = rootSystems[i];
      let d = dist(mouseX, mouseY, system.x, system.y);
      
      if (d < 100) {
        system.stress += map(d, 0, 100, 0.3, 0);
        
        // Trigger fracture if stress exceeds threshold
        if (system.stress > system.maxStress) {
          triggerFracture(system);
        }
      }
    }
    lastDragTime = currentTime;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
